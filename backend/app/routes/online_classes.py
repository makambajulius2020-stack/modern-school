from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app import db
from app.models.online_class import OnlineClass, OnlineClassParticipant
from app.models.user import User

online_classes_bp = Blueprint('online_classes', __name__)

@online_classes_bp.route('/teacher', methods=['GET'])
@jwt_required()
def get_teacher_classes():
    """Get all online classes for a teacher"""
    try:
        current_user_id = get_jwt_identity()
        
        classes = OnlineClass.query.filter_by(teacher_id=current_user_id).order_by(
            OnlineClass.scheduled_time.desc()
        ).all()
        
        return jsonify({
            'success': True,
            'classes': [cls.to_dict() for cls in classes]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@online_classes_bp.route('/student', methods=['GET'])
@jwt_required()
def get_student_classes():
    """Get all online classes for a student"""
    try:
        current_user_id = get_jwt_identity()
        
        # Get classes where student is a participant
        participations = OnlineClassParticipant.query.filter_by(
            student_id=current_user_id
        ).all()
        
        classes = []
        for participation in participations:
            cls = participation.online_class
            class_dict = cls.to_dict()
            class_dict['teacher_name'] = cls.teacher.name if cls.teacher else 'Unknown'
            classes.append(class_dict)
        
        return jsonify({
            'success': True,
            'classes': classes
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@online_classes_bp.route('/create', methods=['POST'])
@jwt_required()
def create_class():
    """Create a new online class"""
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        # Validate required fields
        if not data.get('title') or not data.get('subject') or not data.get('scheduled_time'):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # Create new online class
        new_class = OnlineClass(
            teacher_id=current_user_id,
            title=data['title'],
            subject=data['subject'],
            class_level=data.get('class_level', ''),
            scheduled_time=datetime.fromisoformat(data['scheduled_time'].replace('Z', '+00:00')),
            duration=data.get('duration', 60),
            description=data.get('description', ''),
            meeting_link=data.get('meeting_link', ''),
            status='scheduled'
        )
        
        db.session.add(new_class)
        db.session.flush()
        
        # Add students from class level if specified
        if data.get('class_level'):
            students = User.query.filter_by(
                role='student',
                class_level=data['class_level']
            ).all()
            
            for student in students:
                participant = OnlineClassParticipant(
                    class_id=new_class.id,
                    student_id=student.id
                )
                db.session.add(participant)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'class_id': new_class.id,
            'message': 'Online class created successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@online_classes_bp.route('/<int:class_id>/start', methods=['POST'])
@jwt_required()
def start_class(class_id):
    """Start an online class session"""
    try:
        current_user_id = get_jwt_identity()
        
        online_class = OnlineClass.query.filter_by(
            id=class_id,
            teacher_id=current_user_id
        ).first()
        
        if not online_class:
            return jsonify({
                'success': False,
                'message': 'Class not found or unauthorized'
            }), 404
        
        online_class.status = 'live'
        online_class.started_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Class started successfully',
            'session': online_class.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@online_classes_bp.route('/<int:class_id>/join', methods=['POST'])
@jwt_required()
def join_class(class_id):
    """Join an online class session"""
    try:
        current_user_id = get_jwt_identity()
        
        # Check if student is enrolled
        participant = OnlineClassParticipant.query.filter_by(
            class_id=class_id,
            student_id=current_user_id
        ).first()
        
        if not participant:
            return jsonify({
                'success': False,
                'message': 'You are not enrolled in this class'
            }), 403
        
        online_class = participant.online_class
        
        if online_class.status != 'live':
            return jsonify({
                'success': False,
                'message': 'Class is not currently live'
            }), 400
        
        participant.joined_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Joined class successfully',
            'session': online_class.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@online_classes_bp.route('/<int:class_id>/end', methods=['POST'])
@jwt_required()
def end_class(class_id):
    """End an online class session"""
    try:
        current_user_id = get_jwt_identity()
        
        online_class = OnlineClass.query.filter_by(
            id=class_id,
            teacher_id=current_user_id
        ).first()
        
        if not online_class:
            return jsonify({
                'success': False,
                'message': 'Class not found or unauthorized'
            }), 404
        
        online_class.status = 'completed'
        online_class.ended_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Class ended successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
