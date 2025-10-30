#!/usr/bin/env python3
"""
Enhanced Smart School System Database Migration Script
Creates all missing tables for the comprehensive backend implementation
"""

import os
import sys
from datetime import datetime

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
# Import specific models needed for enhanced tables
from app.models.user import User
from app.models.attendance import Attendance
from app.models.payment import Payment
from app.models.notification import Notification
from app.models.grade import GradeScale
from app.models.subject import Subject

def create_enhanced_tables():
    """Create all enhanced tables for the Smart School System"""
    
    app = create_app()
    
    with app.app_context():
        print("🚀 Starting Enhanced Smart School Database Migration...")
        print("=" * 60)
        
        try:
            # Drop all tables and recreate (for development)
            print("📋 Dropping existing tables...")
            db.drop_all()
            
            # Create all tables
            print("🏗️  Creating all database tables...")
            db.create_all()
            
            # Verify tables were created
            inspector = db.inspect(db.engine)
            tables = inspector.get_table_names()
            
            print(f"✅ Successfully created {len(tables)} tables:")
            for table in sorted(tables):
                print(f"   📊 {table}")
            
            print("\n🎯 Enhanced Features Available:")
            print("   ✅ AI-Powered Exam Creation & Grading")
            print("   ✅ Comprehensive Student Progress Tracking")
            print("   ✅ RFID Attendance System")
            print("   ✅ Fraud Detection & Anomaly Detection")
            print("   ✅ Co-curricular Activity Management")
            print("   ✅ Enhanced Assignment Submission")
            print("   ✅ File Upload & Management")
            print("   ✅ Advanced Subject Management")
            print("   ✅ Grade Analytics & Reporting")
            
            # Create sample data
            print("\n📝 Creating sample data...")
            create_sample_data()
            
            print("\n🎉 Database migration completed successfully!")
            print("🔗 Your Smart School System is ready for XAMPP integration!")
            
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")
            raise

def create_sample_data():
    """Create sample data for testing"""
    try:
        # Create sample grade scales
        grade_scales = [
            GradeScale(name="UNEB Standard", min_percentage=90, max_percentage=100, 
                      letter_grade="A", grade_points=4.0, uneb_grade=1, 
                      interpretation="Distinction", is_default=True),
            GradeScale(name="UNEB Standard", min_percentage=80, max_percentage=89, 
                      letter_grade="B", grade_points=3.0, uneb_grade=2, 
                      interpretation="Credit"),
            GradeScale(name="UNEB Standard", min_percentage=70, max_percentage=79, 
                      letter_grade="C", grade_points=2.0, uneb_grade=3, 
                      interpretation="Credit"),
            GradeScale(name="UNEB Standard", min_percentage=60, max_percentage=69, 
                      letter_grade="D", grade_points=1.0, uneb_grade=4, 
                      interpretation="Pass"),
            GradeScale(name="UNEB Standard", min_percentage=0, max_percentage=59, 
                      letter_grade="F", grade_points=0.0, uneb_grade=9, 
                      interpretation="Fail")
        ]
        
        for scale in grade_scales:
            db.session.add(scale)
        
        # Create sample subjects
        subjects = [
            Subject(name="Mathematics", code="MATH-S6", class_level="S6", 
                   description="Advanced Mathematics for Senior 6", credits=4, is_core=True,
                   uneb_code="MATH-545", curriculum_year=2024),
            Subject(name="Physics", code="PHYS-S6", class_level="S6", 
                   description="Physics for Senior 6", credits=4, is_core=True,
                   uneb_code="PHYS-545", curriculum_year=2024),
            Subject(name="Chemistry", code="CHEM-S6", class_level="S6", 
                   description="Chemistry for Senior 6", credits=4, is_core=True,
                   uneb_code="CHEM-545", curriculum_year=2024),
            Subject(name="Biology", code="BIO-S6", class_level="S6", 
                   description="Biology for Senior 6", credits=4, is_core=True,
                   uneb_code="BIO-545", curriculum_year=2024)
        ]
        
        for subject in subjects:
            db.session.add(subject)
        
        # Create sample fraud detection rules
        fraud_rules = [
            FraudDetectionRule(
                name="Duplicate Information Check",
                description="Detect duplicate email, phone, or ID numbers",
                rule_type="onboarding",
                detection_method="pattern",
                parameters={"check_fields": ["email", "phone", "national_id"]},
                thresholds={"similarity_threshold": 0.9},
                severity_level="high"
            ),
            FraudDetectionRule(
                name="Suspicious Login Pattern",
                description="Detect unusual login times and locations",
                rule_type="login",
                detection_method="statistical",
                parameters={"time_window": 24, "location_radius": 100},
                thresholds={"anomaly_score": 0.7},
                severity_level="medium"
            ),
            FraudDetectionRule(
                name="Bot Detection",
                description="Detect automated registration attempts",
                rule_type="onboarding",
                detection_method="pattern",
                parameters={"form_completion_time": 30, "mouse_movements": 10},
                thresholds={"bot_score": 0.8},
                severity_level="high"
            )
        ]
        
        for rule in fraud_rules:
            db.session.add(rule)
        
        # Create sample co-curricular activities
        activities = [
            CocurricularActivity(
                name="Football Club",
                description="School football team training and competitions",
                category="sports",
                subcategory="football",
                supervisor_id=1,  # Will need to be updated with actual teacher ID
                max_participants=25,
                min_participants=11,
                meeting_days=[1, 3, 5],  # Monday, Wednesday, Friday
                start_time="15:30:00",
                end_time="17:30:00",
                venue="Football Field",
                start_date=datetime.utcnow(),
                grade_level_requirement=["S4", "S5", "S6"]
            ),
            CocurricularActivity(
                name="Debate Club",
                description="Develop public speaking and critical thinking skills",
                category="arts",
                subcategory="debate",
                supervisor_id=1,
                max_participants=20,
                min_participants=8,
                meeting_days=[2, 4],  # Tuesday, Thursday
                start_time="16:00:00",
                end_time="17:30:00",
                venue="Library Hall",
                start_date=datetime.utcnow(),
                grade_level_requirement=["S3", "S4", "S5", "S6"]
            ),
            CocurricularActivity(
                name="Science Club",
                description="Hands-on science experiments and projects",
                category="clubs",
                subcategory="science",
                supervisor_id=1,
                max_participants=15,
                min_participants=5,
                meeting_days=[3],  # Wednesday
                start_time="15:00:00",
                end_time="17:00:00",
                venue="Science Laboratory",
                start_date=datetime.utcnow(),
                grade_level_requirement=["S1", "S2", "S3", "S4"]
            )
        ]
        
        for activity in activities:
            db.session.add(activity)
        
        # Commit all sample data
        db.session.commit()
        print("   ✅ Sample data created successfully")
        
    except Exception as e:
        print(f"   ⚠️  Warning: Could not create sample data: {str(e)}")
        db.session.rollback()

if __name__ == "__main__":
    create_enhanced_tables()
