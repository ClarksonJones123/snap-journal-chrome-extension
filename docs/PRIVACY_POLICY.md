# 🔒 Snap Journal - Privacy Policy

> **Comprehensive privacy policy for medical-grade screenshot annotation extension**

**Effective Date:** January 15, 2025  
**Version:** 2.0.1  
**Last Updated:** January 15, 2025

---

## 📋 **Privacy Policy Overview**

Snap Journal is designed with privacy as a fundamental principle. This extension operates entirely on your local device with **zero data transmission** to external servers, making it suitable for healthcare, corporate, and other privacy-sensitive environments.

### **🔐 Core Privacy Principles**

| Principle | Implementation | Verification |
|-----------|----------------|--------------|
| **Local-Only Processing** | All data remains on your computer | No network requests made |
| **Zero Data Collection** | No personal information collected | No analytics or tracking |
| **No Cloud Storage** | Screenshots stored locally only | IndexedDB browser storage |
| **HIPAA Compatible** | Meets healthcare privacy requirements | Local processing only |
| **User Control** | Complete control over your data | Delete anytime |

---

## 🏥 **HIPAA Compliance**

### **Healthcare Privacy Requirements Met**

Snap Journal meets the following HIPAA requirements for healthcare environments:

#### **Administrative Safeguards**
- ✅ **Local Access Control** - Only user has access to screenshots
- ✅ **Audit Controls** - Optional audit trail of all actions
- ✅ **Information Integrity** - Data cannot be altered externally
- ✅ **Transmission Security** - No data transmission occurs

#### **Physical Safeguards**
- ✅ **Facility Access Controls** - Data stored on user's device only
- ✅ **Workstation Use** - Standard browser security applies
- ✅ **Device Controls** - User controls all data access

#### **Technical Safeguards**
- ✅ **Access Control** - Browser-level security controls
- ✅ **Audit Controls** - Complete action logging available
- ✅ **Integrity** - Data cannot be modified externally
- ✅ **Person Authentication** - Browser user authentication
- ✅ **Transmission Security** - No external transmission

### **Protected Health Information (PHI)**

```
PHI Handling:
✅ Screenshots containing PHI remain local
✅ No PHI transmitted to external servers
✅ User controls all PHI access and deletion
✅ Automatic cleanup options available
✅ Secure deletion when requested
✅ No unauthorized access possible
```

---

## 📊 **Data Collection and Usage**

### **What Data We DO NOT Collect**

Snap Journal **does not collect, store, or transmit** any of the following:

- ❌ **Personal Information** - No names, emails, or contact details
- ❌ **Usage Analytics** - No tracking of how you use the extension
- ❌ **Screenshot Content** - Screenshots never leave your device
- ❌ **Browsing History** - No record of websites you visit
- ❌ **Location Data** - No geographic information collected
- ❌ **Device Information** - No hardware or system details
- ❌ **Network Data** - No IP addresses or network information
- ❌ **Behavioral Data** - No user behavior tracking
- ❌ **Demographic Data** - No age, gender, or personal details
- ❌ **Financial Information** - No payment or billing data

### **What Data Stays Local**

The following data is stored **only on your local device**:

- ✅ **Screenshots** - Captured images stored in browser IndexedDB
- ✅ **Annotations** - Text and marker data for your screenshots
- ✅ **User Settings** - Your preferences and configuration
- ✅ **Export History** - Record of PDFs you've generated
- ✅ **Usage Statistics** - Optional local counters (screenshots taken, etc.)

### **Data Storage Location**

```
Local Storage Details:
- Storage Type: Browser IndexedDB
- Location: User's computer only
- Access: User and browser only
- Encryption: Browser-level encryption
- Backup: User-controlled export only
- Deletion: User-controlled, permanent
```

---

## 🔧 **Browser Permissions**

### **Required Permissions**

Snap Journal requests minimal browser permissions:

#### **activeTab Permission**
- **Purpose**: Capture screenshots of current browser tab
- **Scope**: Only the currently active tab
- **Usage**: Screenshot capture functionality
- **Data Access**: Visual content only, no personal data

#### **storage Permission**
- **Purpose**: Store screenshots and settings locally
- **Scope**: Browser's local storage only
- **Usage**: Save screenshots and user preferences
- **Data Access**: Extension data only

#### **downloads Permission**
- **Purpose**: Export PDF files to user's download folder
- **Scope**: Download folder access only
- **Usage**: PDF export functionality
- **Data Access**: Generated PDF files only

### **Permissions We DO NOT Request**

- ❌ **Network Access** - No internet connectivity required
- ❌ **File System Access** - No access to user files
- ❌ **Camera/Microphone** - No media device access
- ❌ **Location Services** - No geographic data access
- ❌ **Cross-Origin Requests** - No external server communication
- ❌ **Background Processing** - No persistent background activity
- ❌ **System Information** - No hardware or OS data access

---

