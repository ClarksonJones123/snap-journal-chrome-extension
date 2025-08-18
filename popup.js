/**
 * Snap Journal - Popup Script
 * Handles popup interface and user interactions
 * Version: 2.0.1-DEBUG
 */

// Debug: Verify script is loading
console.log('🚀 POPUP.JS LOADING - DEBUG VERSION');
console.log('🕐 Timestamp:', new Date().toISOString());

// DOM elements
let elements = {};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

// Initialize popup functionality
async function initializePopup() {
  try {
    // Get DOM elements
    elements = {
      testBtn: document.getElementById('test-btn'),
      captureBtn: document.getElementById('capture-btn'),
      galleryBtn: document.getElementById('gallery-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      helpBtn: document.getElementById('help-btn'),
      exportAllBtn: document.getElementById('export-all-btn'),
      
      // Stats
      totalScreenshots: document.getElementById('total-screenshots'),
      totalAnnotations: document.getElementById('total-annotations'),
      totalExports: document.getElementById('total-exports'),
      
      // Page info
      currentUrl: document.getElementById('current-url'),
      currentTitle: document.getElementById('current-title'),
      compatibilityStatus: document.getElementById('compatibility-status'),
      
      // Modals
      galleryModal: document.getElementById('gallery-modal'),
      settingsModal: document.getElementById('settings-modal'),
      loadingOverlay: document.getElementById('loading-overlay'),
      
      // Gallery
      closeGallery: document.getElementById('close-gallery'),
      searchInput: document.getElementById('search-input'),
      sortSelect: document.getElementById('sort-select'),
      galleryGrid: document.getElementById('gallery-grid'),
      
      // Settings
      closeSettings: document.getElementById('close-settings'),
      markerSize: document.getElementById('marker-size'),
      markerSizeValue: document.getElementById('marker-size-value'),
      markerColor: document.getElementById('marker-color'),
      textSize: document.getElementById('text-size'),
      textSizeValue: document.getElementById('text-size-value'),
      exportFormat: document.getElementById('export-format'),
      includeTimestamp: document.getElementById('include-timestamp'),
      includeMetadata: document.getElementById('include-metadata'),
      hipaaMode: document.getElementById('hipaa-mode'),
      autoCleanup: document.getElementById('auto-cleanup'),
      saveSettings: document.getElementById('save-settings'),
      resetSettings: document.getElementById('reset-settings'),
      
      // Footer links
      privacyLink: document.getElementById('privacy-link'),
      docsLink: document.getElementById('docs-link'),
      supportLink: document.getElementById('support-link')
    };
    
    // Set up event listeners
    setupEventListeners();
    
    // Load current page info
    await loadCurrentPageInfo();
    
    // Load statistics
    await loadStatistics();
    
    // Load settings
    await loadSettings();
    
    console.log('Snap Journal popup initialized successfully');
    
  } catch (error) {
    console.error('Failed to initialize popup:', error);
    showError('Failed to initialize popup: ' + error.message);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Main action buttons
  elements.testBtn.addEventListener('click', handleTestConnection);
  elements.captureBtn.addEventListener('click', handleCaptureScreenshot);
  elements.galleryBtn.addEventListener('click', handleShowGallery);
  elements.settingsBtn.addEventListener('click', handleShowSettings);
  elements.helpBtn.addEventListener('click', handleShowHelp);
  elements.exportAllBtn.addEventListener('click', handleExportAll);
  
  // Modal close buttons
  elements.closeGallery.addEventListener('click', () => hideModal(elements.galleryModal));
  elements.closeSettings.addEventListener('click', () => hideModal(elements.settingsModal));
  
  // Gallery controls
  elements.searchInput.addEventListener('input', handleGallerySearch);
  elements.sortSelect.addEventListener('change', handleGallerySort);
  
  // Settings controls
  elements.markerSize.addEventListener('input', updateMarkerSizeValue);
  elements.textSize.addEventListener('input', updateTextSizeValue);
  elements.saveSettings.addEventListener('click', handleSaveSettings);
  elements.resetSettings.addEventListener('click', handleResetSettings);
  
  // Footer links
  elements.privacyLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('docs/PRIVACY_POLICY.md') });
  });
  
  elements.docsLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('docs/README.md') });
  });
  
  elements.supportLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL('TROUBLESHOOTING.md') });
  });
  
  // Modal backdrop clicks
  elements.galleryModal.addEventListener('click', (e) => {
    if (e.target === elements.galleryModal) {
      hideModal(elements.galleryModal);
    }
  });
  
  elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) {
      hideModal(elements.settingsModal);
    }
  });
}

