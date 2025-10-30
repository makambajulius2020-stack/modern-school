import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 50)
print("DATABASE CONNECTION TEST")
print("=" * 50)

# Get credentials
host = os.getenv('DB_HOST', 'localhost')
user = os.getenv('DB_USER', 'root')
password = os.getenv('DB_PASSWORD', '')
database = os.getenv('DB_NAME', 'smart_school_db')

print(f"\n📋 Connection Details:")
print(f"Host: {host}")
print(f"User: {user}")
print(f"Password: {'(empty)' if not password else '***'}")
print(f"Database: {database}")

# Test 1: Connect to MySQL (without database)
print("\n🔍 Test 1: Connecting to MySQL server...")
try:
    conn = pymysql.connect(
        host=host,
        user=user,
        password=password,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    print("✅ MySQL server connection successful!")
    
    # Test 2: Check if database exists
    print(f"\n🔍 Test 2: Checking if database '{database}' exists...")
    with conn.cursor() as cursor:
        cursor.execute("SHOW DATABASES")
        databases = [db['Database'] for db in cursor.fetchall()]
        
        if database in databases:
            print(f"✅ Database '{database}' exists!")
        else:
            print(f"❌ Database '{database}' NOT FOUND!")
            print(f"\n📝 Available databases: {', '.join(databases)}")
            print(f"\n💡 To create the database, run:")
            print(f"   mysql -u root -p")
            print(f"   CREATE DATABASE {database};")
            print(f"   USE {database};")
            print(f"   SOURCE database_schema.sql;")
    
    conn.close()
    
except Exception as e:
    print(f"❌ Connection failed: {e}")
    print("\n💡 Troubleshooting:")
    print("1. Make sure XAMPP is running")
    print("2. Start MySQL from XAMPP Control Panel")
    print("3. Check if port 3306 is not blocked")
    exit(1)

# Test 3: Connect to database and test insert
print(f"\n🔍 Test 3: Connecting to database '{database}'...")
try:
    conn = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=database,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    print(f"✅ Connected to database '{database}'!")
    
    # Test 4: Check if tables exist
    print(f"\n🔍 Test 4: Checking tables...")
    with conn.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if tables:
            print(f"✅ Found {len(tables)} tables:")
            for table in tables[:10]:  # Show first 10
                table_name = list(table.values())[0]
                print(f"   - {table_name}")
            if len(tables) > 10:
                print(f"   ... and {len(tables) - 10} more")
        else:
            print("❌ No tables found!")
            print("\n💡 Import the schema:")
            print(f"   cd backend")
            print(f"   mysql -u root -p {database} < database_schema.sql")
    
    # Test 5: Try to insert a test record
    print(f"\n🔍 Test 5: Testing INSERT operation...")
    try:
        with conn.cursor() as cursor:
            # Check if users table exists
            cursor.execute("SHOW TABLES LIKE 'users'")
            if cursor.fetchone():
                # Try to count users
                cursor.execute("SELECT COUNT(*) as count FROM users")
                result = cursor.fetchone()
                print(f"✅ Users table exists with {result['count']} records")
                
                # Test insert (will rollback)
                test_email = f"test_{os.urandom(4).hex()}@test.com"
                cursor.execute(
                    "INSERT INTO users (email, password_hash, role, first_name, last_name) VALUES (%s, %s, %s, %s, %s)",
                    (test_email, 'test_hash', 'student', 'Test', 'User')
                )
                conn.commit()
                print(f"✅ INSERT test successful!")
                
                # Delete test record
                cursor.execute("DELETE FROM users WHERE email = %s", (test_email,))
                conn.commit()
                print(f"✅ DELETE test successful!")
                print(f"\n🎉 Database is working correctly!")
            else:
                print("❌ Users table not found!")
    except Exception as e:
        print(f"❌ INSERT test failed: {e}")
        conn.rollback()
    
    conn.close()
    
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print("\n💡 The database might not exist or schema not imported")

print("\n" + "=" * 50)
print("TEST COMPLETE")
print("=" * 50)
