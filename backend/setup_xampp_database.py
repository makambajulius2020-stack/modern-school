#!/usr/bin/env python3
"""
Quick XAMPP Database Setup for Smart School System
Simple script to get your database running with XAMPP
"""

import os
import sys
import pymysql
from datetime import datetime

def quick_xampp_setup():
    """Quick setup for XAMPP users"""
    print("🚀 SMART SCHOOL - QUICK XAMPP SETUP")
    print("=" * 50)
    
    try:
        # Step 1: Test XAMPP MySQL connection
        print("1️⃣ Testing XAMPP MySQL connection...")
        connection = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            user='root',
            password='',  # Default XAMPP password is empty
            charset='utf8mb4'
        )
        print("✅ XAMPP MySQL connected!")
        
        # Step 2: Create database
        print("2️⃣ Creating 'school' database...")
        with connection.cursor() as cursor:
            cursor.execute("CREATE DATABASE IF NOT EXISTS school CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            cursor.execute("USE school")
            print("✅ Database 'school' ready!")
        
        connection.close()
        
        # Step 3: Setup Flask app and create tables
        print("3️⃣ Setting up Flask app and creating tables...")
        
        # Add project to path
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        from app import create_app, db
        # Import specific models needed for database creation
        from app.models.user import User
        from app.models.attendance import Attendance
        from app.models.payment import Payment
        from app.models.notification import Notification
        
        app = create_app()
        
        with app.app_context():
            # Create all tables
            db.create_all()
            
            # Count tables
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"✅ Created {len(tables)} tables successfully!")
            
            # Create admin user if doesn't exist
            from werkzeug.security import generate_password_hash
            
            admin = User.query.filter_by(email='admin@school.com').first()
            if not admin:
                admin = User(
                    email='admin@school.com',
                    password_hash=generate_password_hash('admin123'),
                    full_name='System Administrator',
                    role='admin',
                    phone='+256700000001',
                    is_active=True
                )
                db.session.add(admin)
                db.session.commit()
                print("✅ Admin user created!")
            else:
                print("✅ Admin user already exists!")
        
        print("\n🎉 SETUP COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print("🔑 Login Credentials:")
        print("   Email: admin@school.com")
        print("   Password: admin123")
        print("\n🚀 Next Steps:")
        print("   1. Start backend: python run.py")
        print("   2. Start frontend: npm start")
        print("   3. Open: http://localhost:3000")
        
        return True
        
    except Exception as e:
        print(f"❌ Setup failed: {str(e)}")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure XAMPP is running")
        print("2. Start MySQL in XAMPP Control Panel")
        print("3. Check if port 3306 is free")
        return False

if __name__ == "__main__":
    quick_xampp_setup()
