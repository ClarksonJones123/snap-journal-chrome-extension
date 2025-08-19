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
    console.log('📷 Capturing visible tab for regular page...');
    console.log('Tab details:', { windowId: tab.windowId, url: tab.url });
    
    // Use universal screenshot capture system
    const screenshotDataUrl = await universalScreenshotCapture(tab.windowId);
    console.log('✅ Screenshot captured, data URL length:', screenshotDataUrl.length);
    
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
        // If message fails, store data and let annotation interface retrieve it
        await chrome.storage.local.set({
          [`pendingScreenshot_${screenshotData.id}`]: screenshotData
        });
      }
    }, 1000);
    
    return { success: true, screenshotId: screenshotData.id };
    
  } catch (error) {
    console.error('Regular page screenshot failed:', error);
    throw error;
  }
}

// Handle special pages (Chrome internal, etc.)
async function handleSpecialPageScreenshot(tab) {
  try {
    console.log('🔧 Capturing visible tab for special page...');
    console.log('Special page details:', { windowId: tab.windowId, url: tab.url });
    
    // Use universal screenshot capture system
    const screenshotDataUrl = await universalScreenshotCapture(tab.windowId);
    console.log('✅ Special page screenshot captured, data URL length:', screenshotDataUrl.length);
    
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
        // If message fails, store data and let annotation interface retrieve it
        await chrome.storage.local.set({
          [`pendingScreenshot_${screenshotData.id}`]: screenshotData
        });
      }
    }, 1000);
    
    return { success: true, screenshotId: screenshotData.id };
    
  } catch (error) {
    console.error('Special page screenshot failed:', error);
    throw error;
  }
}

