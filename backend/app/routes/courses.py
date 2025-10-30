from flask import Blueprint, request, jsonify
from app.models.course import Course
from app import db
from flask_jwt_extended import jwt_required

courses_bp = Blueprint('courses', __name__)

@courses_bp.route('/', methods=['POST'])
@jwt_required()
def create_course():
    data = request.get_json()
    course = Course(
        name=data['name'],
        description=data.get('description'),
        teacher_id=data.get('teacher_id')
    )
    db.session.add(course)
    db.session.commit()
    return jsonify({'msg': 'Course created', 'course': course.to_dict()}), 201

@courses_bp.route('/', methods=['GET'])
@jwt_required()
def get_courses():
    courses = Course.query.all()
    return jsonify([c.to_dict() for c in courses])
