#!/usr/bin/env python3
"""
Quick database reset script
"""
import os
import sys

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def reset_database():
    """Reset the database"""
    try:
        # Remove existing database file if it exists
        db_path = 'instance/school.db'
        if os.path.exists(db_path):
            os.remove(db_path)
            print("✅ Removed existing database")
        
        # Remove instance directory if it exists
        if os.path.exists('instance'):
            import shutil
            shutil.rmtree('instance')
            print("✅ Removed instance directory")
        
        # Create fresh database
        from app import create_app, db
        
        app = create_app()
        with app.app_context():
            # Create all tables
            db.create_all()
            print("✅ Created fresh database tables")
            
            # Create a test user
            from app.models.user import User
            from werkzeug.security import generate_password_hash
            
            admin = User(
                email='admin@school.com',
                password_hash=generate_password_hash('admin123'),
                full_name='System Administrator',
                role='admin',
                phone='+256700000000',
                is_active=True
            )
            
            student = User(
                email='student@school.com',
                password_hash=generate_password_hash('student123'),
                full_name='Test Student',
                role='student',
                phone='+256700000001',
                is_active=True
            )
            
            db.session.add(admin)
            db.session.add(student)
            db.session.commit()
            
            print("✅ Created test users:")
            print("   Admin: admin@school.com / admin123")
            print("   Student: student@school.com / student123")
            
        print("\n🎉 Database reset complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error resetting database: {str(e)}")
        return False

if __name__ == "__main__":
    reset_database()
