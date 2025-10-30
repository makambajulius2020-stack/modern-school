#!/usr/bin/env python3
"""
Smart School System - n8n Integration Setup Script

This script helps set up and test the n8n workflow automation integration
for the Smart School System.
"""

import os
import sys
import json
import requests
import time
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class N8NSetupManager:
    """Manager for setting up n8n integration"""
    
    def __init__(self):
        self.n8n_base_url = os.getenv('N8N_BASE_URL', 'http://localhost:5678')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.school_api_url = os.getenv('SCHOOL_API_BASE_URL', 'http://localhost:5000')
        self.workflow_dir = os.path.join(os.path.dirname(__file__), 'n8n_workflows')
        
    def check_n8n_connection(self):
        """Check if n8n is running and accessible"""
        try:
            response = requests.get(f"{self.n8n_base_url}/healthz", timeout=5)
            if response.status_code == 200:
                print("✅ n8n is running and accessible")
                return True
            else:
                print(f"❌ n8n responded with status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Cannot connect to n8n: {str(e)}")
            print(f"   Make sure n8n is running at {self.n8n_base_url}")
            return False
    
    def check_school_api_connection(self):
        """Check if Smart School API is running"""
        try:
            response = requests.get(f"{self.school_api_url}/api/health", timeout=5)
            if response.status_code == 200:
                print("✅ Smart School API is running and accessible")
                return True
            else:
                print(f"❌ Smart School API responded with status code: {response.status_code}")
                return False
        except requests.exceptions.RequestException as e:
            print(f"❌ Cannot connect to Smart School API: {str(e)}")
            print(f"   Make sure the backend is running at {self.school_api_url}")
            return False
    
    def list_workflow_templates(self):
        """List available workflow templates"""
        if not os.path.exists(self.workflow_dir):
            print(f"❌ Workflow directory not found: {self.workflow_dir}")
            return []
        
        templates = []
        for file in os.listdir(self.workflow_dir):
            if file.endswith('.json') and file != 'README.md':
                templates.append(file)
        
        print(f"📋 Found {len(templates)} workflow templates:")
        for template in templates:
            print(f"   - {template}")
        
        return templates
    
    def import_workflow(self, template_file):
        """Import a workflow template into n8n"""
        if not self.n8n_api_key:
            print("❌ N8N_API_KEY not configured. Cannot import workflows via API.")
            print("   Please import workflows manually through the n8n web interface.")
            return False
        
        template_path = os.path.join(self.workflow_dir, template_file)
        
        if not os.path.exists(template_path):
            print(f"❌ Template file not found: {template_path}")
            return False
        
        try:
            with open(template_path, 'r') as f:
                workflow_data = json.load(f)
            
            # Import workflow via n8n API
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.post(
                f"{self.n8n_base_url}/api/v1/workflows",
                json=workflow_data,
                headers=headers,
                timeout=10
            )
            
            if response.status_code in [200, 201]:
                print(f"✅ Successfully imported workflow: {template_file}")
                return True
            else:
                print(f"❌ Failed to import workflow {template_file}: {response.status_code}")
                print(f"   Response: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Error importing workflow {template_file}: {str(e)}")
            return False
    
    def test_webhook_endpoint(self, webhook_name, test_data):
        """Test a webhook endpoint"""
        webhook_url = f"{self.n8n_base_url}/webhook/{webhook_name}"
        
        try:
            response = requests.post(
                webhook_url,
                json={
                    'timestamp': datetime.utcnow().isoformat(),
                    'source': 'setup_test',
                    'workflow': webhook_name,
                    'data': test_data
                },
                timeout=10
            )
            
            if response.status_code == 200:
                print(f"✅ Webhook test successful: {webhook_name}")
                return True
            else:
                print(f"❌ Webhook test failed: {webhook_name} (Status: {response.status_code})")
                return False
                
        except Exception as e:
            print(f"❌ Error testing webhook {webhook_name}: {str(e)}")
            return False
    
    def run_integration_tests(self):
        """Run comprehensive integration tests"""
        print("\n🧪 Running n8n Integration Tests...")
        
        test_results = {}
        
        # Test attendance alert webhook
        test_results['attendance_alert'] = self.test_webhook_endpoint('attendance_alert', {
            'student_id': 'test_student_123',
            'student_name': 'Test Student',
            'parent_phone': '+256700000000',
            'parent_email': 'parent@test.com',
            'attendance_status': 'absent',
            'date': datetime.now().date().isoformat(),
            'time': datetime.now().time().isoformat(),
            'class_name': 'Test Class'
        })
        
        # Test payment reminder webhook
        test_results['payment_reminder'] = self.test_webhook_endpoint('payment_reminder', {
            'student_id': 'test_student_123',
            'student_name': 'Test Student',
            'parent_phone': '+256700000000',
            'parent_email': 'parent@test.com',
            'amount': 500000,
            'due_date': '2024-02-01',
            'payment_type': 'School Fees',
            'urgency': 'due_soon'
        })
        
        # Test fraud alert webhook
        test_results['fraud_alert'] = self.test_webhook_endpoint('fraud_alert', {
            'alert_type': 'suspicious_login',
            'user_id': 'test_user_123',
            'user_name': 'Test User',
            'user_role': 'student',
            'suspicious_activity': 'Multiple failed login attempts',
            'risk_score': 0.8,
            'timestamp': datetime.utcnow().isoformat(),
            'ip_address': '192.168.1.100',
            'location': 'Kampala, Uganda'
        })
        
        # Print test summary
        print(f"\n📊 Test Results Summary:")
        passed = sum(1 for result in test_results.values() if result)
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"   {test_name}: {status}")
        
        print(f"\n🎯 Overall: {passed}/{total} tests passed")
        return passed == total
    
    def setup_environment_check(self):
        """Check if all required environment variables are set"""
        print("\n🔧 Checking Environment Configuration...")
        
        required_vars = [
            'N8N_BASE_URL',
            'N8N_WEBHOOK_URL', 
            'N8N_ENABLED',
            'AFRICAS_TALKING_API_KEY',
            'AFRICAS_TALKING_USERNAME',
            'SMTP_SERVER',
            'EMAIL_USERNAME'
        ]
        
        missing_vars = []
        for var in required_vars:
            value = os.getenv(var)
            if value:
                print(f"   ✅ {var}: {'*' * min(len(value), 20)}")
            else:
                print(f"   ❌ {var}: Not set")
                missing_vars.append(var)
        
        if missing_vars:
            print(f"\n⚠️  Missing environment variables: {', '.join(missing_vars)}")
            print("   Please update your .env file with the required values.")
            return False
        else:
            print("\n✅ All required environment variables are configured")
            return True
    
    def generate_setup_report(self):
        """Generate a comprehensive setup report"""
        print("\n" + "="*60)
        print("🎯 SMART SCHOOL N8N INTEGRATION SETUP REPORT")
        print("="*60)
        
        # Check connections
        n8n_ok = self.check_n8n_connection()
        api_ok = self.check_school_api_connection()
        env_ok = self.setup_environment_check()
        
        # List templates
        templates = self.list_workflow_templates()
        
        # Overall status
        print(f"\n📋 Setup Status:")
        print(f"   n8n Connection: {'✅ OK' if n8n_ok else '❌ FAILED'}")
        print(f"   School API: {'✅ OK' if api_ok else '❌ FAILED'}")
        print(f"   Environment: {'✅ OK' if env_ok else '❌ INCOMPLETE'}")
        print(f"   Workflow Templates: {len(templates)} available")
        
        if n8n_ok and api_ok and env_ok:
            print(f"\n🎉 Setup is ready! You can now:")
            print(f"   1. Import workflow templates into n8n")
            print(f"   2. Configure credentials in n8n")
            print(f"   3. Run integration tests")
            print(f"   4. Start using automated workflows")
            
            return True
        else:
            print(f"\n⚠️  Setup incomplete. Please resolve the issues above.")
            return False

def main():
    """Main setup function"""
    print("🚀 Smart School System - n8n Integration Setup")
    print("=" * 50)
    
    setup_manager = N8NSetupManager()
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'check':
            setup_manager.generate_setup_report()
        elif command == 'test':
            if setup_manager.check_n8n_connection():
                setup_manager.run_integration_tests()
            else:
                print("❌ Cannot run tests - n8n is not accessible")
        elif command == 'import':
            if len(sys.argv) > 2:
                template_file = sys.argv[2]
                setup_manager.import_workflow(template_file)
            else:
                templates = setup_manager.list_workflow_templates()
                print("\nUsage: python setup_n8n_integration.py import <template_file>")
                print(f"Available templates: {', '.join(templates)}")
        else:
            print(f"Unknown command: {command}")
            print("Available commands: check, test, import")
    else:
        # Run full setup check by default
        setup_manager.generate_setup_report()

if __name__ == "__main__":
    main()
