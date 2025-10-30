from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
import os

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app():
    """Application factory for the Smart School backend."""
    app = Flask(__name__, instance_relative_config=True)

    # ✅ Configuration
    app.config.from_object('config')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY', 'your-secret-key-here')

    # ✅ Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # ✅ Enable CORS for all API routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # ✅ Register blueprints
    from app.routes.analytics import analytics_bp
    from app.routes.fee_structure import fee_structure_bp
    from app.routes.cocurricular import cocurricular_bp
    from app.routes.auth import auth_bp
    from app.routes.enhanced_payments import enhanced_payments_bp
    from app.routes.profile import profile_bp
    from app.routes.notifications import notifications_bp
    from app.routes.messaging import messaging_bp
    from app.routes.library import library_bp
    from app.routes.subjects import subjects_bp
    from content_api import content_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(cocurricular_bp, url_prefix="/api/activities")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(notifications_bp, url_prefix="/api/notifications")
    app.register_blueprint(messaging_bp, url_prefix="/api/messaging")
    app.register_blueprint(library_bp, url_prefix="/api/library")
    app.register_blueprint(subjects_bp, url_prefix="/api/subjects")
    app.register_blueprint(fee_structure_bp, url_prefix="/api")
    app.register_blueprint(enhanced_payments_bp, url_prefix="/api/enhanced-payments")
    app.register_blueprint(content_bp)  # already has '/api/content'

    # ✅ Automatically create database tables (for development only)
    with app.app_context():
        db.create_all()

    # ✅ Default route for sanity check
    @app.route("/api/health")
    def health_check():
        return {"status": "ok", "message": "Backend is running"}

    #  leaderboard endpoint for frontend compatibility
    @app.route("/api/leaderboard", methods=["GET", "OPTIONS"])
    def leaderboard():
        from flask import request, jsonify
        from sqlalchemy import func
        try:
            category = request.args.get("category", "overall")
            class_filter = request.args.get("class", "all")
            limit = request.args.get("limit", type=int) or 10

            from app.models.grade import Grade
            from app.models.user import User
            from app import db

            q = db.session.query(
                Grade.student_id.label("student_id"),
                func.avg(Grade.percentage).label("avg_percentage")
            )
            # Optional filter by class
            if class_filter and class_filter != "all":
                try:
                    class_id = int(class_filter)
                    q = q.filter(Grade.class_id == class_id)
                except ValueError:
                    pass
            q = q.group_by(Grade.student_id).order_by(func.avg(Grade.percentage).desc()).limit(limit)
            rows = q.all()

            # Fetch names
            student_ids = [r.student_id for r in rows]
            users = {u.id: u for u in User.query.filter(User.id.in_(student_ids)).all()} if student_ids else {}

            data = [
                {
                    "student_id": r.student_id,
                    "student_name": users.get(r.student_id).full_name if users.get(r.student_id) else None,
                    "average": float(r.avg_percentage) if r.avg_percentage is not None else 0.0,
                    "category": category,
                }
                for r in rows
            ]
            return jsonify({"success": True, "leaderboard": data, "total": len(data)})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    # Compatibility alias for frontend calling '/api/students/<id>/subjects'
    # Try to reuse the decorated view function from the 'subjects' blueprint; if unavailable, import directly
    try:
        view_func = app.view_functions.get("subjects.get_student_subjects")
        if view_func is None:
            from app.routes.subjects import get_student_subjects as view_func  # decorated function
        app.add_url_rule(
            "/api/students/<int:student_id>/subjects",
            endpoint="subjects.get_student_subjects_alias",
            view_func=view_func,
            methods=["GET", "OPTIONS"],
        )
    except Exception:
        # As a last resort, define a thin wrapper that calls the decorated function
        from flask import request
        from app.routes.subjects import get_student_subjects
        def _subjects_alias(student_id):
            return get_student_subjects(student_id)
        app.add_url_rule(
            "/api/students/<int:student_id>/subjects",
            endpoint="subjects.get_student_subjects_alias",
            view_func=_subjects_alias,
            methods=["GET", "OPTIONS"],
        )

    return app