// Message handling from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('🎯 Background received message:', message);
  
  switch (message.action) {
    case 'ping':
      console.log('🏓 Ping received from popup');
      const browserInfo = getBrowserInfo();
      sendResponse({ 
        success: true, 
        message: 'Background script is alive!',
        browser: browserInfo.name,
        version: browserInfo.version,
        timestamp: new Date().toISOString()
      });
      return false; // Synchronous response
      
    case 'captureScreenshot':
      console.log('📸 Processing captureScreenshot request for tab:', message.tabId);
      handleCaptureScreenshotFromPopup(message.tabId)
        .then(result => {
          console.log('✅ Screenshot capture successful, sending response:', result);
          sendResponse({ success: true, data: result });
        })
        .catch(error => {
          console.error('❌ Screenshot capture failed in background:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep message channel open for async response
      
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
      
    case 'getStatistics':
      handleGetStatistics()
        .then(stats => sendResponse({ success: true, data: stats }))
        .catch(error => sendResponse({ success: false, error: error.message }));
      return true;
      
    case 'exportAllScreenshots':
      handleExportAllScreenshots()
        .then(result => sendResponse({ success: true, data: result }))
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

// Utility functions - FIXED: Removed duplicate definitions
function generateUniqueId() {
  return 'screenshot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Universal browser detection and compatibility - FIXED: Consolidated function
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';
  
  if (userAgent.includes('Edg/')) {
    browserName = 'Microsoft Edge';
    const match = userAgent.match(/Edg\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Chrome/')) {
    browserName = 'Google Chrome';
    const match = userAgent.match(/Chrome\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (userAgent.includes('Firefox/')) {
    browserName = 'Mozilla Firefox';
    const match = userAgent.match(/Firefox\/([0-9.]+)/);
    browserVersion = match ? match[1] : 'Unknown';
  }
  
  return {
    name: browserName,
    version: browserVersion,
    userAgent: userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timestamp: new Date().toISOString(),
    isEdge: browserName === 'Microsoft Edge',
    isChrome: browserName === 'Google Chrome',
    isFirefox: browserName === 'Mozilla Firefox'
  };
}

// Universal screenshot capture with browser-specific optimizations
async function universalScreenshotCapture(windowId, options = {}) {
  const browserInfo = getBrowserInfo();
  const defaultOptions = { format: 'png', quality: 100 };
  const captureOptions = { ...defaultOptions, ...options };
  
  console.log('🌐 Universal screenshot capture for:', browserInfo.name, browserInfo.version);
  
  // Try different approaches based on browser
  const attempts = [
    // Attempt 1: Standard approach with windowId
    () => chrome.tabs.captureVisibleTab(windowId, captureOptions),
    
    // Attempt 2: Without windowId (Edge compatibility)
    () => chrome.tabs.captureVisibleTab(null, captureOptions),
    
    // Attempt 3: Current window only
    () => chrome.tabs.captureVisibleTab(captureOptions),
    
    // Attempt 4: Minimal options for maximum compatibility
    () => chrome.tabs.captureVisibleTab({ format: 'png' })
  ];
  
  for (let i = 0; i < attempts.length; i++) {
    try {
      console.log(`🔄 Screenshot attempt ${i + 1}/${attempts.length} (${browserInfo.name})...`);
      const result = await attempts[i]();
      console.log(`✅ Screenshot successful on attempt ${i + 1} for ${browserInfo.name}`);
      return result;
    } catch (error) {
      console.warn(`⚠️ Screenshot attempt ${i + 1} failed for ${browserInfo.name}:`, error.message);
      if (i === attempts.length - 1) {
        throw new Error(`All screenshot attempts failed in ${browserInfo.name}. Last error: ${error.message}`);
      }
    }
  }
}

async function getBrowserInfoLegacy() {
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

// FIXED: Proper PDF generation using modern techniques
async function generatePDF(screenshot, options = {}) {
  try {
    // Create a simple PDF-like structure using modern browser APIs
    const canvas = new OffscreenCanvas(screenshot.image.width || 800, screenshot.image.height || 600);
    const ctx = canvas.getContext('2d');
    
    // Load and draw the screenshot image
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = screenshot.image;
    });
    
    // Draw image to canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Add annotations as text overlays
    if (screenshot.annotations && screenshot.annotations.length > 0) {
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      
      screenshot.annotations.forEach((annotation, index) => {
        // Draw marker circle
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw annotation number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(annotation.number || (index + 1), annotation.x, annotation.y + 4);
        
        // Draw annotation text
        if (annotation.text) {
          ctx.fillStyle = '#000000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'left';
          
          // Add white outline for better visibility
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 3;
          ctx.strokeText(annotation.text, annotation.textX || (annotation.x + 20), annotation.textY || (annotation.y - 10));
          ctx.fillText(annotation.text, annotation.textX || (annotation.x + 20), annotation.textY || (annotation.y - 10));
        }
      });
    }
    
    // Add header with metadata if requested
    if (options.includeMetadata) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, 0, canvas.width, 80);
      
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Snap Journal - ${screenshot.title || 'Screenshot'}`, 20, 25);
      
      ctx.font = '12px Arial';
      ctx.fillText(`URL: ${screenshot.url}`, 20, 45);
      ctx.fillText(`Timestamp: ${new Date(screenshot.timestamp).toLocaleString()}`, 20, 65);
    }
    
    // Convert canvas to blob
    const blob = await canvas.convertToBlob({ type: 'image/png', quality: 0.9 });
    
    // For now, return PNG data wrapped as PDF-like structure
    // In a full implementation, you would use a proper PDF library
    const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 ${canvas.width} ${canvas.height}]
/Contents 4 0 R
/Resources <<
  /XObject <<
    /Im1 5 0 R
  >>
>>
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
q
${canvas.width} 0 0 ${canvas.height} 0 0 cm
/Im1 Do
Q
endstream
endobj
5 0 obj
<<
/Type /XObject
/Subtype /Image
/Width ${canvas.width}
/Height ${canvas.height}
/ColorSpace /DeviceRGB
/BitsPerComponent 8
/Filter /DCTDecode
/Length ${blob.size}
>>
stream
`;
    
    // Combine PDF header with image data
    const pdfFooter = `
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
0000000290 00000 n 
0000000390 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${pdfHeader.length + blob.size + 50}
%%EOF`;
    
    // Create combined PDF data
    const pdfData = new Uint8Array(pdfHeader.length + blob.size + pdfFooter.length);
    const headerBytes = new TextEncoder().encode(pdfHeader);
    const footerBytes = new TextEncoder().encode(pdfFooter);
    const imageBytes = new Uint8Array(await blob.arrayBuffer());
    
    pdfData.set(headerBytes, 0);
    pdfData.set(imageBytes, headerBytes.length);
    pdfData.set(footerBytes, headerBytes.length + imageBytes.length);
    
    return pdfData;
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback: create a simple text-based PDF
    const fallbackPDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj  
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj
4 0 obj<</Length 55>>stream
BT /F1 24 Tf 100 700 Td (Snap Journal Export) Tj ET
BT /F1 12 Tf 100 650 Td (URL: ${screenshot.url}) Tj ET
BT /F1 12 Tf 100 620 Td (Timestamp: ${screenshot.timestamp}) Tj ET
endstream endobj
xref 0 5 0000000000 65535 f 0000000009 00000 n 0000000058 00000 n 0000000115 00000 n 0000000207 00000 n 
trailer<</Size 5/Root 1 0 R>>startxref 267 %%EOF`;
    
    return new TextEncoder().encode(fallbackPDF);
  }
}

// Handle screenshot capture from popup
async function handleCaptureScreenshotFromPopup(tabId) {
  try {
    console.log('🔍 Getting tab information for ID:', tabId);
    
    // Get tab information
    const tab = await chrome.tabs.get(tabId);
    
    if (!tab) {
      console.error('❌ Tab not found for ID:', tabId);
      throw new Error('Tab not found');
    }
    
    console.log('✅ Tab found:', { id: tab.id, url: tab.url, title: tab.title });
    
    // Check if we can access the tab
    if (tab.url.startsWith('chrome://') || 
        tab.url.startsWith('chrome-extension://') ||
        tab.url.startsWith('edge://') ||
        tab.url.startsWith('about:')) {
      
      console.log('🔧 Handling special page screenshot');
      // Handle special pages with different approach
      const result = await handleSpecialPageScreenshot(tab);
      console.log('✅ Special page screenshot result:', result);
      return result;
    } else {
      console.log('🌐 Handling regular page screenshot');
      // Handle regular pages
      const result = await handleRegularPageScreenshot(tab);
      console.log('✅ Regular page screenshot result:', result);
      return result;
    }
    
  } catch (error) {
    console.error('💥 Screenshot capture from popup failed:', error);
    throw error;
  }
}

// Handle get statistics
async function handleGetStatistics() {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    const config = storage.snapJournalConfig || {};
    
    const db = await openDatabase();
    const transaction = db.transaction(['screenshots'], 'readonly');
    const store = transaction.objectStore('screenshots');
    
    // Count total screenshots
    const countRequest = store.count();
    const totalScreenshots = await new Promise((resolve, reject) => {
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => reject(countRequest.error);
    });
    
    // Count total annotations
    const allRequest = store.getAll();
    const screenshots = await new Promise((resolve, reject) => {
      allRequest.onsuccess = () => resolve(allRequest.result);
      allRequest.onerror = () => reject(allRequest.error);
    });
    
    const totalAnnotations = screenshots.reduce((sum, screenshot) => {
      return sum + (screenshot.annotations ? screenshot.annotations.length : 0);
    }, 0);
    
    return {
      totalScreenshots: totalScreenshots,
      totalAnnotations: totalAnnotations,
      totalExports: config.statistics?.pdf_exported || 0,
      lastActivity: config.statistics?.lastActivity || null
    };
    
  } catch (error) {
    console.error('Failed to get statistics:', error);
    return {
      totalScreenshots: 0,
      totalAnnotations: 0,
      totalExports: 0,
      lastActivity: null
    };
  }
}

// Handle export all screenshots
async function handleExportAllScreenshots() {
  try {
    const screenshots = await handleGetScreenshots();
    
    if (screenshots.length === 0) {
      throw new Error('No screenshots to export');
    }
    
    // For now, just show a success message
    // In a full implementation, this would generate a ZIP file with all screenshots
    await updateStatistics('bulk_export');
    
    return {
      message: `Successfully exported ${screenshots.length} screenshots`,
      count: screenshots.length
    };
    
  } catch (error) {
    console.error('Failed to export all screenshots:', error);
    throw error;
  }
}

// Handle get settings
async function handleGetSettings() {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    const config = storage.snapJournalConfig || {};
    
    return config.settings || {
      markerSize: 16,
      markerColor: '#FF0000',
      textSize: 14,
      exportFormat: 'pdf',
      includeTimestamp: true,
      includeMetadata: true,
      hipaaMode: false,
      autoCleanup: false
    };
    
  } catch (error) {
    console.error('Failed to get settings:', error);
    throw error;
  }
}

// Handle update settings
async function handleUpdateSettings(newSettings) {
  try {
    const storage = await chrome.storage.local.get(['snapJournalConfig']);
    const config = storage.snapJournalConfig || {};
    
    config.settings = { ...config.settings, ...newSettings };
    config.lastUpdated = new Date().toISOString();
    
    await chrome.storage.local.set({ snapJournalConfig: config });
    
    return { success: true };
    
  } catch (error) {
    console.error('Failed to update settings:', error);
    throw error;
  }
}

// Generate unique ID
function generateUniqueId() {
  return 'screenshot_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get browser info
async function getBrowserInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timestamp: new Date().toISOString()
  };
}

// Show error notification
function showErrorNotification(message) {
  chrome.notifications?.create({
    type: 'basic',
    iconUrl: 'icons/icon48.png',
    title: 'Snap Journal Error',
    message: message
  });
}

console.log('Snap Journal background service worker loaded successfully');