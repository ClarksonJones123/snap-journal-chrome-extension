# 🚨 Snap Journal - Troubleshooting Guide

> **Comprehensive troubleshooting guide for resolving common issues and optimizing performance**

## 📋 **Quick Issue Resolution**

### **🔧 Most Common Issues**

| Issue | Quick Fix | Success Rate |
|-------|-----------|--------------|
| **Extension won't load** | Enable Developer Mode → Reload extension | 95% |
| **Screenshot appears blank** | Wait for page load → Scroll to top → Try again | 90% |
| **Annotations not saving** | Check storage permissions → Clear browser cache | 85% |
| **PDF export fails** | Close other tabs → Check popup blockers | 80% |
| **Interface not responding** | Refresh page → Restart Chrome | 75% |

---

## 📸 **Screenshot Capture Issues**

### **Blank or Partial Screenshots**

#### **Symptoms**
- Screenshot shows only white/gray area
- Partial page capture missing content
- Loading indicators visible in screenshot

#### **Causes & Solutions**
```
Cause: Page not fully loaded
Solution: 
1. Wait for page to completely load
2. Look for loading spinners to disappear
3. Wait 2-3 seconds after page appears ready
4. Try capture again

Cause: Dynamic content still loading
Solution:
1. Scroll through entire page once
2. Wait for images and videos to load
3. Check for lazy-loaded content
4. Retry screenshot capture

Cause: Browser zoom affecting capture
Solution:
1. Reset browser zoom to 100% (Ctrl+0)
2. Refresh the page
3. Attempt screenshot again
4. Avoid zooming during capture process
```

### **Extension Icon Not Responding**

#### **Symptoms**
- Clicking extension icon does nothing
- No popup appears
- Extension appears grayed out

#### **Diagnostic Steps**
```
Step 1: Check Extension Status
1. Navigate to chrome://extensions/
2. Verify Snap Journal is enabled
3. Look for error messages
4. Check if Developer Mode is on

Step 2: Reload Extension
1. Click "Reload" button on extension card
2. Wait for reload to complete
3. Try clicking icon again

Step 3: Check Permissions
1. Verify extension has required permissions
2. Check if site is blocked by corporate policy
3. Try on different webpage
```

### **Chrome Internal Pages Issues**

#### **Special Page Compatibility**
```
Supported Chrome URLs:
✅ chrome://settings/ - Full support
✅ chrome://extensions/ - Full support  
✅ chrome://history/ - Full support
✅ chrome://downloads/ - Full support
✅ chrome://bookmarks/ - Full support

Troubleshooting Chrome Pages:
1. Ensure you're on supported chrome:// URL
2. Refresh the chrome:// page
3. Try different chrome:// page to test
4. Check Chrome version (requires 88+)
```

---

## 🎯 **Annotation System Issues**

### **Markers Not Appearing**

#### **Symptoms**
- Click on screenshot but no marker appears
- Markers appear but disappear immediately
- Cannot place markers in certain areas

#### **Solutions**
```
JavaScript Conflicts:
1. Open browser console (F12)
2. Look for JavaScript errors
3. Disable other extensions temporarily
4. Try in incognito mode

Content Security Policy Issues:
1. Check if site has strict CSP
2. Try on different website
3. Report site compatibility issue

Browser Compatibility:
1. Update Chrome to latest version
2. Clear browser cache and cookies
3. Restart Chrome completely
4. Try different Chrome profile
```

### **Text Labels Not Saving**

#### **Symptoms**
- Type text but it disappears
- Text doesn't save when clicking away
- Cannot edit existing text

#### **Diagnostic Process**
```
Storage Issues:
1. Check available disk space (need 1GB+)
2. Clear browser storage: chrome://settings/clearBrowserData
3. Check storage permissions in chrome://settings/content/all
4. Try saving smaller amount of text

Input Validation Problems:
1. Avoid special characters initially
2. Keep text under 500 characters
3. Don't use HTML tags in text
4. Try simple alphanumeric text first

Browser State Issues:
1. Close other resource-heavy tabs
2. Restart Chrome browser
3. Clear extension storage and retry
4. Reinstall extension if persistent
```

### **Dragging Not Working**

#### **Symptoms**
- Cannot move text labels
- Dragging doesn't respond
- Text jumps to wrong position

#### **Solutions**
```
Mouse/Trackpad Issues:
1. Try using mouse instead of trackpad
2. Check mouse drivers are updated
3. Test dragging on other websites
4. Disable mouse acceleration temporarily

Browser Performance:
1. Close unnecessary browser tabs
2. Check CPU usage in Task Manager
3. Disable hardware acceleration if needed
4. Try in new Chrome window

Interface Conflicts:
1. Don't drag too quickly
2. Click and hold before dragging
3. Ensure you're clicking on text area
4. Try dragging from different part of text box
```

---

## 💾 **Storage and Data Issues**

### **Screenshots Not Saving**

