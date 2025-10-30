from flask import Blueprint, jsonify, request
from database import db
from datetime import datetime
import json

subject_ai_bp = Blueprint('subject_ai', __name__, url_prefix='/api/subject-ai')

# Import data from separate file
from subject_data import O_LEVEL_SUBJECTS, A_LEVEL_COMBINATIONS, CAREER_PATHS

@subject_ai_bp.route('/o-level/subjects', methods=['GET'])
def get_o_level_subjects():
    return jsonify({'success': True, 'subjects': O_LEVEL_SUBJECTS})

@subject_ai_bp.route('/o-level/analyze', methods=['POST'])
def analyze_o_level():
    data = request.json
    student_id = data.get('student_id')
    current_grades = data.get('current_grades', {})
    interests = data.get('interests', [])
    career_goals = data.get('career_goals', [])
    
    recommendations = {
        'recommended': [],
        'alternative': [],
        'warnings': []
    }
    
    return jsonify({'success': True, 'recommendations': recommendations})

@subject_ai_bp.route('/a-level/combinations', methods=['GET'])
def get_a_level_combinations():
    return jsonify({'success': True, 'combinations': A_LEVEL_COMBINATIONS})

@subject_ai_bp.route('/a-level/analyze', methods=['POST'])
def analyze_a_level():
    data = request.json
    student_id = data.get('student_id')
    o_level_results = data.get('o_level_results', {})
    career_interests = data.get('career_interests', [])
    financial_status = data.get('financial_status', 'medium')
    
    recommendations = {
        'top_combinations': [],
        'career_paths': [],
        'university_info': [],
        'financial_advice': {}
    }
    
    return jsonify({'success': True, 'recommendations': recommendations})
