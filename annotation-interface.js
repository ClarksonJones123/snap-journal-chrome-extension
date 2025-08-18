/**
 * Snap Journal - Annotation Interface Script
 * Handles the standalone annotation interface
 * Version: 2.0.1
 */

// Global variables
let currentScreenshot = null;
let annotationCounter = 0;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAnnotationInterface);

// Initialize annotation interface
async function initializeAnnotationInterface() {
  try {
    console.log('Initializing annotation interface...');
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if we have a screenshot ID in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const screenshotId = urlParams.get('id');
    
    if (screenshotId) {
      // Load existing screenshot
      await loadExistingScreenshot(screenshotId);
    } else {
      // Wait for screenshot data from background script
      chrome.runtime.onMessage.addListener(handleRuntimeMessage);
    }
    
  } catch (error) {
    console.error('Failed to initialize annotation interface:', error);
    showError('Failed to initialize annotation interface: ' + error.message);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Header buttons
  document.getElementById('save-btn').addEventListener('click', handleSaveScreenshot);
  document.getElementById('export-btn').addEventListener('click', handleExportPDF);
  document.getElementById('close-btn').addEventListener('click', handleCloseInterface);
  
  // Canvas click for adding annotations
  document.getElementById('annotation-canvas').addEventListener('click', handleCanvasClick);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle runtime messages
function handleRuntimeMessage(message, sender, sendResponse) {
  switch (message.action) {
    case 'loadScreenshot':
      loadScreenshotData(message.screenshotData)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open
  }
}

// Load existing screenshot by ID
async function loadExistingScreenshot(screenshotId) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'getScreenshot',
      id: screenshotId
    });
    
    if (response && response.success) {
      await loadScreenshotData(response.data);
    } else {
      throw new Error(response?.error || 'Screenshot not found');
    }
    
  } catch (error) {
    console.error('Failed to load existing screenshot:', error);
    showError('Failed to load screenshot: ' + error.message);
  }
}

// Load screenshot data into interface
async function loadScreenshotData(screenshotData) {
  try {
    console.log('Loading screenshot data:', screenshotData);
    
    currentScreenshot = screenshotData;
    
    // Update info panel
    document.getElementById('screenshot-url').textContent = screenshotData.url || 'Unknown URL';
    document.getElementById('screenshot-title').textContent = screenshotData.title || 'Untitled';
    document.getElementById('screenshot-timestamp').textContent = 
      new Date(screenshotData.timestamp).toLocaleString();
    
    // Load image into canvas
    await loadImageIntoCanvas(screenshotData.image);
    
    // Load existing annotations
    if (screenshotData.annotations && screenshotData.annotations.length > 0) {
      screenshotData.annotations.forEach(annotation => {
        addAnnotationToInterface(annotation);
      });
      annotationCounter = screenshotData.annotations.length;
    }
    
    // Update annotation count
    updateAnnotationCount();
    
    // Hide loading screen
    hideLoadingScreen();
    
    console.log('Screenshot loaded successfully');
    
  } catch (error) {
    console.error('Failed to load screenshot data:', error);
    hideLoadingScreen();
    showError('Failed to load screenshot: ' + error.message);
  }
}

// Load image into canvas
async function loadImageIntoCanvas(imageDataUrl) {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById('annotation-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = function() {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      // Update annotations overlay size
      const overlay = document.getElementById('annotations-overlay');
      overlay.style.width = img.width + 'px';
      overlay.style.height = img.height + 'px';
      
      resolve();
    };
    
    img.onerror = function() {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageDataUrl;
  });
}