## 🛡️ **Security Measures**

### **Data Protection**

#### **Content Security Policy (CSP)**
```javascript
Security Configuration:
- script-src: 'self' only (no external scripts)
- object-src: 'none' (no plugins allowed)
- base-uri: 'self' (prevent base tag injection)
- form-action: 'self' (restrict form submissions)
- frame-ancestors: 'none' (prevent framing attacks)
```

#### **Input Validation**
- **Text Sanitization** - All user input sanitized to prevent XSS
- **Data Validation** - All data validated before storage
- **Type Checking** - Strict data type enforcement
- **Length Limits** - Reasonable limits on text input

#### **Secure Storage**
- **Browser Encryption** - Data encrypted by browser
- **Access Control** - Only extension can access stored data
- **Integrity Checks** - Data corruption detection and repair
- **Secure Deletion** - Complete data removal when requested

### **Network Security**

#### **Zero External Communication**
```
Network Policy:
✅ No outbound HTTP/HTTPS requests
✅ No external API calls
✅ No cloud service integration
✅ No third-party analytics
✅ No update checks to external servers
✅ No error reporting to external services
```

#### **Offline Operation**
- **Complete Offline Functionality** - Works without internet
- **No Dependencies** - No external libraries or services
- **Local Processing** - All operations performed locally
- **Air-Gap Compatible** - Suitable for isolated networks

---

## 👤 **User Rights and Control**

### **Data Ownership**

You maintain complete ownership and control of your data:

- **Full Ownership** - All screenshots and annotations belong to you
- **Complete Control** - Add, modify, or delete data anytime
- **Export Rights** - Export all data in standard formats
- **Deletion Rights** - Permanently delete all data anytime
- **Access Rights** - View all stored data through gallery interface

### **Data Portability**

#### **Export Options**
```
Data Export Formats:
- PDF: Professional documentation format
- PNG: High-quality image format
- JSON: Complete data export for backup
- CSV: Annotation data for analysis
```

#### **Import/Migration**
- **Settings Export** - Save and restore configuration
- **Bulk Export** - Export all screenshots at once
- **Selective Export** - Choose specific screenshots to export
- **Format Flexibility** - Multiple export format options

### **Data Deletion**

#### **Individual Deletion**
- **Screenshot Deletion** - Remove individual screenshots
- **Annotation Deletion** - Remove specific annotations
- **Selective Cleanup** - Choose what to keep or remove

#### **Complete Data Removal**
```
Complete Deletion Process:
1. Remove extension from Chrome
2. Clear browser data for extension
3. All local data permanently deleted
4. No recovery possible
5. No external copies exist
```

---

## 🏢 **Enterprise and Institutional Use**

### **Corporate Environments**

#### **IT Department Information**
```
Technical Details for IT:
- No external network connections required
- No cloud services or APIs used
- All data stored in browser IndexedDB
- Standard Chrome extension security model
- No special firewall rules needed
- Compatible with corporate security policies
```

#### **Compliance Documentation**
- **Security Assessment** - Complete security documentation available
- **Privacy Impact Assessment** - No privacy risks identified
- **Data Flow Diagram** - Local-only data flow documented
- **Risk Assessment** - Minimal risk profile due to local operation

### **Healthcare Institutions**

#### **HIPAA Business Associate Agreement (BAA)**
```
BAA Status: Not Required
Reason: No PHI access by third party
- Extension operates locally only
- No data sharing with Snap Journal developers
- No cloud storage or transmission
- User maintains complete control
- No business associate relationship exists
```

#### **Medical Device Considerations**
- **Not a Medical Device** - Documentation tool only
- **No Diagnostic Function** - Does not analyze medical data
- **Professional Use** - Suitable for medical documentation
- **Quality Standards** - Meets professional documentation requirements

---

## 🌍 **International Privacy Compliance**

### **GDPR Compliance (European Union)**

#### **Legal Basis for Processing**
```
GDPR Article 6 Basis: Not Applicable
Reason: No personal data processing occurs
- Extension processes screenshots only
- No personal data collected or stored
- No data subject rights needed
- No data controller responsibilities
- No cross-border data transfers
```

#### **Data Subject Rights**
Since no personal data is collected:
- **Right to Access** - Not applicable (no data collected)
- **Right to Rectification** - Not applicable (no data collected)
- **Right to Erasure** - User controls all data deletion
- **Right to Portability** - Export functionality provided
- **Right to Object** - Not applicable (no processing)

### **Other International Regulations**

#### **CCPA (California Consumer Privacy Act)**
- **Not Applicable** - No personal information collected
- **No Sale of Data** - No data collection or sharing occurs
- **Consumer Rights** - User maintains complete control

#### **PIPEDA (Canada)**
- **Not Applicable** - No personal information collected
- **Privacy by Design** - Built with privacy as core principle

---

## 🔄 **Updates and Changes**

### **Privacy Policy Updates**

