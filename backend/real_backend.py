from flask import Flask, jsonify, request
from flask_cors import CORS
from database import db
import os
import hashlib
from datetime import datetime

# Import all feature blueprints - commented out to avoid import errors
# from proctoring_api import proctoring_bp
# from tests_api import tests_bp
# from content_api import content_bp
# from lessons_api import lessons_bp
# from subject_selection_ai import subject_ai_bp

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "http://localhost:3001",
            "http://localhost:3002",
            "http://127.0.0.1:3001",
            "http://127.0.0.1:3002",
        ],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Register all blueprints
try:
    from proctoring_api import proctoring_bp
    app.register_blueprint(proctoring_bp)
    print("✅ Proctoring API registered")
except ImportError as e:
    print(f"⚠️ Proctoring API not available: {e}")

try:
    from tests_api import tests_bp
    app.register_blueprint(tests_bp)
    print("✅ Tests API registered")
except ImportError as e:
    print(f"⚠️ Tests API not available: {e}")

try:
    from content_api import content_bp
    app.register_blueprint(content_bp)
    print("✅ Content API registered")
except ImportError as e:
    print(f"⚠️ Content API not available: {e}")

try:
    from lessons_api import lessons_bp
    app.register_blueprint(lessons_bp)
    print("✅ Lessons API registered")
except ImportError as e:
    print(f"⚠️ Lessons API not available: {e}")

try:
    from subject_selection_ai import subject_ai_bp
    app.register_blueprint(subject_ai_bp)
    print("✅ Subject AI API registered")
except ImportError as e:
    print(f"⚠️ Subject AI API not available: {e}")

@app.route('/')
def index():
    return {'message': 'Smart School Real Backend', 'status': 'success'}

@app.route('/api/health')
def health():
    db_status = 'connected' if db.connection else 'disconnected'
    return jsonify({
        'status': 'healthy',
        'message': 'Real Backend is working',
        'database': db_status,
        'success': True
    })

