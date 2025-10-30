import requests
import json

print("=" * 50)
print("API ENDPOINT TEST")
print("=" * 50)

base_url = "http://localhost:5000"

# Test 1: Health check
print("\n🔍 Test 1: Health Check")
try:
    response = requests.get(f"{base_url}/api/health", timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"❌ Failed: {e}")
    print("\n💡 Make sure backend is running:")
    print("   cd backend")
    print("   python real_backend.py")
    exit(1)

# Test 2: Get users
print("\n🔍 Test 2: Get Users")
try:
    response = requests.get(f"{base_url}/api/users", timeout=5)
    data = response.json()
    print(f"Status: {response.status_code}")
    if data.get('success'):
        users = data.get('data', [])
        print(f"✅ Found {len(users)} users:")
        for user in users[:5]:
            print(f"   - {user.get('email')} ({user.get('role')})")
    else:
        print(f"❌ Failed: {data}")
except Exception as e:
    print(f"❌ Failed: {e}")

# Test 3: Test login
print("\n🔍 Test 3: Test Login")
try:
    response = requests.post(
        f"{base_url}/api/auth/login",
        json={"email": "admin@school.com", "password": "admin123"},
        timeout=5
    )
    data = response.json()
    print(f"Status: {response.status_code}")
    if data.get('success'):
        print(f"✅ Login successful!")
        print(f"   User: {data.get('user', {}).get('email')}")
        print(f"   Role: {data.get('user', {}).get('role')}")
    else:
        print(f"❌ Login failed: {data.get('msg')}")
except Exception as e:
    print(f"❌ Failed: {e}")

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)
