"""
Holiday Tests System API
Features: Create tests, multiple attempts, timed/untimed options, subject-based organization
"""

from flask import Blueprint, jsonify, request
from database import db
from datetime import datetime
import json

tests_bp = Blueprint('tests', __name__, url_prefix='/api/tests')

# ============================================
# TEST MANAGEMENT
# ============================================

@tests_bp.route('/', methods=['GET'])
def get_tests():
    """Get all tests with filters"""
    test_type = request.args.get('type')
    class_level = request.args.get('class_level')
    subject_id = request.args.get('subject_id')
    is_published = request.args.get('is_published')
    created_by = request.args.get('created_by')
    
    query = """
    SELECT t.*, u.first_name, u.last_name,
           s.name as subject_name,
           COUNT(DISTINCT ta.id) as total_attempts,
           COUNT(DISTINCT ta.student_id) as unique_students
    FROM tests t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN subjects s ON t.subject_id = s.id
    LEFT JOIN test_attempts ta ON t.id = ta.test_id
    WHERE 1=1
    """
    params = []
    
    if test_type:
        query += " AND t.test_type = %s"
        params.append(test_type)
    if class_level:
        query += " AND t.class_level = %s"
        params.append(class_level)
    if subject_id:
        query += " AND t.subject_id = %s"
        params.append(subject_id)
    if is_published is not None:
        query += " AND t.is_published = %s"
        params.append(1 if is_published == 'true' else 0)
    if created_by:
        query += " AND t.created_by = %s"
        params.append(created_by)
    
    query += " GROUP BY t.id ORDER BY t.created_at DESC"
    
    tests = db.execute_query(query, tuple(params) if params else None)
    return jsonify({'success': True, 'data': tests or [], 'count': len(tests) if tests else 0})

@tests_bp.route('/<int:test_id>', methods=['GET'])
def get_test(test_id):
    """Get detailed test information"""
    query = """
    SELECT t.*, u.first_name, u.last_name, u.email,
           s.name as subject_name, s.code as subject_code
    FROM tests t
    LEFT JOIN users u ON t.created_by = u.id
    LEFT JOIN subjects s ON t.subject_id = s.id
    WHERE t.id = %s
    """
    test = db.execute_query(query, (test_id,))
    
    if not test:
        return jsonify({'success': False, 'message': 'Test not found'}), 404
    
    # Get questions
    questions_query = """
    SELECT tq.*, 
           (SELECT COUNT(*) FROM question_options WHERE question_id = tq.id) as option_count
    FROM test_questions tq
    WHERE tq.test_id = %s
    ORDER BY tq.order_number, tq.id
    """
    questions = db.execute_query(questions_query, (test_id,))
    
    # Get options for each question
    if questions:
        for question in questions:
            options_query = """
            SELECT * FROM question_options 
            WHERE question_id = %s 
            ORDER BY order_number, id
            """
            question['options'] = db.execute_query(options_query, (question['id'],)) or []
    
    return jsonify({
        'success': True,
        'test': test[0],
        'questions': questions or []
    })