# Authentication endpoints
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name', '')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    # Validate required fields
    if not all([email, password, role]):
        return jsonify({'success': False, 'msg': 'Missing required fields (email, password, role)'}), 400
    
    # Validate role
    valid_roles = ['admin', 'teacher', 'student', 'parent']
    if role not in valid_roles:
        return jsonify({'success': False, 'msg': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    
    # Check if user already exists
    existing_user = db.execute_query("SELECT id FROM users WHERE email = %s", (email,))
    if existing_user:
        return jsonify({'success': False, 'msg': 'Email already registered'}), 400
    
    # Hash password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    # Split name into first_name and last_name
    name_parts = name.strip().split(' ', 1)
    first_name = name_parts[0] if name_parts else 'User'
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    # Insert user
    query = """
    INSERT INTO users (email, password_hash, role, first_name, last_name, is_active)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    user_id = db.execute_insert(query, (
        email,
        password_hash,
        role,
        first_name,
        last_name,
        1
    ))
    
    if user_id:
        return jsonify({'success': True, 'msg': 'User registered successfully', 'user_id': user_id}), 201
    else:
        return jsonify({'success': False, 'msg': 'Registration failed'}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'success': False, 'msg': 'Missing email or password'}), 400
    
    # Hash password
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    # Check credentials
    query = "SELECT id, CONCAT(first_name, ' ', last_name) as name, email, role FROM users WHERE email = %s AND password_hash = %s AND is_active = 1"
    user = db.execute_query(query, (email, password_hash))
    
    if not user:
        return jsonify({'success': False, 'msg': 'Invalid credentials'}), 401
    
    user = user[0]
    return jsonify({
        'success': True,
        'msg': 'Login successful',
        'user': user,
        'token': f"token_{user['id']}"  # Simple token for now
    }), 200

# Real User endpoints
@app.route('/api/users')
def get_users():
    users = db.execute_query("SELECT id, name, email, role FROM users LIMIT 20")
    if users is None:
        return jsonify({'success': False, 'message': 'Database connection failed'})
    
    return jsonify({
        'success': True,
        'data': users,
        'count': len(users)
    })

# Real Student endpoints
@app.route('/api/students')
def get_students():
    query = """
    SELECT u.id, u.name, u.email, sp.class_level, sp.stream, sp.admission_number
    FROM users u 
    JOIN student_profiles sp ON u.id = sp.user_id 
    WHERE u.role = 'student'
    LIMIT 50
    """
    students = db.execute_query(query)
    if students is None:
        return jsonify({'success': False, 'message': 'Database query failed'})
    
    return jsonify({
        'success': True,
        'data': students,
        'count': len(students)
    })

# Real Attendance endpoints
@app.route('/api/attendance')
def get_attendance():
    query = """
    SELECT a.*, u.name as student_name, sp.class_level
    FROM attendance a
    JOIN users u ON a.student_id = u.id
    JOIN student_profiles sp ON u.id = sp.user_id
    ORDER BY a.date DESC
    LIMIT 100
    """
    attendance = db.execute_query(query)
    if attendance is None:
        return jsonify({'success': False, 'message': 'Database query failed'})
    
    return jsonify({
        'success': True,
        'data': attendance,
        'count': len(attendance)
    })

# Real Payment endpoints
@app.route('/api/payments')
def get_payments():
    query = """
    SELECT p.*, u.name as student_name, sp.class_level
    FROM payments p
    JOIN users u ON p.student_id = u.id
    JOIN student_profiles sp ON u.id = sp.user_id
    ORDER BY p.payment_date DESC
    LIMIT 100
    """
    payments = db.execute_query(query)
    if payments is None:
        return jsonify({'success': False, 'message': 'Database query failed'})
    
    return jsonify({
        'success': True,
        'data': payments,
        'count': len(payments)
    })

# Real Profile endpoints
@app.route('/api/profile/<int:user_id>')
def get_profile(user_id):
    user_query = "SELECT * FROM users WHERE id = %s"
    user = db.execute_query(user_query, (user_id,))
    
    if not user:
        return jsonify({'success': False, 'message': 'User not found'})
    
    user = user[0]
    
    # Get profile based on role
    profile = None
    if user['role'] == 'student':
        profile_query = "SELECT * FROM student_profiles WHERE user_id = %s"
        profile = db.execute_query(profile_query, (user_id,))
    elif user['role'] == 'teacher':
        profile_query = "SELECT * FROM teacher_profiles WHERE user_id = %s"
        profile = db.execute_query(profile_query, (user_id,))
    elif user['role'] == 'parent':
        profile_query = "SELECT * FROM parent_profiles WHERE user_id = %s"
        profile = db.execute_query(profile_query, (user_id,))
    
    profile = profile[0] if profile else {}
    
    return jsonify({
        'success': True,
        'user': user,
        'profile': profile
    })

# Add new attendance record
@app.route('/api/attendance', methods=['POST'])
def add_attendance():
    data = request.json
    query = """
    INSERT INTO attendance (student_id, date, status, check_in_time, method)
    VALUES (%s, %s, %s, %s, %s)
    """
    
    result = db.execute_insert(query, (
        data.get('student_id'),
        data.get('date'),
        data.get('status'),
        data.get('check_in_time'),
        data.get('method', 'manual')
    ))
    
    if result:
        return jsonify({'success': True, 'id': result})
    else:
        return jsonify({'success': False, 'message': 'Failed to add attendance'})

# Add new payment
@app.route('/api/payments', methods=['POST'])
def add_payment():
    data = request.json
    query = """
    INSERT INTO payments (student_id, amount, currency, method, fee_type, status, payment_date)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    
    result = db.execute_insert(query, (
        data.get('student_id'),
        data.get('amount'),
        data.get('currency', 'UGX'),
        data.get('method'),
        data.get('fee_type'),
        data.get('status', 'pending'),
        data.get('payment_date')
    ))
    
    if result:
        return jsonify({'success': True, 'id': result})
    else:
        return jsonify({'success': False, 'message': 'Failed to add payment'})

# ============================================
# ADMIN PROFILE EDITING
# ============================================

@app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
def admin_update_user(user_id):
    """Admin can edit any user profile"""
    data = request.json
    admin_id = data.get('admin_id')
    
    # Verify admin
    admin_query = "SELECT role FROM users WHERE id = %s"
    admin = db.execute_query(admin_query, (admin_id,))
    if not admin or admin[0]['role'] != 'admin':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    # Update user
    update_fields = []
    params = []
    
    if 'first_name' in data:
        update_fields.append("first_name = %s")
        params.append(data['first_name'])
    if 'last_name' in data:
        update_fields.append("last_name = %s")
        params.append(data['last_name'])
    if 'email' in data:
        update_fields.append("email = %s")
        params.append(data['email'])
    if 'phone' in data:
        update_fields.append("phone = %s")
        params.append(data['phone'])
    if 'address' in data:
        update_fields.append("address = %s")
        params.append(data['address'])
    if 'date_of_birth' in data:
        update_fields.append("date_of_birth = %s")
        params.append(data['date_of_birth'])
    if 'gender' in data:
        update_fields.append("gender = %s")
        params.append(data['gender'])
    if 'profile_photo' in data:
        update_fields.append("profile_photo = %s")
        params.append(data['profile_photo'])
    
    if not update_fields:
        return jsonify({'success': False, 'message': 'No fields to update'})
    
    params.append(user_id)
    query = f"UPDATE users SET {', '.join(update_fields)} WHERE id = %s"
    
    result = db.execute_insert(query, tuple(params))
    if result is not None:
        return jsonify({'success': True, 'message': 'Profile updated successfully'})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

@app.route('/api/admin/users/<int:user_id>/status', methods=['PUT'])
def admin_update_user_status(user_id):
    """Admin can activate/deactivate users"""
    data = request.json
    admin_id = data.get('admin_id')
    is_active = data.get('is_active', True)
    
    # Verify admin
    admin_query = "SELECT role FROM users WHERE id = %s"
    admin = db.execute_query(admin_query, (admin_id,))
    if not admin or admin[0]['role'] != 'admin':
        return jsonify({'success': False, 'message': 'Unauthorized'}), 403
    
    query = "UPDATE users SET is_active = %s WHERE id = %s"
    result = db.execute_insert(query, (is_active, user_id))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

# Error handler
@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'message': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'success': False, 'message': 'Internal server error'}), 500

