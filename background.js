/**
 * Snap Journal - Background Service Worker
 * Medical-grade screenshot annotation extension
 * Version: 2.0.1
 */

// Extension installation and update handling
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Snap Journal installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // Initialize extension storage
    initializeStorage();
    
    // Show welcome notification
    chrome.notifications?.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Snap Journal Installed',
      message: 'Professional screenshot annotation ready! Click the extension icon to start.'
    });
  }
});

// Initialize storage structure
async function initializeStorage() {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    
    if (!storage.snapJournalConfig) {
      await chrome.storage.local.set({
        snapJournalConfig: {
          version: '2.0.1',
          installDate: new Date().toISOString(),
          totalScreenshots: 0,
          settings: {
            markerSize: 16,
            markerColor: '#FF0000',
            textSize: 14,
            autoSave: true,
            exportFormat: 'pdf',
            hipaaMode: false
          }
        }
      });
    }
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Check if we can access the tab
    if (tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')) {
      
      // Handle special pages with different approach
      await handleSpecialPageScreenshot(tab);
    } else {
      // Handle regular pages
      await handleRegularPageScreenshot(tab);
    }
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    showErrorNotification('Screenshot capture failed. Please try again.');
  }
});

// Handle regular webpage screenshots
async function handleRegularPageScreenshot(tab) {
  try {
    // Inject content script if not already present
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    
    // Inject CSS
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content.css']
    });
    
    // Trigger screenshot capture
    await chrome.tabs.sendMessage(tab.id, {
      action: 'captureScreenshot',
      tabInfo: {
        url: tab.url,
        title: tab.title,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Regular page screenshot failed:', error);
    throw error;
  }
}

// Handle special pages (Chrome internal, etc.)
async function handleSpecialPageScreenshot(tab) {
  try {
    // Use chrome.tabs.captureVisibleTab for special pages
    const screenshotDataUrl = await chrome.tabs.captureVisibleTab(
      tab.windowId,
      { format: 'png', quality: 100 }
    );
    
    // Store screenshot data
    const screenshotData = {
      id: generateUniqueId(),
      timestamp: new Date().toISOString(),
      url: tab.url,
      title: tab.title,
      image: screenshotDataUrl,
      annotations: [],
      metadata: {
        captureMethod: 'chrome.tabs.captureVisibleTab',
        browserInfo: await getBrowserInfo(),
        extensionVersion: '2.0.1'
      }
    };
    
    // Open annotation interface in new tab
    const annotationTab = await chrome.tabs.create({
      url: chrome.runtime.getURL('annotation-interface.html'),
      active: true
    });
    
    // Wait for tab to load then send screenshot data
    setTimeout(async () => {
      try {
        await chrome.tabs.sendMessage(annotationTab.id, {
          action: 'loadScreenshot',
          screenshotData: screenshotData
        });
      } catch (error) {
        console.error('Failed to send screenshot data:', error);
      }
    }, 1000);
    
  } catch (error) {
    console.error('Special page screenshot failed:', error);
    throw error;
  }
}

// Message handling from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'saveScreenshot':
      handleSaveScreenshot(message.data)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true; // Keep message channel open for async response
      
    case 'getScreenshots':
      handleGetScreenshots(message.filters)
        .then(screenshots => sendResponse({ success: true, data: screenshots }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'deleteScreenshot':
      handleDeleteScreenshot(message.id)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'exportPDF':
      handleExportPDF(message.screenshotId, message.options)
        .then(result => sendResponse({ success: true, data: result }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'getSettings':
      handleGetSettings()
        .then(settings => sendResponse({ success: true, data: settings }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'updateSettings':
      handleUpdateSettings(message.settings)
        .then(() => sendResponse({ success: true }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
  }
});

// Save screenshot to IndexedDB
async function handleSaveScreenshot(screenshotData) {
  try {
    // Open IndexedDB
    const db = await openDatabase();
    
    // Add unique ID if not present
    if (!screenshotData.id) {
      screenshotData.id = generateUniqueId();
    }
    
    // Add save timestamp
    screenshotData.savedAt = new Date().toISOString();
    
    // Store in IndexedDB
    const transaction = db.transaction(['screenshots'], 'readwrite');
    const store = transaction.objectStore('screenshots');
    await store.put(screenshotData);
    
    // Update statistics
    await updateStatistics('screenshot_saved');
    
    return { id: screenshotData.id, timestamp: screenshotData.savedAt };
    
  } catch (error) {
    console.error('Failed to save screenshot:', error);
    throw error;
  }
}

// Get screenshots from IndexedDB
async function handleGetScreenshots(filters = {}) {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['screenshots'], 'readonly');
    const store = transaction.objectStore('screenshots');
    
    let screenshots = [];
    
    // Get all screenshots
    const request = store.getAll();
    screenshots = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    // Apply filters
    if (filters.dateFrom) {
      screenshots = screenshots.filter(s => s.timestamp >= filters.dateFrom);
    }
    if (filters.dateTo) {
      screenshots = screenshots.filter(s => s.timestamp <= filters.dateTo);
    }
    if (filters.domain) {
      screenshots = screenshots.filter(s => s.url.includes(filters.domain));
    }
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      screenshots = screenshots.filter(s => 
        s.title?.toLowerCase().includes(searchLower) ||
        s.url.toLowerCase().includes(searchLower) ||
        s.annotations.some(a => a.text.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by timestamp (newest first)
    screenshots.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    return screenshots;
    
  } catch (error) {
    console.error('Failed to get screenshots:', error);
    throw error;
  }
}

// Delete screenshot from IndexedDB
async function handleDeleteScreenshot(id) {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['screenshots'], 'readwrite');
    const store = transaction.objectStore('screenshots');
    
    await new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    await updateStatistics('screenshot_deleted');
    
  } catch (error) {
    console.error('Failed to delete screenshot:', error);
    throw error;
  }
}

// Export screenshot as PDF
async function handleExportPDF(screenshotId, options = {}) {
  try {
    // Get screenshot data
    const db = await openDatabase();
    const transaction = db.transaction(['screenshots'], 'readonly');
    const store = transaction.objectStore('screenshots');
    
    const screenshot = await new Promise((resolve, reject) => {
      const request = store.get(screenshotId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    if (!screenshot) {
      throw new Error('Screenshot not found');
    }
    
    // Generate PDF (this would typically use a library like jsPDF)
    const pdfData = await generatePDF(screenshot, options);
    
    // Trigger download
    const blob = new Blob([pdfData], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const filename = `snap-journal-${screenshot.timestamp.split('T')[0]}-${screenshotId.substring(0, 8)}.pdf`;
    
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
    
    // Update statistics
    await updateStatistics('pdf_exported');
    
    return { filename, size: blob.size };
    
  } catch (error) {
    console.error('Failed to export PDF:', error);
    throw error;
  }
}

// Get user settings
async function handleGetSettings() {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    return storage.snapJournalConfig?.settings || {};
  } catch (error) {
    console.error('Failed to get settings:', error);
    throw error;
  }
}

// Update user settings
async function handleUpdateSettings(newSettings) {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    const config = storage.snapJournalConfig || {};
    
    config.settings = { ...config.settings, ...newSettings };
    
    await chrome.storage.local.set({ snapJournalConfig: config });
    
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}

// Utility functions
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timestamp: new Date().toISOString()
  };
}

function showErrorNotification(message) {
  chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Snap Journal Error',
    message: message
  });
}

// IndexedDB management
async function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SnapJournalDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create screenshots store
      if (!db.objectStoreNames.contains('screenshots')) {
        const screenshotStore = db.createObjectStore('screenshots', { keyPath: 'id' });
        screenshotStore.createIndex('timestamp', 'timestamp', { unique: false });
        screenshotStore.createIndex('url', 'url', { unique: false });
      }
      
      // Create settings store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
      
      // Create statistics store
      if (!db.objectStoreNames.contains('statistics')) {
        db.createObjectStore('statistics', { keyPath: 'key' });
      }
    };
  });
}

// Update usage statistics
async function updateStatistics(action) {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    const config = storage.snapJournalConfig || {};
    
    if (!config.statistics) {
      config.statistics = {};
    }
    
    config.statistics[action] = (config.statistics[action] || 0) + 1;
    config.statistics.lastActivity = new Date().toISOString();
    
    await chrome.storage.local.set({ snapJournalConfig: config });
    
  } catch (error) {
    console.error('Failed to update statistics:', error);
  }
}

// Placeholder for PDF generation (would use jsPDF library)
async function generatePDF(screenshot, options) {
  // This is a placeholder - in a real implementation, you would use jsPDF
  // to generate a professional PDF with the screenshot and annotations
  
  const pdfContent = `
    PDF Generation Placeholder
    Screenshot ID: ${screenshot.id}
    Timestamp: ${screenshot.timestamp}
    URL: ${screenshot.url}
    Annotations: ${screenshot.annotations.length}
  `;
  
  return new TextEncoder().encode(pdfContent);
}

console.log('Snap Journal background service worker loaded successfully');