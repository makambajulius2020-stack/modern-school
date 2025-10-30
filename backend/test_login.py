import requests

# ✅ Update this URL if your Flask runs on a different port
BASE_URL = "http://127.0.0.1:5000"

def test_login():
    url = f"{BASE_URL}/api/auth/login"  # replace with your actual login route
    payload = {
        "username": "testuser",
        "password": "testpass"
    }

    try:
        response = requests.post(url, json=payload)
        print("Status code:", response.status_code)
        print("Response JSON:", response.json())
    except requests.exceptions.ConnectionError:
        print("❌ Unable to connect to the backend. Make sure Flask is running.")
    except Exception as e:
        print("❌ Error:", e)

if __name__ == "__main__":
    test_login()
