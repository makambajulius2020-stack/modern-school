from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.terms import Term
from app.models.user import User
from app import db
from datetime import datetime

terms_bp = Blueprint('terms', __name__)

@terms_bp.route('/terms', methods=['GET'])
@jwt_required()
def get_terms():
    """Get all academic terms"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role not in ['admin', 'teacher']:
            return jsonify({'error': 'Unauthorized access'}), 403
            
        terms = Term.query.order_by(Term.start_date.desc()).all()
        
        terms_data = []
        for term in terms:
            terms_data.append({
                'id': term.id,
                'name': term.name,
                'start_date': term.start_date.isoformat() if term.start_date else None,
                'end_date': term.end_date.isoformat() if term.end_date else None,
                'status': term.status,
                'total_students': term.total_students,
                'total_fees': float(term.total_fees) if term.total_fees else 0,
                'collected_fees': float(term.collected_fees) if term.collected_fees else 0,
                'subjects': term.subjects.split(',') if term.subjects else [],
                'holidays': term.holidays.split(',') if term.holidays else [],
                'exam_period': term.exam_period,
                'created_at': term.created_at.isoformat() if term.created_at else None
            })
            
        return jsonify({
            'success': True,
            'terms': terms_data,
            'total': len(terms_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@terms_bp.route('/terms', methods=['POST'])
@jwt_required()
def create_term():
    """Create a new academic term"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
            
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'start_date', 'end_date']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Parse dates
        try:
            start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        except ValueError:
            return jsonify({'error': 'Invalid date format'}), 400
            
        # Check for overlapping terms
        existing_term = Term.query.filter(
            Term.start_date <= end_date,
            Term.end_date >= start_date
        ).first()
        
        if existing_term:
            return jsonify({'error': 'Term dates overlap with existing term'}), 400
            
        # Create new term
        term = Term(
            name=data['name'],
            start_date=start_date,
            end_date=end_date,
            status=data.get('status', 'upcoming'),
            total_students=data.get('total_students', 0),
            total_fees=data.get('total_fees', 0),
            collected_fees=0,
            subjects=','.join(data.get('subjects', [])),
            holidays=','.join(data.get('holidays', [])),
            exam_period=data.get('exam_period', ''),
            created_by=current_user_id
        )
        
        db.session.add(term)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Term created successfully',
            'term': {
                'id': term.id,
                'name': term.name,
                'start_date': term.start_date.isoformat(),
                'end_date': term.end_date.isoformat(),
                'status': term.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@terms_bp.route('/terms/<int:term_id>', methods=['PUT'])
@jwt_required()
def update_term(term_id):
    """Update an academic term"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
            
        term = Term.query.get(term_id)
        if not term:
            return jsonify({'error': 'Term not found'}), 404
            
        data = request.get_json()
        
        # Update fields
        if 'name' in data:
            term.name = data['name']
        if 'start_date' in data:
            term.start_date = datetime.fromisoformat(data['start_date'].replace('Z', '+00:00'))
        if 'end_date' in data:
            term.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        if 'status' in data:
            term.status = data['status']
        if 'total_students' in data:
            term.total_students = data['total_students']
        if 'total_fees' in data:
            term.total_fees = data['total_fees']
        if 'subjects' in data:
            term.subjects = ','.join(data['subjects'])
        if 'holidays' in data:
            term.holidays = ','.join(data['holidays'])
        if 'exam_period' in data:
            term.exam_period = data['exam_period']
            
        term.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Term updated successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@terms_bp.route('/terms/<int:term_id>', methods=['DELETE'])
@jwt_required()
def delete_term(term_id):
    """Delete an academic term"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
            
        term = Term.query.get(term_id)
        if not term:
            return jsonify({'error': 'Term not found'}), 404
            
        # Check if term has associated data (payments, etc.)
        # Add checks here if needed
        
        db.session.delete(term)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Term deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@terms_bp.route('/terms/current', methods=['GET'])
@jwt_required()
def get_current_term():
    """Get the current active term"""
    try:
        current_date = datetime.utcnow().date()
        
        current_term = Term.query.filter(
            Term.start_date <= current_date,
            Term.end_date >= current_date,
            Term.status == 'active'
        ).first()
        
        if not current_term:
            return jsonify({'error': 'No active term found'}), 404
            
        return jsonify({
            'success': True,
            'term': {
                'id': current_term.id,
                'name': current_term.name,
                'start_date': current_term.start_date.isoformat(),
                'end_date': current_term.end_date.isoformat(),
                'status': current_term.status,
                'total_students': current_term.total_students,
                'total_fees': float(current_term.total_fees) if current_term.total_fees else 0,
                'collected_fees': float(current_term.collected_fees) if current_term.collected_fees else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@terms_bp.route('/terms/<int:term_id>/financial-summary', methods=['GET'])
@jwt_required()
def get_term_financial_summary(term_id):
    """Get financial summary for a specific term"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or user.role not in ['admin', 'teacher']:
            return jsonify({'error': 'Unauthorized access'}), 403
            
        term = Term.query.get(term_id)
        if not term:
            return jsonify({'error': 'Term not found'}), 404
            
        # Calculate collection rate
        collection_rate = 0
        if term.total_fees and term.total_fees > 0:
            collection_rate = (float(term.collected_fees) / float(term.total_fees)) * 100
            
        outstanding = float(term.total_fees) - float(term.collected_fees) if term.total_fees and term.collected_fees else 0
        
        return jsonify({
            'success': True,
            'summary': {
                'term_name': term.name,
                'total_expected': float(term.total_fees) if term.total_fees else 0,
                'total_collected': float(term.collected_fees) if term.collected_fees else 0,
                'outstanding': outstanding,
                'collection_rate': round(collection_rate, 2),
                'total_students': term.total_students,
                'average_fee_per_student': round(float(term.total_fees) / term.total_students, 2) if term.total_students > 0 and term.total_fees else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
