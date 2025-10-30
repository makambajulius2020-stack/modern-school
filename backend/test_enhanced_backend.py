#!/usr/bin/env python3
"""
Test script for the enhanced Smart School backend
Tests all payment API endpoints and functionality
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
TEST_USER = {
    'email': 'student1@school.com',
    'password': 'student123'
}

class BackendTester:
    def __init__(self):
        self.token = None
        self.session = requests.Session()
        
    def login(self):
        """Login and get JWT token"""
        print("🔐 Testing Login...")
        
        response = self.session.post(f"{BASE_URL}/api/auth/login", json=TEST_USER)
        
        if response.status_code == 200:
            data = response.json()
            if 'access_token' in data:
                self.token = data['access_token']
                self.session.headers.update({'Authorization': f'Bearer {self.token}'})
                print("✅ Login successful")
                return True
            else:
                print(f"❌ No access token in response: {data}")
                return False
        else:
            print(f"❌ Login failed: {response.status_code} - {response.text}")
            return False
    
    def test_health_check(self):
        """Test health check endpoint"""
        print("\n🏥 Testing Health Check...")
        
        response = self.session.get(f"{BASE_URL}/api/health")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {data.get('status')}")
            print(f"   Database: {data.get('database')}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    
    def test_payment_history(self):
        """Test enhanced payment history endpoint"""
        print("\n📊 Testing Payment History...")
        
        # Test basic history
        response = self.session.get(f"{BASE_URL}/api/payments/history")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                payments = data.get('payments', [])
                analytics = data.get('analytics', {})
                print(f"✅ Payment history retrieved: {len(payments)} payments")
                print(f"   Total Paid: UGX {analytics.get('total_paid', 0):,}")
                print(f"   Success Rate: {analytics.get('success_rate', 0)}%")
                
                # Test with filters
                print("\n🔍 Testing Filters...")
                
                # Test status filter
                response = self.session.get(f"{BASE_URL}/api/payments/history?status=completed")
                if response.status_code == 200:
                    data = response.json()
                    completed_payments = len(data.get('payments', []))
                    print(f"   ✅ Status filter: {completed_payments} completed payments")
                
                # Test method filter
                response = self.session.get(f"{BASE_URL}/api/payments/history?method=mtn")
                if response.status_code == 200:
                    data = response.json()
                    mtn_payments = len(data.get('payments', []))
                    print(f"   ✅ Method filter: {mtn_payments} MTN payments")
                
                # Test search
                response = self.session.get(f"{BASE_URL}/api/payments/history?search=Tuition")
                if response.status_code == 200:
                    data = response.json()
                    search_results = len(data.get('payments', []))
                    print(f"   ✅ Search filter: {search_results} tuition payments")
                
                return True
            else:
                print(f"❌ Payment history failed: {data.get('message')}")
                return False
        else:
            print(f"❌ Payment history failed: {response.status_code} - {response.text}")
            return False
    
    def test_payment_analytics(self):
        """Test payment analytics endpoint"""
        print("\n📈 Testing Payment Analytics...")
        
        response = self.session.get(f"{BASE_URL}/api/payments/analytics")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                analytics = data.get('analytics', {})
                print("✅ Payment analytics retrieved")
                print(f"   Total Spent: UGX {analytics.get('total_spent', 0):,}")
                print(f"   Average Payment: UGX {analytics.get('average_payment', 0):,}")
                print(f"   Preferred Method: {analytics.get('preferred_method', 'None')}")
                print(f"   Success Rate: {analytics.get('success_rate', 0)}%")
                print(f"   Total Transactions: {analytics.get('total_transactions', 0)}")
                return True
            else:
                print(f"❌ Analytics failed: {data.get('message')}")
                return False
        else:
            print(f"❌ Analytics failed: {response.status_code} - {response.text}")
            return False
    
    def test_payment_summary(self):
        """Test payment summary endpoint"""
        print("\n📋 Testing Payment Summary...")
        
        response = self.session.get(f"{BASE_URL}/api/payments/summary")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                summary = data.get('summary', {})
                print("✅ Payment summary retrieved")
                print(f"   Total Payments: {summary.get('total_payments', 0)}")
                print(f"   Completed Payments: {summary.get('completed_payments', 0)}")
                print(f"   Pending Payments: {summary.get('pending_payments', 0)}")
                print(f"   Total Amount Paid: UGX {summary.get('total_amount_paid', 0):,}")
                
                fee_breakdown = summary.get('fee_breakdown', {})
                if fee_breakdown:
                    print("   Fee Breakdown:")
                    for fee_type, amount in fee_breakdown.items():
                        print(f"     {fee_type}: UGX {amount:,}")
                
                return True
            else:
                print(f"❌ Summary failed: {data.get('message')}")
                return False
        else:
            print(f"❌ Summary failed: {response.status_code} - {response.text}")
            return False
    
    def test_payment_methods(self):
        """Test payment methods endpoint"""
        print("\n💳 Testing Payment Methods...")
        
        response = self.session.get(f"{BASE_URL}/api/payments/methods")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                methods = data.get('payment_methods', [])
                print(f"✅ Payment methods retrieved: {len(methods)} methods")
                for method in methods:
                    print(f"   📱 {method.get('name')} - {method.get('fees')} - {method.get('processing_time')}")
                return True
            else:
                print(f"❌ Payment methods failed: {data.get('message')}")
                return False
        else:
            print(f"❌ Payment methods failed: {response.status_code} - {response.text}")
            return False
    
    def test_export_functionality(self):
        """Test export functionality"""
        print("\n📤 Testing Export Functionality...")
        
        # Test CSV export
        response = self.session.get(f"{BASE_URL}/api/payments/export?format=csv")
        
        if response.status_code == 200:
            if response.headers.get('Content-Type') == 'text/csv':
                print("✅ CSV export successful")
                print(f"   Content Length: {len(response.content)} bytes")
                return True
            else:
                print(f"❌ CSV export failed: Wrong content type")
                return False
        else:
            print(f"❌ CSV export failed: {response.status_code} - {response.text}")
            return False
    
    def test_receipt_generation(self):
        """Test receipt generation"""
        print("\n🧾 Testing Receipt Generation...")
        
        # First get a payment ID
        response = self.session.get(f"{BASE_URL}/api/payments/history?limit=1")
        
        if response.status_code == 200:
            data = response.json()
            payments = data.get('payments', [])
            
            if payments:
                payment_id = payments[0]['id']
                
                # Test receipt generation
                response = self.session.get(f"{BASE_URL}/api/payments/receipt/{payment_id}")
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        receipt = data.get('receipt', {})
                        print("✅ Receipt generated successfully")
                        print(f"   Receipt Number: {receipt.get('receipt_number')}")
                        print(f"   Amount: UGX {receipt.get('payment_details', {}).get('amount', 0):,}")
                        print(f"   Status: {receipt.get('payment_details', {}).get('status')}")
                        return True
                    else:
                        print(f"❌ Receipt generation failed: {data.get('message')}")
                        return False
                else:
                    print(f"❌ Receipt generation failed: {response.status_code}")
                    return False
            else:
                print("⚠️ No payments found for receipt test")
                return True
        else:
            print(f"❌ Could not get payments for receipt test: {response.status_code}")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 SMART SCHOOL BACKEND TEST SUITE")
        print("=" * 60)
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Testing: {BASE_URL}")
        print()
        
        tests = [
            self.test_health_check,
            self.login,
            self.test_payment_history,
            self.test_payment_analytics,
            self.test_payment_summary,
            self.test_payment_methods,
            self.test_export_functionality,
            self.test_receipt_generation
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ Test {test.__name__} crashed: {str(e)}")
                failed += 1
        
        print("\n" + "=" * 60)
        print("🎯 TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"📊 Success Rate: {(passed / (passed + failed) * 100):.1f}%")
        
        if failed == 0:
            print("\n🎉 ALL TESTS PASSED! Your backend is ready! 🚀")
        else:
            print(f"\n⚠️ {failed} tests failed. Check the logs above for details.")
        
        return failed == 0

def main():
    """Main function"""
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