// Handle canvas click for adding annotations
function handleCanvasClick(event) {
  try {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    
    // Calculate click position relative to canvas
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates to actual canvas size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // Create new annotation
    const annotation = {
      id: generateUniqueId(),
      number: ++annotationCounter,
      x: canvasX,
      y: canvasY,
      text: '',
      textX: canvasX + 30,
      textY: canvasY - 10,
      timestamp: new Date().toISOString()
    };
    
    // Add to current screenshot data
    if (!currentScreenshot.annotations) {
      currentScreenshot.annotations = [];
    }
    currentScreenshot.annotations.push(annotation);
    
    // Add to interface
    addAnnotationToInterface(annotation);
    
    // Update annotation count
    updateAnnotationCount();
    
    console.log('Added annotation:', annotation);
    
  } catch (error) {
    console.error('Failed to handle canvas click:', error);
    showError('Failed to add annotation: ' + error.message);
  }
}

// Add annotation to interface
function addAnnotationToInterface(annotation) {
  try {
    const overlay = document.getElementById('annotations-overlay');
    
    // Create marker element
    const marker = document.createElement('div');
    marker.className = 'annotation-marker';
    marker.style.left = (annotation.x - 8) + 'px';
    marker.style.top = (annotation.y - 8) + 'px';
    marker.dataset.annotationId = annotation.id;
    marker.textContent = annotation.number || annotationCounter;
    
    // Create text input element
    const textElement = document.createElement('div');
    textElement.className = 'annotation-text';
    textElement.style.left = annotation.textX + 'px';
    textElement.style.top = annotation.textY + 'px';
    textElement.dataset.annotationId = annotation.id;
    
    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.value = annotation.text || '';
    textInput.placeholder = 'Enter annotation...';
    
    textElement.appendChild(textInput);
    
    // Create arrow
    const arrow = createArrowSVG(annotation.x, annotation.y, annotation.textX, annotation.textY);
    arrow.dataset.annotationId = annotation.id;
    
    // Add event listeners
    textInput.addEventListener('input', (e) => {
      annotation.text = e.target.value;
      updateAnnotationsList();
    });
    
    textInput.addEventListener('blur', () => {
      if (!textInput.value.trim()) {
        // Remove annotation if text is empty
        removeAnnotation(annotation.id);
      }
    });
    
    // Make text element draggable
    makeDraggable(textElement, (newX, newY) => {
      annotation.textX = newX;
      annotation.textY = newY;
      updateArrow(arrow, annotation.x, annotation.y, newX, newY);
    });
    
    // Add elements to overlay
    overlay.appendChild(marker);
    overlay.appendChild(textElement);
    overlay.appendChild(arrow);
    
    // Focus on text input
    textInput.focus();
    
    // Update annotations list
    updateAnnotationsList();
    
  } catch (error) {
    console.error('Failed to add annotation to interface:', error);
  }
}

// Create SVG arrow
function createArrowSVG(startX, startY, endX, endY) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'annotation-arrow';
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', endX);
  line.setAttribute('y2', endY);
  line.setAttribute('stroke', '#2c3e50');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linecap', 'round');
  
  svg.appendChild(line);
  
  return svg;
}

// Update arrow position
function updateArrow(arrow, startX, startY, endX, endY) {
  const line = arrow.querySelector('line');
  line.setAttribute('x1', startX);
  line.setAttribute('y1', startY);
  line.setAttribute('x2', endX);
  line.setAttribute('y2', endY);
}

// Make element draggable
function makeDraggable(element, onMove) {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  element.addEventListener('mousedown', (e) => {
    // Don't drag if clicking on input
    if (e.target.tagName === 'INPUT') return;
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    initialX = parseInt(element.style.left) || 0;
    initialY = parseInt(element.style.top) || 0;
    
    element.style.cursor = 'grabbing';
    e.preventDefault();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    const newX = initialX + deltaX;
    const newY = initialY + deltaY;
    
    element.style.left = newX + 'px';
    element.style.top = newY + 'px';
    
    if (onMove) {
      onMove(newX, newY);
    }
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'move';
    }
  });
  
  element.style.cursor = 'move';
}

// Remove annotation
function removeAnnotation(annotationId) {
  try {
    // Remove from data
    if (currentScreenshot.annotations) {
      currentScreenshot.annotations = currentScreenshot.annotations.filter(a => a.id !== annotationId);
    }
    
    // Remove from interface
    const elements = document.querySelectorAll(`[data-annotation-id="${annotationId}"]`);
    elements.forEach(el => el.remove());
    
    // Update displays
    updateAnnotationCount();
    updateAnnotationsList();
    
  } catch (error) {
    console.error('Failed to remove annotation:', error);
  }
}

