from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models.user import User

def role_required(allowed_roles):
    """
    Decorator to check if user has required role
    
    Args:
        allowed_roles: List of allowed roles ['admin', 'teacher', 'student', 'parent']
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                current_user_id = get_jwt_identity()
                user = User.query.get(current_user_id)
                
                if not user:
                    return jsonify({'success': False, 'error': 'User not found'}), 404
                
                if user.role not in allowed_roles:
                    return jsonify({
                        'success': False, 
                        'error': f'Access denied. Required roles: {", ".join(allowed_roles)}'
                    }), 403
                
                return f(*args, **kwargs)
                
            except Exception as e:
                return jsonify({'success': False, 'error': str(e)}), 500
                
        return decorated_function
    return decorator

def admin_required(f):
    """Decorator to require admin role"""
    return role_required(['admin'])(f)

def teacher_required(f):
    """Decorator to require teacher role"""
    return role_required(['teacher', 'admin'])(f)

def student_required(f):
    """Decorator to require student role"""
    return role_required(['student'])(f)

def parent_required(f):
    """Decorator to require parent role"""
    return role_required(['parent'])(f)