// Load current page information
async function loadCurrentPageInfo() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab) {
      // Update page info
      elements.currentUrl.textContent = tab.url || 'Unknown URL';
      elements.currentTitle.textContent = tab.title || 'Untitled Page';
      
      // Check compatibility
      const compatibility = checkPageCompatibility(tab.url);
      updateCompatibilityStatus(compatibility);
    }
    
  } catch (error) {
    console.error('Failed to load current page info:', error);
    elements.currentUrl.textContent = 'Error loading page info';
    elements.currentTitle.textContent = 'Error';
    updateCompatibilityStatus({ status: 'error', message: 'Failed to check compatibility' });
  }
}

// Check page compatibility
function checkPageCompatibility(url) {
  if (!url) {
    return { status: 'error', message: 'Invalid URL' };
  }
  
  // Chrome internal pages
  if (url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://')) {
    return { status: 'compatible', message: 'Chrome internal page - fully supported' };
  }
  
  // Local files
  if (url.startsWith('file://')) {
    return { status: 'compatible', message: 'Local file - fully supported' };
  }
  
  // HTTPS sites
  if (url.startsWith('https://')) {
    return { status: 'compatible', message: 'Secure site - fully supported' };
  }
  
  // HTTP sites
  if (url.startsWith('http://')) {
    return { status: 'warning', message: 'HTTP site - supported with limitations' };
  }
  
  // Other protocols
  return { status: 'warning', message: 'Special protocol - may have limitations' };
}

// Update compatibility status display
function updateCompatibilityStatus(compatibility) {
  const statusIndicator = elements.compatibilityStatus.querySelector('.status-indicator');
  const statusText = elements.compatibilityStatus.querySelector('.status-text');
  
  // Remove existing status classes
  statusIndicator.classList.remove('compatible', 'warning', 'error');
  
  // Add new status class
  statusIndicator.classList.add(compatibility.status);
  
  // Update text
  statusText.textContent = compatibility.message;
}

// Load statistics
async function loadStatistics() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatistics' });
    
    if (response && response.success) {
      const stats = response.data;
      elements.totalScreenshots.textContent = stats.totalScreenshots || 0;
      elements.totalAnnotations.textContent = stats.totalAnnotations || 0;
      elements.totalExports.textContent = stats.totalExports || 0;
    } else {
      // Default values if no stats available
      elements.totalScreenshots.textContent = '0';
      elements.totalAnnotations.textContent = '0';
      elements.totalExports.textContent = '0';
    }
    
  } catch (error) {
    console.error('Failed to load statistics:', error);
    // Show default values on error
    elements.totalScreenshots.textContent = '0';
    elements.totalAnnotations.textContent = '0';
    elements.totalExports.textContent = '0';
  }
}

// Handle test connection
async function handleTestConnection() {
  try {
    console.log('🧪 Testing connection to background script...');
    showLoading('Testing connection...');
    
    const response = await chrome.runtime.sendMessage({
      action: 'ping'
    });
    
    console.log('🧪 Test response:', response);
    
    if (response && response.success) {
      hideLoading();
      showError('✅ Connection successful! Background script is responding.', 'success');
    } else {
      hideLoading();
      showError('❌ Connection failed: No response from background script');
    }
    
  } catch (error) {
    console.error('🧪 Test connection failed:', error);
    hideLoading();
    showError('❌ Connection test failed: ' + error.message);
  }
}

