#!/usr/bin/env python3
"""
Snap Journal Chrome Extension - Edge Compatibility Test Suite
Tests the specific Edge compatibility fixes implemented
Version: 2.0.1 - Edge Compatibility Testing
"""

import json
import os
import re
import sys
from pathlib import Path

class EdgeCompatibilityTester:
    def __init__(self):
        self.extension_path = "/app"
        self.tests_run = 0
        self.tests_passed = 0
        self.issues_found = []
        
    def log_test(self, name, passed, message=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {name}: PASSED")
        else:
            print(f"❌ {name}: FAILED - {message}")
            self.issues_found.append(f"{name}: {message}")
    
    def test_edge_detection_enhancement(self):
        """Test enhanced Edge detection in getBrowserInfo function"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for Edge detection using 'Edg/' pattern
            has_edge_detection = "userAgent.includes('Edg/')" in content
            self.log_test("Edge Detection - Edg/ Pattern", has_edge_detection, 
                         "Missing 'Edg/' detection pattern for Edge browser")
            
            # Check for Edge-specific browser name assignment
            has_edge_name = "browserName = 'Microsoft Edge'" in content
            self.log_test("Edge Browser Name Assignment", has_edge_name,
                         "Missing Microsoft Edge browser name assignment")
            
            # Check for isEdge flag in browser info
            has_edge_flag = "isEdge:" in content and "browserName === 'Microsoft Edge'" in content
            self.log_test("Edge Flag in Browser Info", has_edge_flag,
                         "Missing isEdge flag in getBrowserInfo return object")
            
        except Exception as e:
            self.log_test("Edge Detection Enhancement", False, f"Error: {e}")
    
    def test_edge_optimized_screenshot_capture(self):
        """Test Edge-optimized screenshot capture methods"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for Edge-specific capture attempts
            has_edge_attempts = "edgeAttempts" in content
            self.log_test("Edge Screenshot Attempts Array", has_edge_attempts,
                         "Missing edgeAttempts array for Edge-specific capture methods")
            
            # Check for Edge Attempt 1: Current window without windowId
            attempt1_pattern = r"chrome\.tabs\.captureVisibleTab\(\s*\{\s*format:\s*['\"]png['\"]"
            has_attempt1 = re.search(attempt1_pattern, content) is not None
            self.log_test("Edge Attempt 1 - No WindowId", has_attempt1,
                         "Missing Edge Attempt 1: current window without windowId")
            
            # Check for Edge Attempt 2: Null windowId explicitly
            attempt2_pattern = r"chrome\.tabs\.captureVisibleTab\(null"
            has_attempt2 = re.search(attempt2_pattern, content) is not None
            self.log_test("Edge Attempt 2 - Null WindowId", has_attempt2,
                         "Missing Edge Attempt 2: null windowId explicitly")
            
            # Check for Edge Attempt 3: Lower quality fallback
            has_quality_fallback = "quality: 80" in content or "quality: 90" in content
            self.log_test("Edge Quality Fallback", has_quality_fallback,
                         "Missing lower quality fallback for Edge")
            
            # Check for Edge Attempt 4: Minimal options
            minimal_pattern = r"chrome\.tabs\.captureVisibleTab\(\s*\{\s*format:\s*['\"]png['\"]\s*\}\s*\)"
            has_minimal = re.search(minimal_pattern, content) is not None
            self.log_test("Edge Minimal Options Fallback", has_minimal,
                         "Missing minimal options fallback for Edge")
            
        except Exception as e:
            self.log_test("Edge Screenshot Capture", False, f"Error: {e}")
    
    def test_enhanced_error_handling(self):
        """Test enhanced error handling for Edge"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                bg_content = f.read()
            
            with open(os.path.join(self.extension_path, "popup.js"), 'r') as f:
                popup_content = f.read()
            
            # Check for tab state validation
            has_tab_status_check = "tab.status" in bg_content and "complete" in bg_content
            self.log_test("Tab Status Validation", has_tab_status_check,
                         "Missing tab.status validation for Edge compatibility")
            
            # Check for empty data validation
            has_empty_data_check = "screenshotDataUrl.length" in bg_content
            self.log_test("Empty Data Validation", has_empty_data_check,
                         "Missing empty screenshot data validation")
            
            # Check for Edge-specific fallback methods
            has_edge_fallback = "Edge fallback" in bg_content or "getBrowserInfo().isEdge" in bg_content
            self.log_test("Edge Fallback Methods", has_edge_fallback,
                         "Missing Edge-specific fallback methods")
            
            # Check for better timeout handling (10 seconds for Edge vs 5 for Chrome)
            has_edge_timeout = "10000" in popup_content and "5000" in popup_content
            self.log_test("Edge Extended Timeout", has_edge_timeout,
                         "Missing extended timeout handling for Edge (10s vs 5s)")
            
        except Exception as e:
            self.log_test("Enhanced Error Handling", False, f"Error: {e}")
    
    def test_improved_user_feedback(self):
        """Test improved user feedback for Edge users"""
        try:
            with open(os.path.join(self.extension_path, "popup.js"), 'r') as f:
                content = f.read()
            
            # Check for Edge browser detection in popup
            has_edge_detection = "navigator.userAgent.includes('Edg/')" in content
            self.log_test("Edge Detection in Popup", has_edge_detection,
                         "Missing Edge detection in popup for user feedback")
            
            # Check for Edge-specific loading messages
            has_edge_loading = "Microsoft Edge" in content and "loading" in content.lower()
            self.log_test("Edge Loading Messages", has_edge_loading,
                         "Missing Edge-specific loading messages")
            
            # Check for Edge troubleshooting guidance
            has_edge_troubleshooting = "Edge Troubleshooting" in content or "Edge-specific tips" in content
            self.log_test("Edge Troubleshooting Tips", has_edge_troubleshooting,
                         "Missing Edge-specific troubleshooting guidance")
            
            # Check for browser-specific success messages
            has_browser_success = "browserName" in content and "successful" in content.lower()
            self.log_test("Browser-Specific Success Messages", has_browser_success,
                         "Missing browser-specific success messages")
            
        except Exception as e:
            self.log_test("User Feedback Improvements", False, f"Error: {e}")
    
    def test_robust_storage_fallback(self):
        """Test robust storage fallback system"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for localStorage backup before message passing
            has_storage_backup = "chrome.storage.local.set" in content and "pendingScreenshot" in content
            self.log_test("Storage Backup System", has_storage_backup,
                         "Missing localStorage backup before message passing")
            
            # Check for annotation interface loading from storage
            has_storage_fallback = "storage" in content and "annotation" in content.lower()
            self.log_test("Annotation Storage Fallback", has_storage_fallback,
                         "Missing annotation interface storage fallback")
            
            # Check for longer timeout for Edge (2 seconds vs 1 second)
            has_edge_storage_timeout = "getBrowserInfo().isEdge ? 2000 : 1000" in content
            self.log_test("Edge Storage Timeout", has_edge_storage_timeout,
                         "Missing longer timeout for Edge storage operations")
            
            # Check for cleanup of backup storage on success
            has_storage_cleanup = "chrome.storage.local.remove" in content
            self.log_test("Storage Cleanup on Success", has_storage_cleanup,
                         "Missing cleanup of backup storage on successful message")
            
        except Exception as e:
            self.log_test("Storage Fallback System", False, f"Error: {e}")
    
    def test_cross_browser_compatibility(self):
        """Test that Chrome functionality still works after Edge fixes"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for Chrome detection
            has_chrome_detection = "userAgent.includes('Chrome/')" in content
            self.log_test("Chrome Detection Preserved", has_chrome_detection,
                         "Chrome detection may have been broken by Edge fixes")
            
            # Check for isChrome flag
            has_chrome_flag = "isChrome:" in content
            self.log_test("Chrome Flag Preserved", has_chrome_flag,
                         "Chrome flag missing in browser info")
            
            # Check that standard attempts still exist for Chrome
            has_standard_attempts = "attempts" in content and "edgeAttempts" in content
            self.log_test("Standard Chrome Attempts", has_standard_attempts,
                         "Standard Chrome screenshot attempts may be missing")
            
            # Check for Firefox compatibility (should still be there)
            has_firefox_detection = "userAgent.includes('Firefox/')" in content
            self.log_test("Firefox Compatibility Preserved", has_firefox_detection,
                         "Firefox compatibility may have been affected")
            
        except Exception as e:
            self.log_test("Cross-Browser Compatibility", False, f"Error: {e}")
    
    def test_edge_internal_pages_support(self):
        """Test support for Edge internal pages (edge://)"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for edge:// URL detection
            has_edge_url_detection = "edge://" in content
            self.log_test("Edge Internal URL Detection", has_edge_url_detection,
                         "Missing edge:// URL detection for Edge internal pages")
            
            # Check that edge:// pages are handled like chrome:// pages
            has_edge_handling = ("edge://" in content and "chrome://" in content and 
                               "handleSpecialPageScreenshot" in content)
            self.log_test("Edge Internal Pages Handling", has_edge_handling,
                         "Edge internal pages not handled consistently with Chrome pages")
            
        except Exception as e:
            self.log_test("Edge Internal Pages Support", False, f"Error: {e}")
    
    def test_manifest_edge_compatibility(self):
        """Test manifest.json for Edge compatibility"""
        try:
            with open(os.path.join(self.extension_path, "manifest.json"), 'r') as f:
                manifest = json.load(f)
            
            # Check description mentions Edge compatibility
            description = manifest.get("description", "")
            has_edge_mention = "Edge" in description
            self.log_test("Edge Mentioned in Description", has_edge_mention,
                         "Extension description should mention Edge compatibility")
            
            # Check for universal compatibility claim
            has_universal_claim = "Universal" in description or "Chrome & Edge" in description
            self.log_test("Universal Compatibility Claim", has_universal_claim,
                         "Description should claim universal Chrome & Edge compatibility")
            
            # Check minimum Chrome version (should work with Edge too)
            min_chrome = manifest.get("minimum_chrome_version")
            has_min_version = min_chrome is not None
            self.log_test("Minimum Chrome Version Set", has_min_version,
                         "Minimum Chrome version should be set for Edge compatibility")
            
        except Exception as e:
            self.log_test("Manifest Edge Compatibility", False, f"Error: {e}")
    
    def test_error_message_specificity(self):
        """Test that error messages are specific and helpful for Edge users"""
        try:
            with open(os.path.join(self.extension_path, "popup.js"), 'r') as f:
                content = f.read()
            
            # Check for Edge-specific error messages
            has_edge_errors = "Microsoft Edge" in content and "error" in content.lower()
            self.log_test("Edge-Specific Error Messages", has_edge_errors,
                         "Missing Edge-specific error messages")
            
            # Check for Enhanced Security mode mention
            has_security_mention = "Enhanced Security" in content or "security mode" in content.lower()
            self.log_test("Enhanced Security Mode Mention", has_security_mention,
                         "Should mention Enhanced Security mode in Edge troubleshooting")
            
            # Check for permission guidance
            has_permission_guidance = "permission" in content.lower() and "extension" in content.lower()
            self.log_test("Permission Guidance", has_permission_guidance,
                         "Should provide permission guidance for Edge users")
            
            # Check for page reload suggestion
            has_reload_suggestion = "reload" in content.lower() or "refresh" in content.lower()
            self.log_test("Page Reload Suggestion", has_reload_suggestion,
                         "Should suggest page reload for Edge troubleshooting")
            
        except Exception as e:
            self.log_test("Error Message Specificity", False, f"Error: {e}")
    
    def run_all_tests(self):
        """Run all Edge compatibility tests"""
        print("🔷 Starting Edge Compatibility Test Suite for Snap Journal")
        print("=" * 70)
        
        # Run all Edge-specific tests
        self.test_edge_detection_enhancement()
        self.test_edge_optimized_screenshot_capture()
        self.test_enhanced_error_handling()
        self.test_improved_user_feedback()
        self.test_robust_storage_fallback()
        self.test_cross_browser_compatibility()
        self.test_edge_internal_pages_support()
        self.test_manifest_edge_compatibility()
        self.test_error_message_specificity()
        
        # Print summary
        print("\n" + "=" * 70)
        print(f"📊 EDGE COMPATIBILITY TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.issues_found:
            print(f"\n❌ EDGE COMPATIBILITY ISSUES FOUND:")
            for issue in self.issues_found:
                print(f"  • {issue}")
        else:
            print(f"\n✅ ALL EDGE COMPATIBILITY TESTS PASSED!")
            print(f"🔷 Microsoft Edge compatibility fixes are properly implemented!")
        
        # Provide specific recommendations
        print(f"\n🔷 EDGE TESTING RECOMMENDATIONS:")
        print(f"1. Test screenshot capture on edge://settings/ and edge://history/")
        print(f"2. Test on regular websites like google.com, github.com in Edge")
        print(f"3. Test with different Edge security settings")
        print(f"4. Test with and without Enhanced Security mode")
        print(f"5. Verify error messages are helpful for Edge users")
        print(f"6. Confirm fallback mechanisms work when primary capture fails")
        
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = EdgeCompatibilityTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)