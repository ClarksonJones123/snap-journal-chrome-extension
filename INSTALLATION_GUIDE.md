# 🛠️ Snap Journal - Installation Guide

> **Complete installation instructions for all environments and use cases**

## 📋 **Installation Overview**

Snap Journal supports multiple installation methods to meet different organizational and security requirements:

| Method | Use Case | Time Required | Skill Level |
|--------|----------|---------------|-------------|
| **[Developer Mode](#developer-mode-installation)** | Individual users, testing | 2 minutes | Beginner |
| **[Enterprise Deployment](#enterprise-deployment)** | Corporate environments | 15 minutes | Intermediate |
| **[Offline Installation](#offline-installation)** | Secure/air-gapped networks | 5 minutes | Intermediate |
| **[Custom Build](#custom-build-installation)** | Modified versions | 10 minutes | Advanced |

---

## 🚀 **Developer Mode Installation**

### **Prerequisites**
- Google Chrome 88+ or Chromium-based browser
- Basic computer access (no admin rights required)
- Internet connection for download

### **Step-by-Step Instructions**

#### **1. Download Snap Journal**
```bash
# Option A: Git Clone (Recommended)
git clone https://github.com/your-org/snap-journal.git
cd snap-journal

# Option B: Direct Download
# Download ZIP from GitHub → Extract to desired location
```

#### **2. Enable Developer Mode**
1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Toggle **"Developer mode"** switch (top-right corner)
4. Verify developer options appear

#### **3. Load Extension**
1. Click **"Load unpacked"** button
2. Navigate to snap-journal directory
3. Select the folder containing `manifest.json`
4. Click **"Select Folder"**

#### **4. Verify Installation**
1. Extension icon appears in Chrome toolbar
2. Extension listed in `chrome://extensions/`
3. Status shows "Enabled"
4. No error messages displayed

### **Troubleshooting Developer Mode**

#### **Common Issues**
```
Issue: "Load unpacked" button not visible
Solution: Ensure Developer Mode toggle is enabled

Issue: "Manifest file is missing or unreadable"
Solution: Verify you selected the correct directory containing manifest.json

Issue: Extension loads but icon doesn't appear
Solution: Pin extension to toolbar via Extensions menu
```

---

## 🏢 **Enterprise Deployment**

### **Prerequisites**
- Chrome Enterprise or Chrome for Business
- Group Policy management access
- Network file share or deployment system

### **Deployment Methods**

#### **Method 1: Group Policy Deployment**
```xml
<!-- Chrome Enterprise Policy -->
<policy name="ExtensionInstallForcelist">
  <value>
    <item>snap-journal-id;https://your-domain.com/snap-journal.crx</item>
  </value>
</policy>
```

#### **Method 2: Registry Deployment (Windows)**
```registry
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallForcelist]
"1"="snap-journal-id;https://your-domain.com/snap-journal.crx"
```

#### **Method 3: Configuration File (macOS/Linux)**
```json
{
  "ExtensionInstallForcelist": [
    "snap-journal-id;https://your-domain.com/snap-journal.crx"
  ]
}
```

### **Enterprise Configuration**

#### **Security Policies**
```json
{
  "snap_journal_config": {
    "storage_limit": "unlimited",
    "export_formats": ["pdf", "png"],
    "allowed_domains": ["*.company.com", "*.medical-system.com"],
    "hipaa_mode": true,
    "audit_logging": true
  }
}
```

#### **Network Requirements**
- **Outbound**: None (fully offline capable)
- **Storage**: Local IndexedDB (unlimited)
- **Permissions**: Standard Chrome extension permissions

---

## 🔒 **Offline Installation**

### **For Secure/Air-Gapped Environments**

#### **1. Prepare Installation Package**
```bash
# On internet-connected machine
git clone https://github.com/your-org/snap-journal.git
cd snap-journal

# Create deployment package
zip -r snap-journal-offline.zip . -x "*.git*" "*.md" "docs/*"

# Transfer to secure environment via approved method
```

#### **2. Install in Secure Environment**
```bash
# Extract package
unzip snap-journal-offline.zip -d /secure/location/snap-journal

# Load in Chrome (same as developer mode)
# chrome://extensions/ → Developer Mode → Load unpacked
```

#### **3. Verify Offline Functionality**
- Screenshot capture works without internet
- Annotations save to local IndexedDB
- PDF export functions offline
- No external network requests made

---

## 🔧 **Custom Build Installation**

### **For Modified Versions**

#### **Prerequisites**
- Node.js 16+ (for build tools)
- Git for version control
- Text editor for modifications

#### **Build Process**
```bash
# Clone and modify
git clone https://github.com/your-org/snap-journal.git
cd snap-journal

# Make your modifications
# Edit manifest.json, source files, etc.

# Validate manifest
chrome --pack-extension=. --pack-extension-key=key.pem

# Install custom build
# Load unpacked from modified directory
```

#### **Custom Configuration**
```javascript
// config/custom-config.js
const CUSTOM_CONFIG = {
  branding: {
    name: "Your Company Screenshot Tool",
    icon: "custom-icon.png"
  },
  features: {
    unlimited_storage: true,
    custom_export_formats: ["pdf", "docx"],
    corporate_watermark: true
  }
};
```

---

## 🏥 **Healthcare/HIPAA Installation**

### **Special Requirements for Medical Environments**

#### **1. Security Validation**
```bash
# Verify no external connections
netstat -an | grep :443  # Should show no outbound HTTPS during use
netstat -an | grep :80   # Should show no outbound HTTP during use

# Verify local storage only
# Check Chrome DevTools → Application → IndexedDB
# Confirm all data stored locally
```

#### **2. Compliance Configuration**
```json
{
  "hipaa_mode": {
    "enabled": true,
    "audit_logging": true,
    "encryption_at_rest": true,
    "automatic_cleanup": {
      "enabled": true,
      "retention_days": 2555  // 7 years
    }
  }
}
```

#### **3. Validation Checklist**
- ✅ No external network connections
- ✅ All data stored locally
- ✅ No cloud synchronization
- ✅ Audit trail available
- ✅ Encryption at rest
- ✅ Automatic cleanup options

---

## 🔍 **Installation Verification**

### **Functional Testing**

#### **Basic Functionality Test**
```
1. Navigate to chrome://settings/
2. Click Snap Journal extension icon
3. Verify screenshot captures
4. Add test annotation
5. Save screenshot
6. Export PDF
7. Verify all functions work
```

#### **Compatibility Test**
```
Test on various page types:
✅ Regular websites (google.com)
✅ Chrome internal pages (chrome://settings/)
✅ Local files (file:// URLs)
✅ Secure sites (banking websites)
✅ Corporate intranets
```

#### **Storage Test**
```
1. Create 10+ annotated screenshots
2. Verify all save successfully
3. Check IndexedDB storage usage
4. Confirm no storage limits hit
5. Test PDF export for all screenshots
```

---

## 🚨 **Troubleshooting Installation**

### **Common Installation Issues**

#### **Extension Won't Load**
```
Symptoms: Error messages, extension doesn't appear
Causes: 
- Incorrect directory selected
- Missing manifest.json
- Corrupted download

Solutions:
1. Re-download extension
2. Verify manifest.json exists
3. Check Chrome console for errors
4. Try different Chrome profile
```

#### **Permissions Issues**
```
Symptoms: Extension loads but features don't work
Causes:
- Insufficient browser permissions
- Corporate policy restrictions
- Antivirus interference

Solutions:
1. Check chrome://extensions/ permissions
2. Whitelist extension in antivirus
3. Contact IT for policy exceptions
```

#### **Storage Problems**
```
Symptoms: Screenshots won't save
Causes:
- Insufficient disk space
- Browser storage limits
- Corrupted IndexedDB

Solutions:
1. Free up disk space
2. Clear browser data
3. Reset extension storage
4. Reinstall extension
```

---

## 📊 **System Requirements**

### **Minimum Requirements**
- **Browser**: Chrome 88+, Edge 88+, or Chromium-based
- **RAM**: 4GB (8GB recommended for large screenshots)
- **Storage**: 1GB free space (more for extensive use)
- **OS**: Windows 10+, macOS 10.14+, Linux (any modern distribution)

### **Recommended Requirements**
- **Browser**: Latest Chrome version
- **RAM**: 8GB+ for optimal performance
- **Storage**: 10GB+ for professional use
- **Display**: 1920x1080+ for best annotation experience

### **Enterprise Requirements**
- **Management**: Chrome Enterprise or equivalent
- **Network**: Offline capability (no internet required)
- **Security**: Compatible with corporate security policies
- **Compliance**: HIPAA, SOX, GDPR compatible

---

## 🎉 **Installation Complete**

### **Next Steps**
1. **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get running in 2 minutes
2. **[User Manual](USER_MANUAL.md)** - Complete feature documentation
3. **[Feature Documentation](FEATURE_DOCUMENTATION.md)** - All capabilities

### **Support Resources**
- **[Troubleshooting Guide](TROUBLESHOOTING.md)** - Common issues and solutions
- **[User Guide](docs/USER_GUIDE.md)** - Comprehensive documentation
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** - Security and compliance

---

**Installation successful! You now have the world's most advanced screenshot annotation system ready for professional use.** 🚀

*Need help? Check our [Troubleshooting Guide](TROUBLESHOOTING.md) or [User Manual](USER_MANUAL.md).*