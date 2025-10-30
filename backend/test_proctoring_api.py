#!/usr/bin/env python3
"""
Test script for Proctoring API endpoints
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:5000/api/proctoring"

def test_proctoring_endpoints():
    """Test all proctoring API endpoints"""
    
    print("🧪 Testing Proctoring API Endpoints...")
    print("=" * 50)
    
    # Test 1: Get exam sessions
    print("1. Testing GET /sessions...")
    try:
        response = requests.get(f"{BASE_URL}/sessions")
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Success: {data.get('success', False)}")
            print(f"   Sessions found: {len(data.get('data', []))}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"   Connection Error: {str(e)}")
    
    print()
    
    # Test 2: Create a test exam session
    print("2. Testing POST /sessions...")
    try:
        test_session = {
            "title": "Test Mathematics Exam",
            "description": "Test exam for proctoring system",
            "subject_id": 1,
            "class_level": "S6",
            "teacher_id": 1,
            "start_time": "2024-12-20 10:00:00",
            "end_time": "2024-12-20 12:00:00",
            "duration_minutes": 120,
            "proctoring_enabled": True,
            "camera_required": True,
            "mic_required": False,
            "screen_share_required": False
        }
        
        response = requests.post(f"{BASE_URL}/sessions", json=test_session)
        print(f"   Status: {response.status_code}")
        if response.status_code == 201:
            data = response.json()
            print(f"   Success: {data.get('success', False)}")
            session_id = data.get('session_id')
            print(f"   Session ID: {session_id}")
        else:
            print(f"   Error: {response.text}")
            session_id = None
    except Exception as e:
        print(f"   Connection Error: {str(e)}")
        session_id = None
    
    print()
    
    # Test 3: Get dashboard data (if session was created)
    if session_id:
        print(f"3. Testing GET /sessions/{session_id}/dashboard...")
        try:
            response = requests.get(f"{BASE_URL}/sessions/{session_id}/dashboard")
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Success: {data.get('success', False)}")
                stats = data.get('stats', {})
                print(f"   Total students: {stats.get('total_students', 0)}")
                print(f"   Active students: {stats.get('active_students', 0)}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Connection Error: {str(e)}")
        
        print()
        
        # Test 4: Test session control endpoints
        print(f"4. Testing POST /sessions/{session_id}/start...")
        try:
            response = requests.post(f"{BASE_URL}/sessions/{session_id}/start", 
                                   json={"started_by": 1})
            print(f"   Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                print(f"   Success: {data.get('success', False)}")
                print(f"   Message: {data.get('message', '')}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Connection Error: {str(e)}")
        
        print()
        
        # Test 5: Test enhanced features
        print("5. Testing enhanced proctoring features...")
        
        # Test identity verification
        try:
            response = requests.post(f"{BASE_URL}/identity-verification", 
                                   json={"student_id": 1, "session_id": session_id})
            print(f"   Identity Verification Status: {response.status_code}")
        except Exception as e:
            print(f"   Identity Verification Error: {str(e)}")
        
        # Test secure browser
        try:
            response = requests.post(f"{BASE_URL}/secure-browser", 
                                   json={"session_id": session_id, "enabled": True})
            print(f"   Secure Browser Status: {response.status_code}")
        except Exception as e:
            print(f"   Secure Browser Error: {str(e)}")
        
        # Test AI monitoring
        try:
            response = requests.post(f"{BASE_URL}/ai-monitoring", 
                                   json={"session_id": session_id, "enabled": True})
            print(f"   AI Monitoring Status: {response.status_code}")
        except Exception as e:
            print(f"   AI Monitoring Error: {str(e)}")
        
        # Test pre-exam checks
        try:
            response = requests.post(f"{BASE_URL}/pre-exam-checks", 
                                   json={"session_id": session_id})
            print(f"   Pre-exam Checks Status: {response.status_code}")
        except Exception as e:
            print(f"   Pre-exam Checks Error: {str(e)}")
        
        # Test suspicious activity
        try:
            response = requests.get(f"{BASE_URL}/suspicious-activity?session_id={session_id}")
            print(f"   Suspicious Activity Status: {response.status_code}")
        except Exception as e:
            print(f"   Suspicious Activity Error: {str(e)}")
        
        # Test exam report
        try:
            response = requests.get(f"{BASE_URL}/sessions/{session_id}/report")
            print(f"   Exam Report Status: {response.status_code}")
        except Exception as e:
            print(f"   Exam Report Error: {str(e)}")
    
    print()
    print("🎉 Proctoring API testing completed!")
    print("=" * 50)

if __name__ == "__main__":
    test_proctoring_endpoints()