// Handle capture screenshot
async function handleCaptureScreenshot() {
  try {
    console.log('🚀 Starting screenshot capture...');
    showLoading('Capturing screenshot...');
    
    // Get current tab
    console.log('📋 Getting current tab...');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      console.error('❌ No active tab found');
      throw new Error('No active tab found');
    }
    
    console.log('✅ Found active tab:', { id: tab.id, url: tab.url, title: tab.title });
    
    // Trigger screenshot capture
    console.log('📤 Sending message to background script...');
    const response = await chrome.runtime.sendMessage({
      action: 'captureScreenshot',
      tabId: tab.id
    });
    
    console.log('📥 Received response from background:', response);
    
    if (response && response.success) {
      console.log('✅ Screenshot capture successful!');
      hideLoading();
      window.close(); // Close popup after successful capture
    } else {
      console.error('❌ Screenshot capture failed - invalid response:', response);
      throw new Error(response?.error || 'Screenshot capture failed - no success response');
    }
    
  } catch (error) {
    console.error('💥 Screenshot capture failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    hideLoading();
    showError('Screenshot capture failed: ' + error.message);
  }
}

// Handle show gallery
async function handleShowGallery() {
  try {
    showLoading('Loading gallery...');
    
    // Load screenshots
    const response = await chrome.runtime.sendMessage({ action: 'getScreenshots' });
    
    if (response && response.success) {
      const screenshots = response.data;
      displayGallery(screenshots);
      showModal(elements.galleryModal);
    } else {
      throw new Error(response?.error || 'Failed to load gallery');
    }
    
    hideLoading();
    
  } catch (error) {
    console.error('Failed to show gallery:', error);
    hideLoading();
    showError('Failed to load gallery: ' + error.message);
  }
}