#### **Notification Process**
```
Update Notification:
1. Privacy policy changes announced in extension
2. Major changes require user acknowledgment
3. Version history maintained for transparency
4. Users notified before changes take effect
```

#### **Version Control**
- **Version Numbers** - Each policy version numbered
- **Change Log** - All changes documented
- **Effective Dates** - Clear effective date for each version
- **Archive Access** - Previous versions available for reference

### **Extension Updates**

#### **Privacy-Preserving Updates**
- **Local Updates Only** - Chrome Web Store automatic updates
- **No Data Collection** - Updates don't collect usage data
- **Settings Preservation** - User settings maintained across updates
- **Data Integrity** - Screenshots and annotations preserved

---

## 📞 **Contact and Support**

### **Privacy Questions**

For privacy-related questions or concerns:

#### **General Privacy Questions**
- Review this privacy policy thoroughly
- Check our [User Manual](../USER_MANUAL.md) for technical details
- Consult [Troubleshooting Guide](../TROUBLESHOOTING.md) for issues

#### **Enterprise Privacy Inquiries**
- Contact your IT department for corporate policy questions
- Review enterprise deployment documentation
- Consult with legal/compliance teams as needed

#### **Healthcare Privacy Questions**
- Consult with your healthcare organization's privacy officer
- Review HIPAA compliance documentation
- Verify local storage meets your organization's requirements

### **Data Breach Notification**

#### **Breach Prevention**
```
Breach Prevention Measures:
✅ No external data transmission (no breach possible)
✅ Local storage only (no server compromise risk)
✅ No user accounts (no credential theft risk)
✅ No network access (no interception risk)
✅ Browser security model (standard protection)
```

#### **Incident Response**
In the unlikely event of a security issue:
1. **Assessment** - Evaluate scope and impact
2. **Notification** - Inform users through extension updates
3. **Mitigation** - Provide immediate protective measures
4. **Resolution** - Deploy fixes through Chrome Web Store
5. **Documentation** - Maintain incident records

---

## ✅ **Privacy Verification**

### **Independent Verification**

Users can verify our privacy claims:

#### **Network Monitoring**
```
Verification Steps:
1. Install network monitoring tool
2. Use Snap Journal normally
3. Verify no external network requests
4. Confirm local-only operation
```

#### **Data Storage Inspection**
```
Browser DevTools Verification:
1. Open Chrome DevTools (F12)
2. Go to Application tab
3. Check IndexedDB section
4. Verify SnapJournalDB contains only local data
5. Confirm no external storage connections
```

#### **Source Code Review**
- **Open Source Availability** - Source code available for review
- **Transparency** - All functionality visible in code
- **Community Verification** - Independent security reviews welcome

### **Third-Party Audits**

#### **Security Assessments**
- **Professional Audits** - Available for enterprise customers
- **Penetration Testing** - Security testing available
- **Compliance Verification** - Third-party compliance validation
- **Code Review** - Independent code security review

---

## 📜 **Legal Information**

### **Jurisdiction and Governing Law**

This privacy policy is governed by applicable local laws where the extension is used, with emphasis on:
- **Local Privacy Laws** - Compliance with user's local regulations
- **Healthcare Regulations** - HIPAA, HITECH, and similar laws
- **Corporate Policies** - Organizational privacy requirements
- **International Standards** - ISO 27001, SOC 2, and similar frameworks

### **Limitation of Liability**

```
Privacy Liability:
- Extension operates locally only
- No data transmission or storage by developer
- User maintains complete data control
- Standard software license terms apply
- No warranty on data security beyond local browser security
```

---

## 🎯 **Summary**

**Snap Journal is designed to be the most privacy-respecting screenshot annotation tool available:**

### **✅ Privacy Guarantees**
- **Zero Data Collection** - No personal information collected
- **Local-Only Operation** - All data remains on your device
- **No External Communication** - No network requests made
- **Complete User Control** - You own and control all data
- **HIPAA Compatible** - Suitable for healthcare use
- **Enterprise Ready** - Meets corporate privacy requirements

### **🔒 Security Features**
- **Content Security Policy** - Prevents malicious code injection
- **Input Validation** - All data sanitized and validated
- **Secure Storage** - Browser-level encryption and protection
- **Minimal Permissions** - Only essential browser access requested
- **Offline Operation** - No internet connection required

### **👤 User Rights**
- **Data Ownership** - Complete ownership of all screenshots and annotations
- **Export Control** - Export data in multiple formats anytime
- **Deletion Rights** - Permanently delete all data anytime
- **Access Control** - View and manage all stored data
- **Privacy Control** - No external sharing or transmission

---

**Your privacy is our highest priority. Snap Journal operates entirely on your local device, ensuring your sensitive screenshots and annotations never leave your control.** 🔒

*For technical questions, see our [User Manual](../USER_MANUAL.md) or [Troubleshooting Guide](../TROUBLESHOOTING.md).*