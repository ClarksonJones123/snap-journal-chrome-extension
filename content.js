/**
 * Snap Journal - Content Script
 * Handles screenshot capture and annotation interface injection
 * Version: 2.0.1
 */

// Prevent multiple injections
if (window.snapJournalInjected) {
  console.log('Snap Journal already injected');
} else {
  window.snapJournalInjected = true;

  // Global variables
  let annotationInterface = null;
  let isCapturing = false;
  let currentScreenshot = null;

// Message listener for background script communication
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'captureScreenshot':
      handleScreenshotCapture(message.tabInfo)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open for async response
      
    case 'closeAnnotationInterface':
      closeAnnotationInterface();
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
});

// Handle screenshot capture for regular pages
async function handleScreenshotCapture(tabInfo) {
  try {
    // Prevent multiple simultaneous captures
    if (isAnnotationInterfaceActive) {
      throw new Error('Annotation interface already active');
    }
    
    // Scroll to top for consistent capture
    window.scrollTo(0, 0);
    
    // Wait for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Capture screenshot using html2canvas or similar approach
    const canvas = await capturePageAsCanvas();
    const imageDataUrl = canvas.toDataURL('image/png', 1.0);
    
    // Create screenshot data object
    screenshotData = {
      id: generateUniqueId(),
      timestamp: tabInfo.timestamp,
      url: tabInfo.url,
      title: tabInfo.title,
      image: imageDataUrl,
      annotations: [],
      metadata: {
        captureMethod: 'content-script',
        pageWidth: window.innerWidth,
        pageHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        userAgent: navigator.userAgent
      }
    };
    
    // Show annotation interface
    await showAnnotationInterface();
    
    return { success: true, screenshotId: screenshotData.id };
    
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
}

// Capture page as canvas (simplified version - would use html2canvas in production)
async function capturePageAsCanvas() {
  return new Promise((resolve, reject) => {
    try {
      // Create canvas with page dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to viewport
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // For this demo, we'll create a placeholder canvas
      // In production, you would use html2canvas library
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some demo content
      ctx.fillStyle = '#333';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Screenshot Captured Successfully', canvas.width / 2, canvas.height / 2);
      
      ctx.font = '16px Arial';
      ctx.fillText(`URL: ${window.location.href}`, canvas.width / 2, canvas.height / 2 + 40);
      ctx.fillText(`Timestamp: ${new Date().toLocaleString()}`, canvas.width / 2, canvas.height / 2 + 70);
      
      // Add border
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      
      resolve(canvas);
      
    } catch (error) {
      reject(error);
    }
  });
}

// Show annotation interface overlay
async function showAnnotationInterface() {
  try {
    // Create overlay container
    annotationInterface = document.createElement('div');
    annotationInterface.id = 'snap-journal-annotation-interface';
    annotationInterface.className = 'snap-journal-overlay';
    
    // Create interface HTML
    annotationInterface.innerHTML = `
      <div class="snap-journal-container">
        <div class="snap-journal-header">
          <h2>Snap Journal - Professional Annotation</h2>
          <div class="snap-journal-controls">
            <button id="snap-journal-save" class="btn btn-primary">Save Screenshot</button>
            <button id="snap-journal-export" class="btn btn-secondary">Export PDF</button>
            <button id="snap-journal-close" class="btn btn-close">×</button>
          </div>
        </div>
        
        <div class="snap-journal-content">
          <div class="snap-journal-canvas-container">
            <canvas id="snap-journal-canvas"></canvas>
            <div id="snap-journal-annotations"></div>
          </div>
          
          <div class="snap-journal-sidebar">
            <div class="snap-journal-info">
              <h3>Screenshot Information</h3>
              <p><strong>URL:</strong> <span id="snap-journal-url">${screenshotData.url}</span></p>
              <p><strong>Title:</strong> <span id="snap-journal-title">${screenshotData.title}</span></p>
              <p><strong>Timestamp:</strong> <span id="snap-journal-timestamp">${new Date(screenshotData.timestamp).toLocaleString()}</span></p>
            </div>
            
            <div class="snap-journal-tools">
              <h3>Annotation Tools</h3>
              <p>Click anywhere on the screenshot to add a marker and annotation.</p>
              <div class="snap-journal-stats">
                <p>Markers: <span id="snap-journal-marker-count">0</span></p>
              </div>
            </div>
            
            <div class="snap-journal-annotations-list">
              <h3>Annotations</h3>
              <div id="snap-journal-annotations-container">
                <p class="no-annotations">No annotations yet. Click on the screenshot to add markers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(annotationInterface);
    
    // Load screenshot into canvas
    await loadScreenshotIntoCanvas();
    
    // Set up event listeners
    setupAnnotationEventListeners();
    
    // Mark interface as active
    isAnnotationInterfaceActive = true;
    
    // Prevent page scrolling
    document.body.style.overflow = 'hidden';
    
  } catch (error) {
    console.error('Failed to show annotation interface:', error);
    throw error;
  }
}

// Load screenshot into canvas
async function loadScreenshotIntoCanvas() {
  return new Promise((resolve, reject) => {
    const canvas = document.getElementById('snap-journal-canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image
      ctx.drawImage(img, 0, 0);
      
      resolve();
    };
    
    img.onerror = () => reject(new Error('Failed to load screenshot image'));
    img.src = screenshotData.image;
  });
}

// Set up event listeners for annotation interface
function setupAnnotationEventListeners() {
  const canvas = document.getElementById('snap-journal-canvas');
  const saveBtn = document.getElementById('snap-journal-save');
  const exportBtn = document.getElementById('snap-journal-export');
  const closeBtn = document.getElementById('snap-journal-close');
  
  // Canvas click for adding markers
  canvas.addEventListener('click', handleCanvasClick);
  
  // Control buttons
  saveBtn.addEventListener('click', handleSaveScreenshot);
  exportBtn.addEventListener('click', handleExportPDF);
  closeBtn.addEventListener('click', closeAnnotationInterface);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Handle canvas click to add markers
function handleCanvasClick(event) {
  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  // Scale coordinates to canvas size
  const canvas = event.target;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const canvasX = x * scaleX;
  const canvasY = y * scaleY;
  
  // Add marker
  addAnnotationMarker(canvasX, canvasY);
}

// Add annotation marker
function addAnnotationMarker(x, y) {
  const markerId = generateUniqueId();
  const markerNumber = screenshotData.annotations.length + 1;
  
  // Create marker element - FIXED: Consistent class names
  const marker = document.createElement('div');
  marker.className = 'snap-journal-marker'; // FIXED: Use consistent class name
  marker.id = `marker-${markerId}`;
  marker.style.left = `${x - 8}px`; // Center the 16px marker
  marker.style.top = `${y - 8}px`;
  marker.textContent = markerNumber;
  
  // Create text input
  const textInput = document.createElement('div');
  textInput.className = 'snap-journal-text-input';
  textInput.contentEditable = true;
  textInput.style.left = `${x + 20}px`;
  textInput.style.top = `${y - 10}px`;
  textInput.placeholder = 'Enter annotation text...';
  textInput.textContent = `Annotation ${markerNumber}`;
  
  // Add to annotations container
  const annotationsContainer = document.getElementById('snap-journal-annotations');
  annotationsContainer.appendChild(marker);
  annotationsContainer.appendChild(textInput);
  
  // Create SVG arrow
  const arrow = createSVGArrow(x, y, x + 20, y);
  annotationsContainer.appendChild(arrow);
  
  // Add to screenshot data
  const annotation = {
    id: markerId,
    number: markerNumber,
    x: x,
    y: y,
    text: `Annotation ${markerNumber}`,
    textX: x + 20,
    textY: y - 10,
    timestamp: new Date().toISOString()
  };
  
  screenshotData.annotations.push(annotation);
  
  // Update UI
  updateAnnotationsList();
  updateMarkerCount();
  
  // Focus text input
  textInput.focus();
  
  // Set up text input events
  textInput.addEventListener('blur', () => {
    annotation.text = textInput.textContent || `Annotation ${markerNumber}`;
    updateAnnotationsList();
  });
  
  // Make text draggable
  makeElementDraggable(textInput, (newX, newY) => {
    annotation.textX = newX;
    annotation.textY = newY;
    updateArrow(arrow, x, y, newX, newY);
  });
}

// Create SVG arrow between marker and text
function createSVGArrow(x1, y1, x2, y2) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'snap-journal-arrow';
  svg.style.position = 'absolute';
  svg.style.left = '0';
  svg.style.top = '0';
  svg.style.width = '100%';
  svg.style.height = '100%';
  svg.style.pointerEvents = 'none';
  svg.style.zIndex = '1000';
  
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', '#000');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('marker-end', 'url(#arrowhead)');
  
  // Create arrowhead marker
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  marker.setAttribute('id', 'arrowhead');
  marker.setAttribute('markerWidth', '10');
  marker.setAttribute('markerHeight', '7');
  marker.setAttribute('refX', '9');
  marker.setAttribute('refY', '3.5');
  marker.setAttribute('orient', 'auto');
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  polygon.setAttribute('fill', '#000');
  
  marker.appendChild(polygon);
  defs.appendChild(marker);
  svg.appendChild(defs);
  svg.appendChild(line);
  
  return svg;
}

// Update SVG arrow position
function updateArrow(arrow, x1, y1, x2, y2) {
  const line = arrow.querySelector('line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
}

// Make element draggable
function makeElementDraggable(element, onMove) {
  let isDragging = false;
  let startX, startY, initialX, initialY;
  
  element.addEventListener('mousedown', (e) => {
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
    
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
    
    if (onMove) onMove(newX, newY);
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      element.style.cursor = 'grab';
    }
  });
  
  element.style.cursor = 'grab';
}

// Update annotations list in sidebar
function updateAnnotationsList() {
  const container = document.getElementById('snap-journal-annotations-container');
  
  if (screenshotData.annotations.length === 0) {
    container.innerHTML = '<p class="no-annotations">No annotations yet. Click on the screenshot to add markers.</p>';
    return;
  }
  
  const html = screenshotData.annotations.map(annotation => `
    <div class="annotation-item">
      <div class="annotation-number">${annotation.number}</div>
      <div class="annotation-text">${annotation.text}</div>
      <div class="annotation-coords">(${Math.round(annotation.x)}, ${Math.round(annotation.y)})</div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// Update marker count
function updateMarkerCount() {
  const countElement = document.getElementById('snap-journal-marker-count');
  countElement.textContent = screenshotData.annotations.length;
}

// Handle save screenshot
async function handleSaveScreenshot() {
  try {
    const saveBtn = document.getElementById('snap-journal-save');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    
    // Send to background script for storage
    const response = await chrome.runtime.sendMessage({
      action: 'saveScreenshot',
      data: screenshotData
    });
    
    if (response.success) {
      showNotification('Screenshot saved successfully!', 'success');
      saveBtn.textContent = 'Saved ✓';
      setTimeout(() => {
        saveBtn.textContent = 'Save Screenshot';
        saveBtn.disabled = false;
      }, 2000);
    } else {
      throw new Error(response.error);
    }
    
  } catch (error) {
    console.error('Failed to save screenshot:', error);
    showNotification('Failed to save screenshot: ' + error.message, 'error');
    
    const saveBtn = document.getElementById('snap-journal-save');
    saveBtn.textContent = 'Save Screenshot';
    saveBtn.disabled = false;
  }
}

// Handle export PDF
async function handleExportPDF() {
  try {
    const exportBtn = document.getElementById('snap-journal-export');
    exportBtn.disabled = true;
    exportBtn.textContent = 'Exporting...';
    
    // First save if not already saved
    if (!screenshotData.savedAt) {
      await handleSaveScreenshot();
    }
    
    // Export PDF
    const response = await chrome.runtime.sendMessage({
      action: 'exportPDF',
      screenshotId: screenshotData.id,
      options: {
        includeTimestamp: true,
        includeMetadata: true,
        quality: 'high'
      }
    });
    
    if (response.success) {
      showNotification('PDF exported successfully!', 'success');
      exportBtn.textContent = 'Exported ✓';
      setTimeout(() => {
        exportBtn.textContent = 'Export PDF';
        exportBtn.disabled = false;
      }, 2000);
    } else {
      throw new Error(response.error);
    }
    
  } catch (error) {
    console.error('Failed to export PDF:', error);
    showNotification('Failed to export PDF: ' + error.message, 'error');
    
    const exportBtn = document.getElementById('snap-journal-export');
    exportBtn.textContent = 'Export PDF';
    exportBtn.disabled = false;
  }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(event) {
  if (!isAnnotationInterfaceActive) return;
  
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
    closeAnnotationInterface();
  }
}

// Close annotation interface
function closeAnnotationInterface() {
  if (annotationInterface) {
    document.body.removeChild(annotationInterface);
    annotationInterface = null;
  }
  
  // Restore page scrolling
  document.body.style.overflow = '';
  
  // Remove keyboard listener
  document.removeEventListener('keydown', handleKeyboardShortcuts);
  
  // Reset state
  isAnnotationInterfaceActive = false;
  screenshotData = null;
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `snap-journal-notification snap-journal-notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

// Utility function
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

console.log('Snap Journal content script loaded successfully');