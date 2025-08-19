#!/usr/bin/env python3
"""
Snap Journal Chrome Extension Test Suite
Tests the critical bug fixes and functionality
Version: 2.0.1
"""

import json
import os
import sys
from pathlib import Path

class ExtensionTester:
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
        
    def test_manifest_structure(self):
        """Test manifest.json structure and validity"""
        try:
            manifest_path = os.path.join(self.extension_path, "manifest.json")
            
            if not os.path.exists(manifest_path):
                self.log_test("Manifest Exists", False, "manifest.json not found")
                return
                
            with open(manifest_path, 'r') as f:
                manifest = json.load(f)
            
            # Check required fields
            required_fields = ["manifest_version", "name", "version", "permissions", "background"]
            missing_fields = [field for field in required_fields if field not in manifest]
            
            if missing_fields:
                self.log_test("Manifest Structure", False, f"Missing fields: {missing_fields}")
                return
                
            # Check manifest version
            if manifest.get("manifest_version") != 3:
                self.log_test("Manifest Version", False, f"Expected v3, got v{manifest.get('manifest_version')}")
                return
                
            # Check service worker
            if not manifest.get("background", {}).get("service_worker"):
                self.log_test("Service Worker", False, "No service worker defined")
                return
                
            self.log_test("Manifest Structure", True)
            self.log_test("Manifest Version", True)
            self.log_test("Service Worker", True)
            
        except json.JSONDecodeError as e:
            self.log_test("Manifest JSON", False, f"Invalid JSON: {e}")
        except Exception as e:
            self.log_test("Manifest Structure", False, f"Error: {e}")
    
    def test_file_existence(self):
        """Test that all required files exist"""
        required_files = [
            "manifest.json",
            "background.js", 
            "popup.html",
            "popup.js",
            "popup.css",
            "content.js",
            "annotation-interface.html",
            "annotation-interface.js"
        ]
        
        for file_name in required_files:
            file_path = os.path.join(self.extension_path, file_name)
            exists = os.path.exists(file_path)
            self.log_test(f"File Exists: {file_name}", exists, f"File not found: {file_path}")
    
    def test_javascript_syntax(self):
        """Test JavaScript files for basic syntax issues"""
        js_files = ["background.js", "popup.js", "annotation-interface.js", "content.js"]
        
        for js_file in js_files:
            file_path = os.path.join(self.extension_path, js_file)
            
            if not os.path.exists(file_path):
                self.log_test(f"JS Syntax: {js_file}", False, "File not found")
                continue
                
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Basic syntax checks
                issues = []
                
                # Check for unclosed brackets/braces
                open_braces = content.count('{')
                close_braces = content.count('}')
                if open_braces != close_braces:
                    issues.append(f"Mismatched braces: {open_braces} open, {close_braces} close")
                
                open_brackets = content.count('[')
                close_brackets = content.count(']')
                if open_brackets != close_brackets:
                    issues.append(f"Mismatched brackets: {open_brackets} open, {close_brackets} close")
                
                open_parens = content.count('(')
                close_parens = content.count(')')
                if open_parens != close_parens:
                    issues.append(f"Mismatched parentheses: {open_parens} open, {close_parens} close")
                
                # Check for common syntax errors
                if 'function function' in content:
                    issues.append("Duplicate 'function' keyword found")
                
                if issues:
                    self.log_test(f"JS Syntax: {js_file}", False, "; ".join(issues))
                else:
                    self.log_test(f"JS Syntax: {js_file}", True)
                    
            except Exception as e:
                self.log_test(f"JS Syntax: {js_file}", False, f"Error reading file: {e}")
    
    def test_duplicate_functions_fix(self):
        """Test that duplicate function definitions were fixed in background.js"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for duplicate getBrowserInfo functions
            browser_info_count = content.count('function getBrowserInfo(')
            if browser_info_count > 1:
                self.log_test("Duplicate getBrowserInfo Fix", False, f"Found {browser_info_count} definitions")
            else:
                self.log_test("Duplicate getBrowserInfo Fix", True)
            
            # Check for duplicate generateUniqueId functions  
            unique_id_count = content.count('function generateUniqueId(')
            if unique_id_count > 1:
                self.log_test("Duplicate generateUniqueId Fix", False, f"Found {unique_id_count} definitions")
            else:
                self.log_test("Duplicate generateUniqueId Fix", True)
                
        except Exception as e:
            self.log_test("Duplicate Functions Fix", False, f"Error: {e}")
    
    def test_error_handling_improvements(self):
        """Test that error handling was improved in popup.js"""
        try:
            with open(os.path.join(self.extension_path, "popup.js"), 'r') as f:
                content = f.read()
            
            # Check for null checks
            has_null_checks = 'null' in content and ('!elements' in content or 'elements[' in content)
            self.log_test("Null Checks Added", has_null_checks, "No null checks found in popup.js")
            
            # Check for try-catch blocks
            try_catch_count = content.count('try {')
            if try_catch_count < 3:  # Should have multiple try-catch blocks
                self.log_test("Error Handling", False, f"Only {try_catch_count} try-catch blocks found")
            else:
                self.log_test("Error Handling", True)
                
            # Check for timeout handling
            has_timeout = 'timeout' in content.lower() or 'settimeout' in content.lower()
            self.log_test("Timeout Handling", has_timeout, "No timeout handling found")
            
        except Exception as e:
            self.log_test("Error Handling Test", False, f"Error: {e}")
    
    def test_memory_leak_fixes(self):
        """Test that memory leak fixes were implemented in annotation-interface.js"""
        try:
            with open(os.path.join(self.extension_path, "annotation-interface.js"), 'r') as f:
                content = f.read()
            
            # Check for cleanup function
            has_cleanup = 'cleanupInterface' in content or 'cleanup' in content
            self.log_test("Cleanup Function", has_cleanup, "No cleanup function found")
            
            # Check for event listener tracking
            has_listener_tracking = 'eventListeners' in content and 'removeEventListener' in content
            self.log_test("Event Listener Cleanup", has_listener_tracking, "No event listener cleanup found")
            
            # Check for beforeunload handler
            has_beforeunload = 'beforeunload' in content
            self.log_test("Beforeunload Handler", has_beforeunload, "No beforeunload handler found")
            
            # Check for race condition prevention
            has_race_prevention = 'isInterfaceActive' in content or 'isActive' in content
            self.log_test("Race Condition Prevention", has_race_prevention, "No race condition prevention found")
            
        except Exception as e:
            self.log_test("Memory Leak Fixes", False, f"Error: {e}")
    
    def test_pdf_generation_fix(self):
        """Test that PDF generation was properly implemented"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for PDF generation function
            has_pdf_function = 'generatePDF' in content
            self.log_test("PDF Generation Function", has_pdf_function, "No generatePDF function found")
            
            # Check that it's not just placeholder text
            if has_pdf_function:
                # Look for actual PDF implementation
                has_canvas = 'OffscreenCanvas' in content or 'canvas' in content
                has_pdf_structure = '%PDF' in content
                
                if has_canvas and has_pdf_structure:
                    self.log_test("PDF Implementation", True)
                else:
                    self.log_test("PDF Implementation", False, "PDF generation appears to be placeholder")
            else:
                self.log_test("PDF Implementation", False, "No PDF generation found")
                
        except Exception as e:
            self.log_test("PDF Generation Test", False, f"Error: {e}")
    
    def test_message_handlers(self):
        """Test that missing message handlers were added"""
        try:
            with open(os.path.join(self.extension_path, "background.js"), 'r') as f:
                content = f.read()
            
            # Check for getScreenshot handler
            has_get_screenshot = 'getScreenshot' in content
            self.log_test("getScreenshot Handler", has_get_screenshot, "Missing getScreenshot handler")
            
            # Check for comprehensive message handling
            has_message_listener = 'chrome.runtime.onMessage.addListener' in content
            self.log_test("Message Listener", has_message_listener, "No message listener found")
            
            # Check for proper error responses
            has_error_responses = 'sendResponse({ success: false' in content
            self.log_test("Error Response Handling", has_error_responses, "No error response handling")
            
        except Exception as e:
            self.log_test("Message Handlers Test", False, f"Error: {e}")
    
    def test_class_name_consistency(self):
        """Test that class name consistency issues were fixed"""
        try:
            with open(os.path.join(self.extension_path, "content.js"), 'r') as f:
                content = f.read()
            
            # Check for consistent class naming
            has_consistent_classes = 'snap-journal-marker' in content
            self.log_test("Class Name Consistency", has_consistent_classes, "Inconsistent class names found")
            
        except Exception as e:
            self.log_test("Class Name Test", False, f"Error: {e}")
    
    def run_all_tests(self):
        """Run all tests"""
        print("🚀 Starting Snap Journal Extension Test Suite")
        print("=" * 60)
        
        # Run all tests
        self.test_manifest_structure()
        self.test_file_existence()
        self.test_javascript_syntax()
        self.test_duplicate_functions_fix()
        self.test_error_handling_improvements()
        self.test_memory_leak_fixes()
        self.test_pdf_generation_fix()
        self.test_message_handlers()
        self.test_class_name_consistency()
        
        # Print summary
        print("\n" + "=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {self.tests_run - self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run)*100:.1f}%")
        
        if self.issues_found:
            print(f"\n❌ ISSUES FOUND:")
            for issue in self.issues_found:
                print(f"  • {issue}")
        else:
            print(f"\n✅ ALL TESTS PASSED!")
        
        return self.tests_passed == self.tests_run

if __name__ == "__main__":
    tester = ExtensionTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)