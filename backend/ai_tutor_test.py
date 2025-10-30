import json
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the AI tutoring functions directly
from routes.student_ai_routes import generate_language_lesson

# Test data for quadratic equations
test_data = {
    "language": "English",
    "level": "intermediate", 
    "topic": "quadratic equations",
    "lessonType": "mathematics",
    "studentId": 1
}

print("🎯 AI Tutoring Test - Quadratic Equations")
print("=" * 50)
print("Input:", json.dumps(test_data, indent=2))
print("=" * 50)

# Mock the Flask request
class MockRequest:
    def get_json(self):
        return test_data

# Test the function
try:
    from flask import Flask
    app = Flask(__name__)
    
    with app.app_context():
        # Mock the request object
        import routes.student_ai_routes
        routes.student_ai_routes.request = MockRequest()
        
        result = generate_language_lesson()
        
        if isinstance(result, tuple):
            response_data = result[0].get_json()
            print("\n✅ SUCCESS! AI Tutoring Response:")
            print("=" * 50)
            print(f"Title: {response_data['data']['title']}")
            print(f"Duration: {response_data['data']['duration']}")
            print(f"Language: {response_data['data']['language']}")
            print(f"Level: {response_data['data']['level']}")
            print(f"Topic: {response_data['data']['topic']}")
            print("\n📚 Learning Objectives:")
            for obj in response_data['data']['objectives']:
                print(f"  • {obj}")
            print("\n🎯 Activities:")
            for activity in response_data['data']['activities']:
                print(f"  • {activity['title']} ({activity['duration']})")
            print("\n📝 Homework:")
            for hw in response_data['data']['homework']:
                print(f"  • {hw}")
            print("=" * 50)
            
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
