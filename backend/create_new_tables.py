from app import create_app, db

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        print("Creating any missing tables (non-destructive)...")
        db.create_all()
        print("Done.")
