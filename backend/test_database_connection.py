#!/usr/bin/env python3
"""
Smart School System - Database Connection Test & Setup
Tests XAMPP/MySQL connection and sets up the database properly
"""

import os
import sys
import pymysql
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_mysql_connection():
    """Test basic MySQL connection to XAMPP"""
    print("🔍 Testing MySQL Connection to XAMPP...")
    print("=" * 50)
    
    try:
        # Connection parameters from .env
        host = '127.0.0.1'
        port = 3306
        user = 'root'
        password = ''  # Default XAMPP MySQL password is empty
        
        print(f"📡 Connecting to MySQL at {host}:{port}")
        print(f"👤 User: {user}")
        print(f"🔑 Password: {'(empty)' if not password else '(set)'}")
        
        # Test connection
        connection = pymysql.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("✅ MySQL connection successful!")
        
        # Test basic query
        with connection.cursor() as cursor:
            cursor.execute("SELECT VERSION() as version")
            result = cursor.fetchone()
            print(f"📊 MySQL Version: {result['version']}")
            
            # Show existing databases
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print(f"🗄️  Available Databases: {[db['Database'] for db in databases]}")
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ MySQL connection failed: {str(e)}")
        print("\n🔧 Troubleshooting Steps:")
        print("1. Make sure XAMPP is running")
        print("2. Start MySQL service in XAMPP Control Panel")
        print("3. Check if port 3306 is available")
        print("4. Verify MySQL is running on localhost")
        return False

def create_school_database():
    """Create the school database if it doesn't exist"""
    print("\n🏗️  Creating School Database...")
    print("=" * 50)
    
    try:
        # Connect without specifying database
        connection = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            # Check if database exists
            cursor.execute("SHOW DATABASES LIKE 'school'")
            result = cursor.fetchone()
            
            if result:
                print("✅ Database 'school' already exists")
            else:
                # Create database
                cursor.execute("""
                    CREATE DATABASE school 
                    CHARACTER SET utf8mb4 
                    COLLATE utf8mb4_unicode_ci
                """)
                print("✅ Database 'school' created successfully")
            
            # Show database info
            cursor.execute("USE school")
            cursor.execute("SELECT DATABASE() as current_db")
            result = cursor.fetchone()
            print(f"📊 Current Database: {result['current_db']}")
            
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Database creation failed: {str(e)}")
        return False

def test_flask_app_connection():
    """Test Flask app database connection"""
    print("\n🌐 Testing Flask App Database Connection...")
    print("=" * 50)
    
    try:
        # Add the project root to Python path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        from app import create_app, db
        
        app = create_app()
        
        with app.app_context():
            # Test database connection
            from sqlalchemy import text
            db.session.execute(text('SELECT 1'))
            print("✅ Flask app database connection successful!")
            
            # Check if tables exist
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            if tables:
                print(f"📊 Found {len(tables)} existing tables:")
                for table in sorted(tables)[:10]:  # Show first 10 tables
                    print(f"   📋 {table}")
                if len(tables) > 10:
                    print(f"   ... and {len(tables) - 10} more tables")
            else:
                print("⚠️  No tables found - need to run migrations")
                
            return True
            
    except Exception as e:
        print(f"❌ Flask app connection failed: {str(e)}")
        print("\n🔧 Possible Solutions:")
        print("1. Check .env DATABASE_URL configuration")
        print("2. Make sure PyMySQL is installed: pip install PyMySQL")
        print("3. Verify database 'school' exists")
        return False

def run_database_migration():
    """Run database migration to create all tables"""
    print("\n🚀 Running Database Migration...")
    print("=" * 50)
    
    try:
        # Add the project root to Python path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        from app import create_app, db
        # Import specific models needed for database creation
        from app.models.user import User
        from app.models.grade import GradeScale
        from app.models.subject import Subject
        from app.models.attendance import Attendance
        from app.models.payment import Payment
        from app.models.notification import Notification
        
        app = create_app()
        
        with app.app_context():
            print("📋 Creating all database tables...")
            
            # Create all tables
            db.create_all()
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            print(f"✅ Successfully created {len(tables)} tables:")
            
            # Categorize tables
            core_tables = []
            enhanced_tables = []
            
            for table in sorted(tables):
                if table in ['users', 'attendance', 'payments', 'notifications']:
                    core_tables.append(table)
                else:
                    enhanced_tables.append(table)
            
            print("\n📊 Core Tables:")
            for table in core_tables:
                print(f"   ✅ {table}")
                
            print("\n🚀 Enhanced Tables:")
            for table in enhanced_tables:
                print(f"   ✅ {table}")
            
            return True
            
    except Exception as e:
        print(f"❌ Migration failed: {str(e)}")
        return False

