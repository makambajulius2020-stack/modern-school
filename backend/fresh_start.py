#!/usr/bin/env python3
"""
Fresh start for Smart School Backend
"""
import os
import shutil

def clean_start():
    """Clean start the backend"""
    print("🧹 Cleaning up old database...")
    
    # Remove database files
    files_to_remove = [
        'instance/school.db',
        'instance/school.db-journal',
        'school.db',
        'app.db'
    ]
    
    for file_path in files_to_remove:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"✅ Removed {file_path}")
    
    # Remove instance directory
    if os.path.exists('instance'):
        shutil.rmtree('instance')
        print("✅ Removed instance directory")
    
    # Remove __pycache__ directories
    for root, dirs, files in os.walk('.'):
        for dir_name in dirs:
            if dir_name == '__pycache__':
                pycache_path = os.path.join(root, dir_name)
                shutil.rmtree(pycache_path)
                print(f"✅ Removed {pycache_path}")
    
    print("\n🚀 Starting fresh backend...")
    
    # Start simple backend
    os.system('python simple_run.py')

if __name__ == "__main__":
    clean_start()
