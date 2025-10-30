import sys
import traceback
from sqlalchemy import text, inspect
from sqlalchemy.exc import SQLAlchemyError
from app import create_app, db

app = create_app()

def check_database_connection():
    print("🔍 Checking database connection...")
    try:
        with app.app_context():
            db.session.execute(text('SELECT 1'))
        print("✅ Database connection OK\n")
        return True
    except SQLAlchemyError as e:
        print(f"❌ Database connection failed: {e}\n")
        return False

def check_tables():
    print("🔍 Checking tables...")
    with app.app_context():
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        errors = 0
        for cls in db.Model.registry.mappers:
            table_name = cls.local_table.name
            if table_name in tables:
                print(f"✅ Table '{table_name}' is accessible")
            else:
                print(f"❌ Table '{table_name}' error: Table does not exist")
                errors += 1
    print(f"\n✅ {len(tables)} tables found, {errors} missing\n")
    return errors == 0

def check_relationships():
    print("🔍 Checking relationships...")
    with app.app_context():
        for mapper in db.Model.registry.mappers:
            cls = mapper.class_
            cls_name = cls.__name__
            print(f"\n🔹 Checking class '{cls_name}'")
            if not mapper.relationships:
                print("   ⚠️ No relationships defined")
            for rel in mapper.relationships:
                try:
                    target_cls = rel.mapper.class_.__name__
                    print(f"   ✅ Relationship '{rel.key}' -> '{target_cls}' mapped correctly")
                except Exception as e:
                    print(f"   ❌ Relationship '{rel.key}' error: {e}")
                    traceback.print_exc()

if __name__ == "__main__":
    if check_database_connection():
        check_tables()
        check_relationships()
    else:
        print("⚠️ Skipping table and relationship checks due to DB connection failure")