def create_sample_data():
    """Create sample data for testing"""
    print("\n📝 Creating Sample Data...")
    print("=" * 50)
    
    try:
        # Add the project root to Python path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        from app import create_app, db
        from app.models import User, GradeScale, Subject
        from werkzeug.security import generate_password_hash
        
        app = create_app()
        
        with app.app_context():
            # Check if sample data already exists
            existing_users = User.query.count()
            if existing_users > 0:
                print(f"✅ Sample data already exists ({existing_users} users)")
                return True
            
            # Create sample users
            sample_users = [
                {
                    'email': 'admin@school.com',
                    'password': 'admin123',
                    'full_name': 'System Administrator',
                    'role': 'admin',
                    'phone': '+256700000001'
                },
                {
                    'email': 'teacher@school.com', 
                    'password': 'teacher123',
                    'full_name': 'Dr. Michael Brown',
                    'role': 'teacher',
                    'phone': '+256700000002'
                },
                {
                    'email': 'student@school.com',
                    'password': 'student123', 
                    'full_name': 'Alex Wilson',
                    'role': 'student',
                    'phone': '+256700000003'
                },
                {
                    'email': 'parent@school.com',
                    'password': 'parent123',
                    'full_name': 'Sarah Wilson',
                    'role': 'parent', 
                    'phone': '+256700000004'
                }
            ]
            
            for user_data in sample_users:
                user = User(
                    email=user_data['email'],
                    password_hash=generate_password_hash(user_data['password']),
                    full_name=user_data['full_name'],
                    role=user_data['role'],
                    phone=user_data['phone'],
                    is_active=True
                )
                db.session.add(user)
            
            # Create sample grade scales
            grade_scales = [
                {'name': 'UNEB Standard', 'min_percentage': 90, 'max_percentage': 100, 'letter_grade': 'A', 'grade_points': 4.0},
                {'name': 'UNEB Standard', 'min_percentage': 80, 'max_percentage': 89, 'letter_grade': 'B', 'grade_points': 3.0},
                {'name': 'UNEB Standard', 'min_percentage': 70, 'max_percentage': 79, 'letter_grade': 'C', 'grade_points': 2.0},
                {'name': 'UNEB Standard', 'min_percentage': 60, 'max_percentage': 69, 'letter_grade': 'D', 'grade_points': 1.0},
                {'name': 'UNEB Standard', 'min_percentage': 0, 'max_percentage': 59, 'letter_grade': 'F', 'grade_points': 0.0}
            ]
            
            for scale_data in grade_scales:
                scale = GradeScale(**scale_data)
                db.session.add(scale)
            
            # Create sample subjects
            subjects = [
                {'name': 'Mathematics', 'code': 'MATH-S6', 'class_level': 'S6', 'credits': 4, 'is_core': True},
                {'name': 'Physics', 'code': 'PHYS-S6', 'class_level': 'S6', 'credits': 4, 'is_core': True},
                {'name': 'Chemistry', 'code': 'CHEM-S6', 'class_level': 'S6', 'credits': 4, 'is_core': True},
                {'name': 'Biology', 'code': 'BIO-S6', 'class_level': 'S6', 'credits': 4, 'is_core': True}
            ]
            
            for subject_data in subjects:
                subject = Subject(**subject_data)
                db.session.add(subject)
            
            db.session.commit()
            
            print("✅ Sample data created successfully!")
            print("\n👥 Test User Accounts:")
            print("   🔧 Admin: admin@school.com / admin123")
            print("   👨‍🏫 Teacher: teacher@school.com / teacher123") 
            print("   👨‍🎓 Student: student@school.com / student123")
            print("   👨‍👩‍👧‍👦 Parent: parent@school.com / parent123")
            
            return True
            
    except Exception as e:
        print(f"❌ Sample data creation failed: {str(e)}")
        return False

def main():
    """Main function to run all database tests and setup"""
    print("🎓 SMART SCHOOL SYSTEM - DATABASE SETUP")
    print("=" * 60)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Skipping MySQL checks for local development; use SQLite/app config
    print("ℹ️ Skipping MySQL checks; using SQLite/app config")
    
    # Step 3: Test Flask app connection
    if not test_flask_app_connection():
        print("\n❌ Flask app connection failed")
        return False
    
    # Step 4: Run migrations
    if not run_database_migration():
        print("\n❌ Database migration failed")
        return False
    
    # Step 5: Create sample data
    if not create_sample_data():
        print("\n⚠️  Sample data creation failed, but database is ready")
    
    print("\n🎉 DATABASE SETUP COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print("🚀 Your Smart School System database is ready!")
    print("🌐 You can now start the Flask app: python run.py")
    print("📱 Frontend will connect to: http://localhost:5000")
    print()
    
    return True

if __name__ == "__main__":
    main()
