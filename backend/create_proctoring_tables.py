#!/usr/bin/env python3
"""
Proctoring System Database Tables Creation Script
Creates all tables required for the exam proctoring system
"""

import os
import sys
from datetime import datetime

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import db

def create_proctoring_tables():
    """Create all proctoring system tables"""
    
    print("🚀 Creating Proctoring System Database Tables...")
    print("=" * 60)
    
    try:
        # Create exam_sessions table
        print("📋 Creating exam_sessions table...")
        exam_sessions_sql = """
        CREATE TABLE IF NOT EXISTS exam_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            subject_id INT,
            class_level VARCHAR(10),
            teacher_id INT NOT NULL,
            start_time DATETIME NOT NULL,
            end_time DATETIME NOT NULL,
            duration_minutes INT DEFAULT 120,
            status ENUM('scheduled', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'scheduled',
            proctoring_enabled BOOLEAN DEFAULT TRUE,
            camera_required BOOLEAN DEFAULT TRUE,
            mic_required BOOLEAN DEFAULT FALSE,
            screen_share_required BOOLEAN DEFAULT FALSE,
            secure_browser_enabled BOOLEAN DEFAULT FALSE,
            ai_monitoring_enabled BOOLEAN DEFAULT TRUE,
            live_proctoring_enabled BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_teacher_id (teacher_id),
            INDEX idx_status (status),
            INDEX idx_start_time (start_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(exam_sessions_sql)
        print("   ✅ exam_sessions table created")
        
        # Create student_exam_sessions table
        print("📋 Creating student_exam_sessions table...")
        student_exam_sessions_sql = """
        CREATE TABLE IF NOT EXISTS student_exam_sessions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            exam_session_id INT NOT NULL,
            student_id INT NOT NULL,
            joined_at TIMESTAMP NULL,
            left_at TIMESTAMP NULL,
            status ENUM('enrolled', 'in_progress', 'completed', 'abandoned') DEFAULT 'enrolled',
            camera_status ENUM('on', 'off', 'not_available') DEFAULT 'off',
            mic_status ENUM('on', 'off', 'not_available') DEFAULT 'off',
            screen_share_status ENUM('on', 'off', 'not_available') DEFAULT 'off',
            flag_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (exam_session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
            UNIQUE KEY unique_student_session (exam_session_id, student_id),
            INDEX idx_exam_session_id (exam_session_id),
            INDEX idx_student_id (student_id),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(student_exam_sessions_sql)
        print("   ✅ student_exam_sessions table created")
        
        # Create proctoring_flags table
        print("📋 Creating proctoring_flags table...")
        proctoring_flags_sql = """
        CREATE TABLE IF NOT EXISTS proctoring_flags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_exam_session_id INT NOT NULL,
            flag_type VARCHAR(100) NOT NULL,
            severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
            description TEXT,
            screenshot_url VARCHAR(500),
            flagged_by INT,
            resolved BOOLEAN DEFAULT FALSE,
            resolved_by INT NULL,
            resolved_at TIMESTAMP NULL,
            resolution_notes TEXT,
            flagged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_exam_session_id) REFERENCES student_exam_sessions(id) ON DELETE CASCADE,
            INDEX idx_student_session_id (student_exam_session_id),
            INDEX idx_flag_type (flag_type),
            INDEX idx_severity (severity),
            INDEX idx_resolved (resolved),
            INDEX idx_flagged_at (flagged_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(proctoring_flags_sql)
        print("   ✅ proctoring_flags table created")
        
        # Create proctoring_messages table
        print("📋 Creating proctoring_messages table...")
        proctoring_messages_sql = """
        CREATE TABLE IF NOT EXISTS proctoring_messages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            exam_session_id INT NOT NULL,
            sender_id INT NOT NULL,
            recipient_id INT NULL,
            message_type ENUM('chat', 'alert', 'warning', 'instruction') DEFAULT 'chat',
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (exam_session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
            INDEX idx_exam_session_id (exam_session_id),
            INDEX idx_sender_id (sender_id),
            INDEX idx_recipient_id (recipient_id),
            INDEX idx_message_type (message_type),
            INDEX idx_sent_at (sent_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(proctoring_messages_sql)
        print("   ✅ proctoring_messages table created")
        
        # Create proctoring_logs table
        print("📋 Creating proctoring_logs table...")
        proctoring_logs_sql = """
        CREATE TABLE IF NOT EXISTS proctoring_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_exam_session_id INT NULL,
            activity_type VARCHAR(100) NOT NULL,
            activity_data JSON,
            ip_address VARCHAR(45),
            user_agent TEXT,
            logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_exam_session_id) REFERENCES student_exam_sessions(id) ON DELETE CASCADE,
            INDEX idx_student_session_id (student_exam_session_id),
            INDEX idx_activity_type (activity_type),
            INDEX idx_logged_at (logged_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(proctoring_logs_sql)
        print("   ✅ proctoring_logs table created")
        
        # Create admin_notifications table
        print("📋 Creating admin_notifications table...")
        admin_notifications_sql = """
        CREATE TABLE IF NOT EXISTS admin_notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            session_id INT NULL,
            created_by INT NOT NULL,
            priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
            notification_type VARCHAR(50) DEFAULT 'general',
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES exam_sessions(id) ON DELETE CASCADE,
            INDEX idx_session_id (session_id),
            INDEX idx_created_by (created_by),
            INDEX idx_priority (priority),
            INDEX idx_notification_type (notification_type),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(admin_notifications_sql)
        print("   ✅ admin_notifications table created")
        
        # Create automated_grading_results table
        print("📋 Creating automated_grading_results table...")
        automated_grading_results_sql = """
        CREATE TABLE IF NOT EXISTS automated_grading_results (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_exam_session_id INT NOT NULL,
            question_id INT,
            answer_text TEXT,
            ai_score DECIMAL(5,2) NOT NULL,
            ai_feedback TEXT,
            confidence_level DECIMAL(3,2) NOT NULL,
            grading_model VARCHAR(50) DEFAULT 'default',
            processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_exam_session_id) REFERENCES student_exam_sessions(id) ON DELETE CASCADE,
            INDEX idx_student_session_id (student_exam_session_id),
            INDEX idx_question_id (question_id),
            INDEX idx_ai_score (ai_score),
            INDEX idx_processed_at (processed_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        db.execute_query(automated_grading_results_sql)
        print("   ✅ automated_grading_results table created")
        
        print("\n🎉 All proctoring tables created successfully!")
        print("🔗 Proctoring system is ready for use!")
        
        # Create sample exam session for testing
        print("\n📝 Creating sample exam session...")
        create_sample_exam_session()
        
    except Exception as e:
        print(f"❌ Error creating proctoring tables: {str(e)}")
        raise

def create_sample_exam_session():
    """Create a sample exam session for testing"""
    try:
        # Check if sample session already exists
        check_query = "SELECT id FROM exam_sessions WHERE title = 'Sample Mathematics Exam'"
        existing = db.execute_query(check_query)
        
        if not existing:
            # Create sample exam session
            sample_session_sql = """
            INSERT INTO exam_sessions (
                title, description, subject_id, class_level, teacher_id,
                start_time, end_time, duration_minutes, proctoring_enabled,
                camera_required, mic_required, screen_share_required,
                secure_browser_enabled, ai_monitoring_enabled, live_proctoring_enabled
            ) VALUES (
                'Sample Mathematics Exam',
                'End of term mathematics examination for Senior 6 students',
                1, 'S6', 1,
                '2024-12-20 09:00:00', '2024-12-20 11:00:00', 120,
                TRUE, TRUE, FALSE, FALSE, FALSE, TRUE, FALSE
            )
            """
            db.execute_query(sample_session_sql)
            print("   ✅ Sample exam session created")
        else:
            print("   ℹ️  Sample exam session already exists")
            
    except Exception as e:
        print(f"   ⚠️  Warning: Could not create sample exam session: {str(e)}")

if __name__ == "__main__":
    create_proctoring_tables()