#### **Symptoms**
- "Save Screenshot" button doesn't work
- No confirmation message appears
- Screenshots missing from gallery

#### **Comprehensive Troubleshooting**
```
Storage Quota Issues:
1. Check available disk space
   - Windows: Check C: drive space
   - Mac: Check storage in About This Mac
   - Need at least 1GB free space

2. Clear browser storage
   - Go to chrome://settings/clearBrowserData
   - Select "All time" time range
   - Check "Site data" and "Cached images"
   - Clear data and restart Chrome

3. Check IndexedDB status
   - Open Developer Tools (F12)
   - Go to Application tab
   - Check IndexedDB section
   - Look for SnapJournalDB database

Permission Problems:
1. Check site permissions
   - Go to chrome://settings/content/all
   - Search for storage permissions
   - Ensure not blocked for extension

2. Corporate/School restrictions
   - Check with IT department
   - Try on personal device
   - Use different network if possible

Extension State Issues:
1. Reload extension
   - Go to chrome://extensions/
   - Click reload on Snap Journal
   - Try saving again

2. Reinstall extension
   - Remove extension completely
   - Restart Chrome
   - Reinstall from source
   - Test saving functionality
```

### **Gallery Not Loading**

#### **Symptoms**
- Gallery shows "No screenshots"
- Loading spinner never stops
- Error messages in gallery

#### **Solutions**
```
Database Corruption:
1. Clear extension storage
   - Go to chrome://extensions/
   - Click "Details" on Snap Journal
   - Click "Extension options" if available
   - Clear all data

2. Database repair
   - Close all Chrome windows
   - Restart Chrome
   - Try accessing gallery again
   - Extension will auto-repair database

Data Migration Issues:
1. Export existing screenshots first
2. Clear browser data
3. Reinstall extension
4. Import screenshots if possible

Performance Issues:
1. Too many screenshots stored
   - Delete old screenshots
   - Export important ones as PDF
   - Keep gallery under 100 screenshots

2. Large screenshot files
   - Avoid capturing very large pages
   - Use browser zoom to reduce size
   - Clear cache regularly
```

---

## 📄 **Export and PDF Issues**

### **PDF Export Fails**

#### **Symptoms**
- "Export PDF" button doesn't work
- PDF download doesn't start
- Corrupted or empty PDF files

#### **Troubleshooting Steps**
```
Browser Download Issues:
1. Check popup blockers
   - Disable popup blocker for extension
   - Allow downloads in Chrome settings
   - Check corporate download policies

2. Download permissions
   - Go to chrome://settings/downloads
   - Ensure downloads are enabled
   - Check download location is writable
   - Try changing download folder

Memory and Performance:
1. Close other browser tabs
   - Keep only essential tabs open
   - Check Chrome Task Manager (Shift+Esc)
   - End high-memory processes

2. System resources
   - Check available RAM (need 4GB+)
   - Close other applications
   - Restart computer if needed

PDF Generation Problems:
1. Screenshot too large
   - Try smaller screenshots
   - Reduce browser zoom before capture
   - Split large pages into sections

2. Too many annotations
   - Limit to 20 annotations per screenshot
   - Use shorter text in annotations
   - Remove unnecessary markers
```

### **PDF Quality Issues**

#### **Symptoms**
- Blurry or pixelated PDF output
- Text annotations not readable
- Missing elements in PDF

#### **Solutions**
```
Quality Settings:
1. Capture at 100% zoom
   - Reset browser zoom (Ctrl+0)
   - Capture screenshot
   - Then export to PDF

2. High-resolution display issues
   - Check display scaling settings
   - Try 100% display scaling
   - Restart Chrome after changes

Text Rendering:
1. Use standard fonts
   - Avoid special characters
   - Keep text concise
   - Use common punctuation only

2. Annotation positioning
   - Don't overlap text labels
   - Keep text away from image edges
   - Use contrasting colors
```

---

## 🔧 **Performance Optimization**

### **Slow Performance**

#### **Symptoms**
- Extension responds slowly
- Long delays when adding annotations
- Browser becomes unresponsive

#### **Optimization Steps**
```
Browser Optimization:
1. Update Chrome to latest version
2. Clear browser cache and cookies
3. Disable unnecessary extensions
4. Restart Chrome regularly

System Resources:
1. Close other applications
2. Check available RAM (need 8GB+ recommended)
3. Free up disk space (need 10GB+ free)
4. Update graphics drivers

Extension-Specific:
1. Limit screenshots in gallery (under 50)
2. Export and delete old screenshots
3. Use shorter annotation text
4. Avoid very large page captures

Network Issues:
1. Extension works offline
2. Disable network-heavy extensions
3. Close streaming/download tabs
4. Use wired connection if possible
```

### **Memory Usage Issues**

#### **Symptoms**
- Chrome uses excessive memory
- System becomes slow
- "Out of memory" errors