// Update annotation count
function updateAnnotationCount() {
  const count = currentScreenshot?.annotations?.length || 0;
  document.getElementById('annotation-count').textContent = count;
}

// Update annotations list
function updateAnnotationsList() {
  const container = document.getElementById('annotations-container');
  
  if (!currentScreenshot?.annotations || currentScreenshot.annotations.length === 0) {
    container.innerHTML = '<p>No annotations yet. Click on the screenshot to add markers.</p>';
    return;
  }
  
  const html = currentScreenshot.annotations.map(annotation => `
    <div class="annotation-item">
      <div style="color: #1abc9c; font-weight: bold; margin-bottom: 4px;">
        Annotation ${annotation.number || '?'}
      </div>
      <div style="margin-bottom: 4px;">
        ${annotation.text || 'No text'}
      </div>
      <div style="color: #95a5a6; font-size: 11px;">
        Position: (${Math.round(annotation.x)}, ${Math.round(annotation.y)})
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Handle save screenshot
async function handleSaveScreenshot() {
  try {
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    if (!currentScreenshot) {
      throw new Error('No screenshot data to save');
    }
    
    const response = await chrome.runtime.sendMessage({
      action: 'saveScreenshot',
      data: currentScreenshot
    });
    
    if (response && response.success) {
      saveBtn.textContent = 'Saved!';
      saveBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      
      setTimeout(() => {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Screenshot';
        saveBtn.style.background = '';
      }, 2000);
      
      showSuccess('Screenshot saved successfully!');
    } else {
      throw new Error(response?.error || 'Failed to save screenshot');
    }
    
  } catch (error) {
    console.error('Failed to save screenshot:', error);
    showError('Failed to save screenshot: ' + error.message);
    
    const saveBtn = document.getElementById('save-btn');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Screenshot';
  }
}

// Handle export PDF
async function handleExportPDF() {
  try {
    const exportBtn = document.getElementById('export-btn');
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    
    if (!currentScreenshot) {
      throw new Error('No screenshot data to export');
    }
    
    // First save if not already saved
    if (!currentScreenshot.savedAt) {
      await handleSaveScreenshot();
    }
    
    const response = await chrome.runtime.sendMessage({
      action: 'exportPDF',
      screenshotId: currentScreenshot.id,
      options: {
        includeTimestamp: true,
        includeMetadata: true,
        format: 'A4'
      }
    });
    
    if (response && response.success) {
      exportBtn.textContent = 'Exported!';
      exportBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
      
      setTimeout(() => {
        exportBtn.disabled = false;
        exportBtn.textContent = 'Export PDF';
        exportBtn.style.background = '';
      }, 2000);
      
      showSuccess('PDF exported successfully!');
    } else {
      throw new Error(response?.error || 'Failed to export PDF');
    }
    
  } catch (error) {
    console.error('Failed to export PDF:', error);
    showError('Failed to export PDF: ' + error.message);
    
    const exportBtn = document.getElementById('export-btn');
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export PDF';
  }
}

// Handle close interface
function handleCloseInterface() {
  if (confirm('Close annotation interface? Unsaved changes will be lost.')) {
    window.close();
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 's':
        event.preventDefault();
        handleSaveScreenshot();
        break;
      case 'e':
        event.preventDefault();
        handleExportPDF();
        break;
    }
  }
  
  if (event.key === 'Escape') {
    handleCloseInterface();
  }
}

// Hide loading screen
function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  loadingScreen.classList.add('hidden');
}

// Show error message
function showError(message) {
  console.error('Error:', message);
  alert('Error: ' + message); // Simple alert for now
}

// Show success message
function showSuccess(message) {
  console.log('Success:', message);
  // Could implement a toast notification here
}

// Generate unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

console.log('Snap Journal annotation interface script loaded successfully');