// Display gallery
function displayGallery(screenshots) {
  const grid = elements.galleryGrid;
  grid.innerHTML = '';
  
  if (screenshots.length === 0) {
    grid.innerHTML = `
      <div class="gallery-empty">
        <p>No screenshots yet</p>
        <p>Click "Capture Screenshot" to get started</p>
      </div>
    `;
    return;
  }
  
  screenshots.forEach(screenshot => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${screenshot.image}" alt="Screenshot" class="gallery-thumbnail">
      <div class="gallery-info">
        <div class="gallery-title">${screenshot.title || 'Untitled'}</div>
        <div class="gallery-date">${new Date(screenshot.timestamp).toLocaleDateString()}</div>
        <div class="gallery-annotations">${screenshot.annotations.length} annotations</div>
      </div>
    `;
    
    item.addEventListener('click', () => handleGalleryItemClick(screenshot));
    grid.appendChild(item);
  });
}

// Handle gallery item click
function handleGalleryItemClick(screenshot) {
  // Open screenshot in annotation interface
  chrome.tabs.create({
    url: chrome.runtime.getURL(`annotation-interface.html?id=${screenshot.id}`)
  });
}

// Handle gallery search
function handleGallerySearch() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const items = elements.galleryGrid.querySelectorAll('.gallery-item');
  
  items.forEach(item => {
    const title = item.querySelector('.gallery-title').textContent.toLowerCase();
    const isVisible = title.includes(searchTerm);
    item.style.display = isVisible ? 'block' : 'none';
  });
}

// Handle gallery sort
function handleGallerySort() {
  // This would implement sorting logic
  console.log('Gallery sort:', elements.sortSelect.value);
}

// Handle show settings
function handleShowSettings() {
  showModal(elements.settingsModal);
}

// Handle show help
function handleShowHelp() {
  chrome.tabs.create({ url: chrome.runtime.getURL('USER_MANUAL.md') });
}

// Handle export all
async function handleExportAll() {
  try {
    showLoading('Exporting all screenshots...');
    
    const response = await chrome.runtime.sendMessage({ action: 'exportAllScreenshots' });
    
    if (response && response.success) {
      showSuccess('All screenshots exported successfully!');
    } else {
      throw new Error(response?.error || 'Export failed');
    }
    
    hideLoading();
    
  } catch (error) {
    console.error('Export all failed:', error);
    hideLoading();
    showError('Export failed: ' + error.message);
  }
}

// Load settings
async function loadSettings() {
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getSettings' });
    
    if (response && response.success) {
      const settings = response.data;
      
      // Apply settings to form
      elements.markerSize.value = settings.markerSize || 16;
      elements.markerSizeValue.textContent = settings.markerSize || 16;
      elements.markerColor.value = settings.markerColor || '#FF0000';
      elements.textSize.value = settings.textSize || 14;
      elements.textSizeValue.textContent = settings.textSize || 14;
      elements.exportFormat.value = settings.exportFormat || 'pdf';
      elements.includeTimestamp.checked = settings.includeTimestamp !== false;
      elements.includeMetadata.checked = settings.includeMetadata !== false;
      elements.hipaaMode.checked = settings.hipaaMode || false;
      elements.autoCleanup.checked = settings.autoCleanup || false;
    }
    
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
}

// Handle save settings
async function handleSaveSettings() {
  try {
    const settings = {
      markerSize: parseInt(elements.markerSize.value),
      markerColor: elements.markerColor.value,
      textSize: parseInt(elements.textSize.value),
      exportFormat: elements.exportFormat.value,
      includeTimestamp: elements.includeTimestamp.checked,
      includeMetadata: elements.includeMetadata.checked,
      hipaaMode: elements.hipaaMode.checked,
      autoCleanup: elements.autoCleanup.checked
    };
    
    const response = await chrome.runtime.sendMessage({
      action: 'updateSettings',
      settings: settings
    });
    
    if (response && response.success) {
      showSuccess('Settings saved successfully!');
      setTimeout(() => hideModal(elements.settingsModal), 1500);
    } else {
      throw new Error(response?.error || 'Failed to save settings');
    }
    
  } catch (error) {
    console.error('Failed to save settings:', error);
    showError('Failed to save settings: ' + error.message);
  }
}

// Handle reset settings
async function handleResetSettings() {
  if (confirm('Reset all settings to defaults?')) {
    try {
      const defaultSettings = {
        markerSize: 16,
        markerColor: '#FF0000',
        textSize: 14,
        exportFormat: 'pdf',
        includeTimestamp: true,
        includeMetadata: true,
        hipaaMode: false,
        autoCleanup: false
      };
      
      const response = await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: defaultSettings
      });
      
      if (response && response.success) {
        await loadSettings(); // Reload settings form
        showSuccess('Settings reset to defaults!');
      } else {
        throw new Error(response?.error || 'Failed to reset settings');
      }
      
    } catch (error) {
      console.error('Failed to reset settings:', error);
      showError('Failed to reset settings: ' + error.message);
    }
  }
}

// Update marker size value display
function updateMarkerSizeValue() {
  elements.markerSizeValue.textContent = elements.markerSize.value;
}

// Update text size value display
function updateTextSizeValue() {
  elements.textSizeValue.textContent = elements.textSize.value;
}

// Show modal
function showModal(modal) {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Hide modal
function hideModal(modal) {
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Show loading overlay
function showLoading(message = 'Loading...') {
  elements.loadingOverlay.querySelector('.loading-text').textContent = message;
  elements.loadingOverlay.classList.remove('hidden');
}

// Hide loading overlay
function hideLoading() {
  elements.loadingOverlay.classList.add('hidden');
}

// Show error message
function showError(message) {
  // Create error notification
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #e74c3c;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2000;
    font-size: 14px;
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
}

// Show success message
function showSuccess(message) {
  // Create success notification
  const notification = document.createElement('div');
  notification.className = 'success-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #27ae60;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 2000;
    font-size: 14px;
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 3000);
}

console.log('Snap Journal popup script loaded successfully');