@tests_bp.route('/', methods=['POST'])
def create_test():
    """Create new test"""
    data = request.json
    
    query = """
    INSERT INTO tests (
        title, description, subject_id, class_level, created_by,
        test_type, is_timed, duration_minutes, max_attempts,
        passing_score, total_marks, instructions, start_date, end_date,
        is_published, shuffle_questions, show_results
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    
    test_id = db.execute_insert(query, (
        data.get('title'),
        data.get('description'),
        data.get('subject_id'),
        data.get('class_level'),
        data.get('created_by'),
        data.get('test_type', 'holiday'),
        data.get('is_timed', False),
        data.get('duration_minutes'),
        data.get('max_attempts', 1),
        data.get('passing_score'),
        data.get('total_marks'),
        data.get('instructions'),
        data.get('start_date'),
        data.get('end_date'),
        data.get('is_published', False),
        data.get('shuffle_questions', False),
        data.get('show_results', True)
    ))
    
    if test_id:
        return jsonify({'success': True, 'test_id': test_id}), 201
    return jsonify({'success': False, 'message': 'Failed to create test'}), 500

@tests_bp.route('/<int:test_id>', methods=['PUT'])
def update_test(test_id):
    """Update test"""
    data = request.json
    
    query = """
    UPDATE tests SET
        title = %s, description = %s, subject_id = %s, class_level = %s,
        is_timed = %s, duration_minutes = %s, max_attempts = %s,
        passing_score = %s, total_marks = %s, instructions = %s,
        start_date = %s, end_date = %s, is_published = %s,
        shuffle_questions = %s, show_results = %s
    WHERE id = %s
    """
    
    result = db.execute_insert(query, (
        data.get('title'),
        data.get('description'),
        data.get('subject_id'),
        data.get('class_level'),
        data.get('is_timed'),
        data.get('duration_minutes'),
        data.get('max_attempts'),
        data.get('passing_score'),
        data.get('total_marks'),
        data.get('instructions'),
        data.get('start_date'),
        data.get('end_date'),
        data.get('is_published'),
        data.get('shuffle_questions'),
        data.get('show_results'),
        test_id
    ))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

@tests_bp.route('/<int:test_id>', methods=['DELETE'])
def delete_test(test_id):
    """Delete test"""
    query = "DELETE FROM tests WHERE id = %s"
    result = db.execute_insert(query, (test_id,))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Delete failed'}), 500

# ============================================
# QUESTION MANAGEMENT
# ============================================

@tests_bp.route('/<int:test_id>/questions', methods=['POST'])
def add_question(test_id):
    """Add question to test"""
    data = request.json
    
    query = """
    INSERT INTO test_questions (
        test_id, question_text, question_type, marks, order_number, image_url
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    question_id = db.execute_insert(query, (
        test_id,
        data.get('question_text'),
        data.get('question_type', 'multiple_choice'),
        data.get('marks', 1.0),
        data.get('order_number'),
        data.get('image_url')
    ))
    
    if question_id:
        # Add options if provided
        options = data.get('options', [])
        for i, option in enumerate(options):
            option_query = """
            INSERT INTO question_options (question_id, option_text, is_correct, order_number)
            VALUES (%s, %s, %s, %s)
            """
            db.execute_insert(option_query, (
                question_id,
                option.get('option_text'),
                option.get('is_correct', False),
                i + 1
            ))
        
        return jsonify({'success': True, 'question_id': question_id}), 201
    
    return jsonify({'success': False, 'message': 'Failed to add question'}), 500

@tests_bp.route('/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """Update question"""
    data = request.json
    
    query = """
    UPDATE test_questions SET
        question_text = %s, question_type = %s, marks = %s,
        order_number = %s, image_url = %s
    WHERE id = %s
    """
    
    result = db.execute_insert(query, (
        data.get('question_text'),
        data.get('question_type'),
        data.get('marks'),
        data.get('order_number'),
        data.get('image_url'),
        question_id
    ))
    
    if result is not None:
        # Update options if provided
        if 'options' in data:
            # Delete existing options
            db.execute_insert("DELETE FROM question_options WHERE question_id = %s", (question_id,))
            
            # Add new options
            for i, option in enumerate(data['options']):
                option_query = """
                INSERT INTO question_options (question_id, option_text, is_correct, order_number)
                VALUES (%s, %s, %s, %s)
                """
                db.execute_insert(option_query, (
                    question_id,
                    option.get('option_text'),
                    option.get('is_correct', False),
                    i + 1
                ))
        
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

@tests_bp.route('/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """Delete question"""
    query = "DELETE FROM test_questions WHERE id = %s"
    result = db.execute_insert(query, (question_id,))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Delete failed'}), 500

# ============================================
# TEST ATTEMPTS (STUDENT TAKING TESTS)
# ============================================

@tests_bp.route('/<int:test_id>/start', methods=['POST'])
def start_test_attempt(test_id):
    """Start a new test attempt"""
    data = request.json
    student_id = data.get('student_id')
    
    # Check if test exists and is published
    test_query = "SELECT * FROM tests WHERE id = %s AND is_published = TRUE"
    test = db.execute_query(test_query, (test_id,))
    
    if not test:
        return jsonify({'success': False, 'message': 'Test not found or not published'}), 404
    
    test = test[0]
    
    # Check date range
    now = datetime.now()
    if test['start_date'] and datetime.fromisoformat(str(test['start_date'])) > now:
        return jsonify({'success': False, 'message': 'Test has not started yet'}), 400
    if test['end_date'] and datetime.fromisoformat(str(test['end_date'])) < now:
        return jsonify({'success': False, 'message': 'Test has ended'}), 400
    
    # Check attempt count
    attempts_query = """
    SELECT COUNT(*) as attempt_count 
    FROM test_attempts 
    WHERE test_id = %s AND student_id = %s
    """
    attempts = db.execute_query(attempts_query, (test_id, student_id))
    
    if attempts and attempts[0]['attempt_count'] >= test['max_attempts']:
        return jsonify({'success': False, 'message': 'Maximum attempts reached'}), 400
    
    # Get next attempt number
    attempt_number = attempts[0]['attempt_count'] + 1 if attempts else 1
    
    # Create attempt
    insert_query = """
    INSERT INTO test_attempts (
        test_id, student_id, attempt_number, started_at, status, ip_address
    ) VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    attempt_id = db.execute_insert(insert_query, (
        test_id,
        student_id,
        attempt_number,
        datetime.now(),
        'in_progress',
        request.remote_addr
    ))
    
    if attempt_id:
        return jsonify({
            'success': True,
            'attempt_id': attempt_id,
            'attempt_number': attempt_number,
            'duration_minutes': test['duration_minutes'],
            'is_timed': test['is_timed']
        }), 201
    
    return jsonify({'success': False, 'message': 'Failed to start attempt'}), 500

@tests_bp.route('/attempts/<int:attempt_id>/answer', methods=['POST'])
def submit_answer(attempt_id):
    """Submit answer for a question"""
    data = request.json
    
    # Check if answer already exists
    check_query = """
    SELECT id FROM test_answers 
    WHERE attempt_id = %s AND question_id = %s
    """
    existing = db.execute_query(check_query, (attempt_id, data.get('question_id')))
    
    if existing:
        # Update existing answer
        update_query = """
        UPDATE test_answers 
        SET answer_text = %s, selected_option_id = %s, answered_at = %s
        WHERE id = %s
        """
        db.execute_insert(update_query, (
            data.get('answer_text'),
            data.get('selected_option_id'),
            datetime.now(),
            existing[0]['id']
        ))
        return jsonify({'success': True, 'answer_id': existing[0]['id']})
    
    # Insert new answer
    insert_query = """
    INSERT INTO test_answers (
        attempt_id, question_id, answer_text, selected_option_id
    ) VALUES (%s, %s, %s, %s)
    """
    
    answer_id = db.execute_insert(insert_query, (
        attempt_id,
        data.get('question_id'),
        data.get('answer_text'),
        data.get('selected_option_id')
    ))
    
    if answer_id:
        return jsonify({'success': True, 'answer_id': answer_id}), 201
    return jsonify({'success': False, 'message': 'Failed to save answer'}), 500

@tests_bp.route('/attempts/<int:attempt_id>/submit', methods=['POST'])
def submit_test_attempt(attempt_id):
    """Submit and grade test attempt"""
    
    # Get attempt info
    attempt_query = "SELECT * FROM test_attempts WHERE id = %s"
    attempt = db.execute_query(attempt_query, (attempt_id,))
    
    if not attempt:
        return jsonify({'success': False, 'message': 'Attempt not found'}), 404
    
    attempt = attempt[0]
    
    # Calculate time taken
    started_at = attempt['started_at']
    submitted_at = datetime.now()
    time_taken = int((submitted_at - started_at).total_seconds() / 60)
    
    # Grade the test
    total_score = 0
    total_marks = 0
    
    # Get all answers
    answers_query = """
    SELECT ta.*, tq.marks, tq.question_type
    FROM test_answers ta
    JOIN test_questions tq ON ta.question_id = tq.id
    WHERE ta.attempt_id = %s
    """
    answers = db.execute_query(answers_query, (attempt_id,))
    
    if answers:
        for answer in answers:
            total_marks += float(answer['marks'])
            
            # Check if answer is correct (for multiple choice)
            if answer['question_type'] == 'multiple_choice' and answer['selected_option_id']:
                option_query = "SELECT is_correct FROM question_options WHERE id = %s"
                option = db.execute_query(option_query, (answer['selected_option_id'],))
                
                if option and option[0]['is_correct']:
                    marks_awarded = float(answer['marks'])
                    total_score += marks_awarded
                    
                    # Update answer
                    update_answer_query = """
                    UPDATE test_answers 
                    SET is_correct = TRUE, marks_awarded = %s
                    WHERE id = %s
                    """
                    db.execute_insert(update_answer_query, (marks_awarded, answer['id']))
                else:
                    update_answer_query = """
                    UPDATE test_answers 
                    SET is_correct = FALSE, marks_awarded = 0
                    WHERE id = %s
                    """
                    db.execute_insert(update_answer_query, (answer['id'],))
    
    # Calculate percentage
    percentage = (total_score / total_marks * 100) if total_marks > 0 else 0
    
    # Update attempt
    update_query = """
    UPDATE test_attempts 
    SET submitted_at = %s, time_taken_minutes = %s, score = %s, 
        percentage = %s, status = 'graded'
    WHERE id = %s
    """
    
    db.execute_insert(update_query, (
        submitted_at,
        time_taken,
        total_score,
        percentage,
        attempt_id
    ))
    
    return jsonify({
        'success': True,
        'score': total_score,
        'total_marks': total_marks,
        'percentage': round(percentage, 2),
        'time_taken_minutes': time_taken
    })

@tests_bp.route('/attempts/<int:attempt_id>', methods=['GET'])
def get_attempt_details(attempt_id):
    """Get detailed attempt results"""
    
    # Get attempt
    attempt_query = """
    SELECT ta.*, t.title, t.show_results, t.total_marks,
           u.first_name, u.last_name
    FROM test_attempts ta
    JOIN tests t ON ta.test_id = t.id
    JOIN users u ON ta.student_id = u.id
    WHERE ta.id = %s
    """
    attempt = db.execute_query(attempt_query, (attempt_id,))
    
    if not attempt:
        return jsonify({'success': False, 'message': 'Attempt not found'}), 404
    
    # Get answers with questions
    answers_query = """
    SELECT ta.*, tq.question_text, tq.question_type, tq.marks as question_marks,
           qo.option_text as selected_option_text, qo.is_correct as option_is_correct
    FROM test_answers ta
    JOIN test_questions tq ON ta.question_id = tq.id
    LEFT JOIN question_options qo ON ta.selected_option_id = qo.id
    WHERE ta.attempt_id = %s
    ORDER BY tq.order_number
    """
    answers = db.execute_query(answers_query, (attempt_id,))
    
    return jsonify({
        'success': True,
        'attempt': attempt[0],
        'answers': answers or []
    })

@tests_bp.route('/student/<int:student_id>/attempts', methods=['GET'])
def get_student_attempts(student_id):
    """Get all attempts by a student"""
    query = """
    SELECT ta.*, t.title, t.test_type, t.total_marks,
           s.name as subject_name
    FROM test_attempts ta
    JOIN tests t ON ta.test_id = t.id
    LEFT JOIN subjects s ON t.subject_id = s.id
    WHERE ta.student_id = %s
    ORDER BY ta.started_at DESC
    """
    
    attempts = db.execute_query(query, (student_id,))
    return jsonify({'success': True, 'data': attempts or [], 'count': len(attempts) if attempts else 0})

@tests_bp.route('/<int:test_id>/results', methods=['GET'])
def get_test_results(test_id):
    """Get all results for a test (for teachers)"""
    query = """
    SELECT ta.*, u.first_name, u.last_name, u.email,
           sp.admission_number, sp.class_level
    FROM test_attempts ta
    JOIN users u ON ta.student_id = u.id
    LEFT JOIN student_profiles sp ON u.id = sp.user_id
    WHERE ta.test_id = %s AND ta.status = 'graded'
    ORDER BY ta.percentage DESC, ta.submitted_at
    """
    
    results = db.execute_query(query, (test_id,))
    
    # Calculate statistics
    if results:
        scores = [float(r['percentage']) for r in results if r['percentage'] is not None]
        stats = {
            'total_attempts': len(results),
            'average_score': sum(scores) / len(scores) if scores else 0,
            'highest_score': max(scores) if scores else 0,
            'lowest_score': min(scores) if scores else 0
        }
    else:
        stats = {}
    
    return jsonify({
        'success': True,
        'results': results or [],
        'statistics': stats
    })