# ============================================
# NOTIFICATIONS API
# ============================================

@app.route('/api/notifications/<int:user_id>', methods=['GET'])
def get_notifications(user_id):
    """Get user notifications"""
    is_read = request.args.get('is_read')
    notification_type = request.args.get('type')
    
    query = """
    SELECT * FROM notifications 
    WHERE user_id = %s
    """
    params = [user_id]
    
    if is_read is not None:
        query += " AND is_read = %s"
        params.append(1 if is_read == 'true' else 0)
    if notification_type:
        query += " AND notification_type = %s"
        params.append(notification_type)
    
    query += " ORDER BY created_at DESC LIMIT 50"
    
    notifications = db.execute_query(query, tuple(params))
    return jsonify({'success': True, 'data': notifications or []})

@app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark notification as read"""
    query = "UPDATE notifications SET is_read = TRUE WHERE id = %s"
    result = db.execute_insert(query, (notification_id,))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

@app.route('/api/notifications/<int:user_id>/mark-all-read', methods=['PUT'])
def mark_all_notifications_read(user_id):
    """Mark all notifications as read"""
    query = "UPDATE notifications SET is_read = TRUE WHERE user_id = %s"
    result = db.execute_insert(query, (user_id,))
    
    if result is not None:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Update failed'}), 500

# ============================================
# DASHBOARD ANALYTICS
# ============================================

@app.route('/api/dashboard/admin', methods=['GET'])
def get_admin_dashboard():
    """Get admin dashboard data"""
    
    # User stats
    users_query = """
    SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'student' THEN 1 END) as total_students,
        COUNT(CASE WHEN role = 'teacher' THEN 1 END) as total_teachers,
        COUNT(CASE WHEN role = 'parent' THEN 1 END) as total_parents
    FROM users WHERE is_active = 1
    """
    users = db.execute_query(users_query)
    
    # Content stats
    content_query = """
    SELECT 
        COUNT(*) as total_content,
        COUNT(CASE WHEN is_premium = TRUE THEN 1 END) as premium_content,
        SUM(view_count) as total_views
    FROM content_library WHERE is_published = TRUE
    """
    content = db.execute_query(content_query)
    
    # Test stats
    tests_query = """
    SELECT 
        COUNT(DISTINCT t.id) as total_tests,
        COUNT(DISTINCT ta.id) as total_attempts,
        AVG(ta.percentage) as avg_score
    FROM tests t
    LEFT JOIN test_attempts ta ON t.id = ta.test_id
    WHERE t.is_published = TRUE
    """
    tests = db.execute_query(tests_query)
    
    # Revenue stats (today)
    revenue_query = """
    SELECT 
        COALESCE(SUM(amount), 0) as today_revenue,
        COUNT(*) as today_purchases
    FROM revenue_records
    WHERE DATE(recorded_at) = CURDATE()
    """
    revenue = db.execute_query(revenue_query)
    
    # Active exams
    exams_query = """
    SELECT COUNT(*) as active_exams
    FROM exam_sessions
    WHERE status = 'active'
    """
    exams = db.execute_query(exams_query)
    
    return jsonify({
        'success': True,
        'users': users[0] if users else {},
        'content': content[0] if content else {},
        'tests': tests[0] if tests else {},
        'revenue': revenue[0] if revenue else {},
        'exams': exams[0] if exams else {}
    })

@app.route('/api/dashboard/teacher/<int:teacher_id>', methods=['GET'])
def get_teacher_dashboard(teacher_id):
    """Get teacher dashboard data"""
    
    # Lessons stats
    lessons_query = """
    SELECT 
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_lessons
    FROM lessons WHERE teacher_id = %s
    """
    lessons = db.execute_query(lessons_query, (teacher_id,))
    
    # Content stats
    content_query = """
    SELECT 
        COUNT(*) as total_content,
        SUM(view_count) as total_views
    FROM content_library WHERE uploaded_by = %s
    """
    content = db.execute_query(content_query, (teacher_id,))
    
    # Tests stats
    tests_query = """
    SELECT 
        COUNT(DISTINCT t.id) as total_tests,
        COUNT(DISTINCT ta.id) as total_attempts
    FROM tests t
    LEFT JOIN test_attempts ta ON t.id = ta.test_id
    WHERE t.created_by = %s
    """
    tests = db.execute_query(tests_query, (teacher_id,))
    
    # Revenue stats
    revenue_query = """
    SELECT 
        COALESCE(SUM(net_amount), 0) as total_earnings,
        COUNT(*) as total_sales
    FROM revenue_records WHERE teacher_id = %s
    """
    revenue = db.execute_query(revenue_query, (teacher_id,))
    
    return jsonify({
        'success': True,
        'lessons': lessons[0] if lessons else {},
        'content': content[0] if content else {},
        'tests': tests[0] if tests else {},
        'revenue': revenue[0] if revenue else {}
    })

@app.route('/api/dashboard/student/<int:student_id>', methods=['GET'])
def get_student_dashboard(student_id):
    """Get student dashboard data"""
    
    # Test attempts
    tests_query = """
    SELECT 
        COUNT(*) as total_attempts,
        AVG(percentage) as avg_score,
        MAX(percentage) as best_score
    FROM test_attempts WHERE student_id = %s
    """
    tests = db.execute_query(tests_query, (student_id,))
    
    # Content views
    content_query = """
    SELECT 
        COUNT(DISTINCT content_id) as viewed_content,
        COUNT(CASE WHEN completed = TRUE THEN 1 END) as completed_content
    FROM content_views WHERE user_id = %s
    """
    content = db.execute_query(content_query, (student_id,))
    
    # Lessons progress
    lessons_query = """
    SELECT 
        COUNT(*) as total_lessons,
        COUNT(CASE WHEN attended = TRUE THEN 1 END) as attended_lessons,
        COUNT(CASE WHEN reviewed = TRUE THEN 1 END) as reviewed_lessons
    FROM lesson_attendance WHERE student_id = %s
    """
    lessons = db.execute_query(lessons_query, (student_id,))
    
    # Purchases
    purchases_query = """
    SELECT 
        COUNT(*) as total_purchases,
        COALESCE(SUM(amount), 0) as total_spent
    FROM content_purchases 
    WHERE student_id = %s AND status = 'completed'
    """
    purchases = db.execute_query(purchases_query, (student_id,))
    
    return jsonify({
        'success': True,
        'tests': tests[0] if tests else {},
        'content': content[0] if content else {},
        'lessons': lessons[0] if lessons else {},
        'purchases': purchases[0] if purchases else {}
    })

# ============================================
# PARENT ACADEMIC PROGRESS ENDPOINTS
# ============================================

@app.route('/api/parents/<int:parent_id>/children', methods=['GET'])
def get_parent_children(parent_id):
    """Get all children for a parent"""
    query = """
    SELECT 
        s.id,
        s.student_id,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        s.class,
        s.section,
        u.profile_photo as photo,
        psr.relationship_type,
        psr.is_primary_contact
    FROM parent_student_relationships psr
    JOIN students s ON psr.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE psr.parent_id = %s AND u.is_active = 1
    ORDER BY s.class DESC, u.first_name ASC
    """
    
    children = db.execute_query(query, (parent_id,))
    return jsonify({
        'success': True,
        'children': children or []
    })

@app.route('/api/parents/<int:parent_id>/academic-progress', methods=['GET'])
def get_parent_academic_progress(parent_id):
    """Get comprehensive academic progress for all parent's children"""
    
    # Get parent's children
    children_query = """
    SELECT 
        s.id as student_id,
        s.student_id as student_number,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        s.class,
        s.section,
        u.profile_photo as photo
    FROM parent_student_relationships psr
    JOIN students s ON psr.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE psr.parent_id = %s AND u.is_active = 1
    """
    
    children = db.execute_query(children_query, (parent_id,))
    
    if not children:
        return jsonify({
            'success': True,
            'children': [],
            'academic_data': {}
        })
    
    academic_data = {}
    
    for child in children:
        student_id = child['student_id']
        
        # Get overall progress
        progress_query = """
        SELECT 
            gpa,
            class_rank,
            total_students,
            percentile,
            attendance_rate,
            grade_trend,
            strengths,
            concerns,
            recommendations
        FROM student_progress
        WHERE student_id = %s AND subject_id IS NULL
        ORDER BY created_at DESC
        LIMIT 1
        """
        progress = db.execute_query(progress_query, (student_id,))
        
        # Get subject performance
        subjects_query = """
        SELECT 
            sp.id,
            s.name as subject_name,
            sp.current_score as current,
            sp.previous_score as previous,
            sp.trend,
            sp.change_percentage as change,
            sp.teacher_name as teacher,
            sp.assignments_completed,
            sp.assignments_total,
            sp.assignments_pending,
            sp.attendance_rate as attendance,
            sp.teacher_comment,
            sp.recent_tests
        FROM subject_performance sp
        JOIN subjects s ON sp.subject_id = s.id
        WHERE sp.student_id = %s
        ORDER BY s.name ASC
        """
        subjects = db.execute_query(subjects_query, (student_id,))
        
        # Get monthly trends
        trends_query = """
        SELECT 
            month_name as month,
            gpa,
            average_grade,
            attendance_rate
        FROM monthly_grade_trends
        WHERE student_id = %s
        ORDER BY year DESC, month DESC
        LIMIT 6
        """
        trends = db.execute_query(trends_query, (student_id,))
        
        # Get upcoming tests
        upcoming_query = """
        SELECT 
            subject_name as subject,
            assessment_name as type,
            assessment_date as date,
            start_time,
            total_marks
        FROM upcoming_assessments
        WHERE student_id = %s AND assessment_date >= CURDATE()
        ORDER BY assessment_date ASC
        LIMIT 5
        """
        upcoming = db.execute_query(upcoming_query, (student_id,))
        
        # Calculate GPA change
        current_gpa = progress[0]['gpa'] if progress else 0
        previous_gpa = 0
        gpa_change = 0
        
        if trends and len(trends) > 1:
            previous_gpa = trends[1]['gpa']
            gpa_change = current_gpa - previous_gpa
        
        # Determine overall trend
        overall_trend = 'stable'
        if progress and progress[0]['grade_trend']:
            trend_map = {'up': 'improving', 'down': 'declining', 'stable': 'stable'}
            overall_trend = trend_map.get(progress[0]['grade_trend'], 'stable')
        
        # Parse strengths, concerns, recommendations
        strengths = []
        concerns = []
        recommendations = []
        
        if progress:
            if progress[0].get('strengths'):
                strengths = progress[0]['strengths'].split('|') if isinstance(progress[0]['strengths'], str) else []
            if progress[0].get('concerns'):
                concerns = progress[0]['concerns'].split('|') if isinstance(progress[0]['concerns'], str) else []
            if progress[0].get('recommendations'):
                recommendations = progress[0]['recommendations'].split('|') if isinstance(progress[0]['recommendations'], str) else []
        
        # Format subjects with tests
        formatted_subjects = []
        for subj in (subjects or []):
            tests = []
            if subj.get('recent_tests'):
                import json
                try:
                    tests = json.loads(subj['recent_tests']) if isinstance(subj['recent_tests'], str) else subj['recent_tests']
                except:
                    tests = []
            
            formatted_subjects.append({
                'name': subj['subject_name'],
                'current': float(subj['current']) if subj['current'] else 0,
                'previous': float(subj['previous']) if subj['previous'] else 0,
                'trend': subj['trend'],
                'change': f"{subj['change']:+.1f}%" if subj['change'] else '0%',
                'teacher': subj['teacher'] or 'N/A',
                'assignments': {
                    'completed': subj['assignments_completed'] or 0,
                    'total': subj['assignments_total'] or 0,
                    'pending': subj['assignments_pending'] or 0
                },
                'tests': tests,
                'attendance': float(subj['attendance']) if subj['attendance'] else 0,
                'teacherComment': subj['teacher_comment'] or ''
            })
        
        # Reverse trends to show oldest to newest
        if trends:
            trends = list(reversed(trends))
        
        academic_data[f"child{child['student_id']}"] = {
            'currentGPA': float(current_gpa) if current_gpa else 0.0,
            'previousGPA': float(previous_gpa) if previous_gpa else 0.0,
            'gpaChange': f"{gpa_change:+.2f}" if gpa_change else '0.00',
            'classRank': progress[0]['class_rank'] if progress else 0,
            'totalStudents': progress[0]['total_students'] if progress else 0,
            'percentile': float(progress[0]['percentile']) if progress and progress[0]['percentile'] else 0,
            'overallTrend': overall_trend,
            'subjects': formatted_subjects,
            'monthlyTrends': [
                {
                    'month': t['month'],
                    'gpa': float(t['gpa']) if t['gpa'] else 0.0
                }
                for t in (trends or [])
            ],
            'strengths': strengths,
            'concerns': concerns,
            'recommendations': recommendations,
            'upcomingTests': [
                {
                    'subject': u['subject'],
                    'type': u['type'],
                    'date': u['date'].strftime('%Y-%m-%d') if hasattr(u['date'], 'strftime') else str(u['date'])
                }
                for u in (upcoming or [])
            ]
        }
    
    return jsonify({
        'success': True,
        'children': children,
        'academic_data': academic_data
    })

