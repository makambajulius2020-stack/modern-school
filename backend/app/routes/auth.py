from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db
from passlib.hash import pbkdf2_sha256 as sha256
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

def detect_role_from_email(email):
    """Auto-detect user role based on email pattern"""
    if email.endswith('.admin@gmail.com'):
        return 'admin'
    elif email.endswith('.teacher@gmail.com'):
        return 'teacher'
    elif email.endswith('.parent@gmail.com'):
        return 'parent'
    elif email.endswith('.student@gmail.com'):
        return 'student'
    else:
        return 'student'  # Default to student for regular emails

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'User already exists'}), 409
    
    # Auto-detect role from email if not explicitly provided
    role = data.get('role') or detect_role_from_email(email)
    
    user = User(
        name=data['name'],
        email=email,
        role=role,
        password_hash=sha256.hash(data['password'])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg': 'User registered successfully', 'role': role})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and sha256.verify(data['password'], user.password_hash):
        access_token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({'access_token': access_token, 'user': user.to_dict()})
    return jsonify({'msg': 'Invalid credentials'}), 401
