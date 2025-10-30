#!/usr/bin/env python3
"""
Complete backend setup script for Smart School System
Sets up database, creates tables, and initializes sample data
"""

import os
import sys
from datetime import datetime

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.user import User
from app.models.payment import Payment, PaymentGatewayConfig
from app.models.notification import Notification
from app.models.attendance import Attendance
from app.models.ai_analytics import AIAnalytics
from app.models.plagiarism_check import PlagiarismCheck
from werkzeug.security import generate_password_hash

def setup_database():
    """Setup database tables"""
    print("🗄️ Setting up database tables...")
    
    try:
        # Create all tables
        db.create_all()
        print("✅ Database tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Error creating database tables: {str(e)}")
        return False

def create_admin_user():
    """Create default admin user"""
    print("👑 Creating admin user...")
    
    try:
        # Check if admin already exists
        admin = User.query.filter_by(email='admin@school.com').first()
        
        if not admin:
            admin = User(
                email='admin@school.com',
                password_hash=generate_password_hash('admin123'),
                full_name='System Administrator',
                role='admin',
                phone='+256700000000',
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.session.add(admin)
            db.session.commit()
            print("✅ Admin user created: admin@school.com / admin123")
        else:
            print("✅ Admin user already exists")
        
        return True
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        return False

def setup_payment_gateways():
    """Setup payment gateway configurations"""
    print("💳 Setting up payment gateways...")
    
    try:
        gateways = [
            {
                'gateway_name': 'mtn_momo',
                'is_active': True,
                'min_amount': 1000,
                'max_amount': 10000000,
                'currency': 'UGX'
            },
            {
                'gateway_name': 'airtel_money',
                'is_active': True,
                'min_amount': 1000,
                'max_amount': 5000000,
                'currency': 'UGX'
            },
            {
                'gateway_name': 'stripe',
                'is_active': True,
                'min_amount': 5000,
                'max_amount': 50000000,
                'currency': 'UGX'
            },
            {
                'gateway_name': 'bank_transfer',
                'is_active': True,
                'min_amount': 10000,
                'max_amount': 100000000,
                'currency': 'UGX'
            }
        ]
        
        for gateway_data in gateways:
            existing = PaymentGatewayConfig.query.filter_by(
                gateway_name=gateway_data['gateway_name']
            ).first()
            
            if not existing:
                gateway = PaymentGatewayConfig(**gateway_data)
                db.session.add(gateway)
        
        db.session.commit()
        print("✅ Payment gateways configured")
        return True
    except Exception as e:
        print(f"❌ Error setting up payment gateways: {str(e)}")
        return False

def create_sample_users():
    """Create sample users for testing"""
    print("👥 Creating sample users...")
    
    try:
        sample_users = [
            {
                'email': 'teacher@school.com',
                'password': 'teacher123',
                'full_name': 'John Teacher',
                'role': 'teacher',
                'phone': '+256700000001'
            },
            {
                'email': 'student@school.com',
                'password': 'student123',
                'full_name': 'Jane Student',
                'role': 'student',
                'phone': '+256700000002'
            },
            {
                'email': 'parent@school.com',
                'password': 'parent123',
                'full_name': 'Bob Parent',
                'role': 'parent',
                'phone': '+256700000003'
            }
        ]
        
        created_count = 0
        for user_data in sample_users:
            existing = User.query.filter_by(email=user_data['email']).first()
            
            if not existing:
                user = User(
                    email=user_data['email'],
                    password_hash=generate_password_hash(user_data['password']),
                    full_name=user_data['full_name'],
                    role=user_data['role'],
                    phone=user_data['phone'],
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.session.add(user)
                created_count += 1
        
        db.session.commit()
        print(f"✅ Created {created_count} sample users")
        
        if created_count > 0:
            print("📧 Sample user accounts:")
            for user_data in sample_users:
                print(f"   {user_data['role'].title()}: {user_data['email']} / {user_data['password']}")
        
        return True
    except Exception as e:
        print(f"❌ Error creating sample users: {str(e)}")
        return False

def verify_backend_setup():
    """Verify that the backend is properly set up"""
    print("🔍 Verifying backend setup...")
    
    try:
        # Check database connection
        user_count = User.query.count()
        payment_count = Payment.query.count()
        gateway_count = PaymentGatewayConfig.query.count()
        
        print(f"✅ Database verification:")
        print(f"   Users: {user_count}")
        print(f"   Payments: {payment_count}")
        print(f"   Payment Gateways: {gateway_count}")
        
        # Check if admin exists
        admin = User.query.filter_by(role='admin').first()
        if admin:
            print(f"   Admin User: {admin.email}")
        
        return True
    except Exception as e:
        print(f"❌ Error verifying backend: {str(e)}")
        return False

def main():
    """Main setup function"""
    print("🚀 SMART SCHOOL BACKEND SETUP")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    app = create_app()
    
    with app.app_context():
        steps = [
            ("Database Tables", setup_database),
            ("Admin User", create_admin_user),
            ("Payment Gateways", setup_payment_gateways),
            ("Sample Users", create_sample_users),
            ("Verification", verify_backend_setup)
        ]
        
        success_count = 0
        
        for step_name, step_function in steps:
            print(f"\n📋 Step: {step_name}")
            print("-" * 30)
            
            try:
                if step_function():
                    success_count += 1
                    print(f"✅ {step_name} completed successfully")
                else:
                    print(f"❌ {step_name} failed")
            except Exception as e:
                print(f"❌ {step_name} crashed: {str(e)}")
        
        print("\n" + "=" * 50)
        print("🎯 SETUP SUMMARY")
        print("=" * 50)
        print(f"✅ Completed: {success_count}/{len(steps)} steps")
        
        if success_count == len(steps):
            print("\n🎉 BACKEND SETUP COMPLETE!")
            print("🚀 Your Smart School backend is ready!")
            print("\n📝 Next Steps:")
            print("1. Start the backend: python run.py")
            print("2. Run tests: python test_enhanced_backend.py")
            print("3. Create sample payments: python create_sample_payments.py")
            print("4. Start the frontend: npm start")
            print("\n🔑 Default Login Credentials:")
            print("   Admin: admin@school.com / admin123")
            print("   Teacher: teacher@school.com / teacher123")
            print("   Student: student@school.com / student123")
            print("   Parent: parent@school.com / parent123")
        else:
            print(f"\n⚠️ Setup incomplete. {len(steps) - success_count} steps failed.")
            print("Check the error messages above and try again.")

if __name__ == "__main__":
    main()