@app.route('/api/students/<int:student_id>/academic-progress', methods=['GET'])
def get_student_academic_progress(student_id):
    """Get academic progress for a specific student"""
    
    # Get student info
    student_query = """
    SELECT 
        s.id,
        s.student_id as student_number,
        CONCAT(u.first_name, ' ', u.last_name) as name,
        s.class,
        s.section
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = %s
    """
    student = db.execute_query(student_query, (student_id,))
    
    if not student:
        return jsonify({
            'success': False,
            'message': 'Student not found'
        }), 404
    
    # Get overall progress
    progress_query = """
    SELECT 
        gpa,
        class_rank,
        total_students,
        percentile,
        attendance_rate,
        grade_trend
    FROM student_progress
    WHERE student_id = %s AND subject_id IS NULL
    ORDER BY created_at DESC
    LIMIT 1
    """
    progress = db.execute_query(progress_query, (student_id,))
    
    # Get subject performance
    subjects_query = """
    SELECT 
        s.name as subject_name,
        sp.current_score as current,
        sp.previous_score as previous,
        sp.trend,
        sp.teacher_name as teacher
    FROM subject_performance sp
    JOIN subjects s ON sp.subject_id = s.id
    WHERE sp.student_id = %s
    ORDER BY s.name ASC
    """
    subjects = db.execute_query(subjects_query, (student_id,))
    
    return jsonify({
        'success': True,
        'student': student[0] if student else {},
        'progress': progress[0] if progress else {},
        'subjects': subjects or []
    })

if __name__ == '__main__':
    print("🚀 Starting REAL Smart School Backend...")
    print("📍 Backend will be available at: http://localhost:5000")
    print("🔗 Health check: http://localhost:5000/api/health")
    print("💾 Database: Connecting to MySQL...")
    # Bind to 0.0.0.0 so the backend is reachable from other devices on the LAN
    # (e.g., when the frontend is served from a different host/IP).
    # In production you should run behind a proper WSGI server and reverse proxy.
    app.run(debug=True, host='0.0.0.0', port=5000)
