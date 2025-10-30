"""
Setup script for Online Classes database tables
Run this to create the necessary tables in your MySQL database
"""

import mysql.connector
from mysql.connector import Error

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'smart_school'
}

def create_online_classes_tables():
    """Create tables for online classes feature"""
    try:
        # Connect to database
        connection = mysql.connector.connect(**DB_CONFIG)
        cursor = connection.cursor()
        
        print("Connected to MySQL database")
        
        # Create online_classes table
        create_online_classes_table = """
        CREATE TABLE IF NOT EXISTS online_classes (
            id INT AUTO_INCREMENT PRIMARY KEY,
            teacher_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            subject VARCHAR(100) NOT NULL,
            class_level VARCHAR(10),
            scheduled_time DATETIME NOT NULL,
            duration INT DEFAULT 60,
            description TEXT,
            meeting_link VARCHAR(500),
            status ENUM('scheduled', 'live', 'completed', 'cancelled') DEFAULT 'scheduled',
            started_at DATETIME,
            ended_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_teacher (teacher_id),
            INDEX idx_scheduled_time (scheduled_time),
            INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        
        cursor.execute(create_online_classes_table)
        print("✓ Created online_classes table")
        
        # Create online_class_participants table
        create_participants_table = """
        CREATE TABLE IF NOT EXISTS online_class_participants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            class_id INT NOT NULL,
            student_id INT NOT NULL,
            joined_at DATETIME,
            left_at DATETIME,
            FOREIGN KEY (class_id) REFERENCES online_classes(id) ON DELETE CASCADE,
            UNIQUE KEY unique_participant (class_id, student_id),
            INDEX idx_class (class_id),
            INDEX idx_student (student_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """
        
        cursor.execute(create_participants_table)
        print("✓ Created online_class_participants table")
        
        # Commit changes
        connection.commit()
        print("\n✅ All tables created successfully!")
        print("\nYou can now use the Online Classes feature.")
        
    except Error as e:
        print(f"❌ Error: {e}")
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
            print("\nMySQL connection closed")

if __name__ == "__main__":
    print("=" * 60)
    print("Online Classes Database Setup")
    print("=" * 60)
    print()
    create_online_classes_tables()
