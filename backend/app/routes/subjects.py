from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.subject_service import SubjectService
from app.utils.decorators import role_required

subjects_bp = Blueprint('subjects', __name__)
subject_service = SubjectService()

@subjects_bp.route('/create', methods=['POST'])
@jwt_required()
@role_required(['admin', 'teacher'])
def create_subject():
    """Create a new subject"""
    try:
        current_user_id = get_jwt_identity()
        subject_data = request.get_json()
        
        result = subject_service.create_subject(subject_data, current_user_id)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/assign-to-class', methods=['POST'])
@jwt_required()
@role_required(['admin'])
def assign_subject_to_class():
    """Assign subject to class with teacher"""
    try:
        assignment_data = request.get_json()
        
        result = subject_service.assign_subject_to_class(assignment_data)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/enroll-student', methods=['POST'])
@jwt_required()
@role_required(['admin', 'teacher'])
def enroll_student_in_subject():
    """Enroll student in subject"""
    try:
        enrollment_data = request.get_json()
        
        result = subject_service.enroll_student_in_subject(enrollment_data)
        
        if result['success']:
            return jsonify(result), 201
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/student/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_subjects(student_id):
    """Get subjects for a student"""
    try:
        academic_year = request.args.get('academic_year', '2024')
        term = request.args.get('term', 'Term 1')
        
        subjects = subject_service.get_student_subjects(student_id, academic_year, term)
        
        return jsonify({
            'success': True,
            'subjects': subjects
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/teacher/<int:teacher_id>', methods=['GET'])
@jwt_required()
def get_teacher_subjects(teacher_id):
    """Get subjects taught by teacher"""
    try:
        academic_year = request.args.get('academic_year', '2024')
        term = request.args.get('term', 'Term 1')
        
        subjects = subject_service.get_teacher_subjects(teacher_id, academic_year, term)
        
        return jsonify({
            'success': True,
            'subjects': subjects
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/<int:subject_id>/analytics', methods=['GET'])
@jwt_required()
@role_required(['teacher', 'admin'])
def get_subject_analytics(subject_id):
    """Get subject analytics"""
    try:
        class_id = request.args.get('class_id', type=int)
        
        result = subject_service.get_subject_analytics(subject_id, class_id)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/student/<int:student_id>/subject/<int:subject_id>/progress', methods=['PUT'])
@jwt_required()
def update_subject_progress(student_id, subject_id):
    """Update student progress in subject topics"""
    try:
        topic_progress = request.get_json()
        
        result = subject_service.update_subject_progress(student_id, subject_id, topic_progress)
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@subjects_bp.route('/all', methods=['GET'])
@jwt_required()
def get_all_subjects():
    """Get all subjects"""
    try:
        class_level = request.args.get('class_level')
        department = request.args.get('department')
        
        subjects = subject_service.get_all_subjects(class_level, department)
        
        return jsonify({
            'success': True,
            'subjects': subjects
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