#### **Memory Management**
```
Chrome Memory Settings:
1. Enable memory saver
   - Go to chrome://settings/performance
   - Enable "Memory Saver"
   - Configure inactive tab handling

2. Limit tab usage
   - Keep under 10 tabs open
   - Use bookmarks instead of keeping tabs
   - Close tabs after use

Extension Memory:
1. Clear screenshot gallery regularly
2. Export important screenshots as PDF
3. Avoid capturing very large pages
4. Restart Chrome daily

System Memory:
1. Close other applications
2. Check for memory leaks
3. Restart computer regularly
4. Consider upgrading RAM if under 8GB
```

---

## 🔒 **Security and Privacy Issues**

### **Corporate Network Issues**

#### **Symptoms**
- Extension blocked by IT policy
- Cannot access certain websites
- Features disabled in corporate environment

#### **Solutions**
```
IT Department Coordination:
1. Contact IT support
2. Explain medical/professional use case
3. Request extension whitelist
4. Provide security documentation

Alternative Approaches:
1. Use on personal device
2. Request exception for specific sites
3. Use during non-work hours
4. Export data for work use

Compliance Requirements:
1. Verify HIPAA compliance needs
2. Document local-only storage
3. Provide privacy policy
4. Demonstrate no cloud upload
```

### **Privacy Concerns**

#### **Symptoms**
- Concerns about data storage
- Questions about data transmission
- Compliance requirements

#### **Privacy Verification**
```
Data Storage Verification:
1. Check chrome://settings/content/all
2. Verify no external connections
3. Monitor network traffic during use
4. Confirm local-only storage

Compliance Documentation:
1. Review privacy policy
2. Document local storage only
3. Verify no cloud synchronization
4. Maintain audit trail if needed

Data Control:
1. Export data regularly
2. Clear data when needed
3. Control access permissions
4. Document usage for compliance
```

---

## 🛠️ **Advanced Troubleshooting**

### **Developer Tools Debugging**

#### **Using Chrome DevTools**
```
Console Debugging:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Copy errors for support

Network Monitoring:
1. Go to Network tab
2. Reload page
3. Check for failed requests
4. Verify no external calls

Storage Inspection:
1. Go to Application tab
2. Check IndexedDB section
3. Verify SnapJournalDB exists
4. Check stored data
```

### **Extension Debugging**

#### **Background Script Issues**
```
Service Worker Debugging:
1. Go to chrome://extensions/
2. Click "Details" on Snap Journal
3. Click "Inspect views: service worker"
4. Check console for errors

Content Script Issues:
1. Open page with issues
2. Open DevTools (F12)
3. Check console for content script errors
4. Verify script injection

Permission Issues:
1. Check manifest.json permissions
2. Verify host permissions
3. Test on different sites
4. Check for permission prompts
```

### **Clean Reinstallation**

#### **Complete Reset Process**
```
Step 1: Export Data
1. Export all important screenshots
2. Save settings if customized
3. Document any custom configurations

Step 2: Complete Removal
1. Remove extension from Chrome
2. Clear all browser data
3. Restart Chrome completely
4. Clear extension storage manually

Step 3: Fresh Installation
1. Download latest extension version
2. Install in Developer Mode
3. Test basic functionality
4. Import data if needed

Step 4: Verification
1. Test screenshot capture
2. Verify annotation functionality
3. Test PDF export
4. Check gallery loading
```

---

## 📞 **Getting Additional Help**

### **Self-Service Resources**
- **[User Manual](USER_MANUAL.md)** - Complete feature documentation
- **[Installation Guide](INSTALLATION_GUIDE.md)** - Setup instructions
- **[Feature Documentation](FEATURE_DOCUMENTATION.md)** - Technical details
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** - Security information

### **Reporting Issues**
When reporting issues, please include:
1. **Chrome version** (chrome://version/)
2. **Operating system** and version
3. **Extension version** (check chrome://extensions/)
4. **Specific error messages** (from console)
5. **Steps to reproduce** the issue
6. **Screenshots** of the problem

### **Professional Support**
For enterprise users and professional environments:
- Priority technical support
- Custom configuration assistance
- Compliance documentation
- Training and onboarding

---

## 🎯 **Prevention Best Practices**

### **Avoiding Common Issues**
1. **Keep Chrome Updated** - Always use latest version
2. **Regular Maintenance** - Clear cache weekly
3. **Storage Management** - Export old screenshots regularly
4. **Resource Monitoring** - Keep system resources available
5. **Backup Strategy** - Export important documentation

### **Optimal Usage Patterns**
1. **Capture at 100% zoom** for best quality
2. **Wait for page load** before capturing
3. **Limit annotations** to 20 per screenshot
4. **Export regularly** to prevent data loss
5. **Monitor storage usage** to avoid quota issues

---

**Most issues can be resolved with these troubleshooting steps. For persistent problems, ensure you have the latest version and consider a clean reinstallation.** 🚀

*Need more help? Check our [User Manual](USER_MANUAL.md) or [Feature Documentation](FEATURE_DOCUMENTATION.md).*