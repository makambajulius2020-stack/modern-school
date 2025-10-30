from app import create_app, db
from app.models import Student

app = create_app()  # create the Flask app instance

with app.app_context():
    db.create_all()
    test_student = Student(name="Test Student", age=16)  # adjust fields
    db.session.add(test_student)
    db.session.commit()

    students = Student.query.all()
    for s in students:
        print(f"Student ID: {s.id}, Name: {s.name}, Age: {s.age}")

    print("✅ Database connection verified, data retrieved successfully!")
