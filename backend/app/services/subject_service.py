from datetime import datetime, timedelta
from typing import List, Dict, Optional, Any
from sqlalchemy import and_, or_, func, desc
from app import db
from app.models import (
    Subject, ClassSubject, StudentSubject, SubjectTopic,
    User, SchoolClass, Grade, Assignment, Exam
)
from app.services.ai_analytics_service import AIAnalyticsService

class SubjectService:
    def __init__(self):
        self.ai_service = AIAnalyticsService()

    def create_subject(self, subject_data: Dict[str, Any], creator_id: int) -> Dict[str, Any]:
        """Create a new subject"""
        try:
            # Generate UNEB-aligned syllabus topics if requested
            syllabus_topics = subject_data.get('syllabus_topics', [])
            if subject_data.get('generate_syllabus', False):
                syllabus_topics = self._generate_uneb_syllabus(
                    subject_data['name'], 
                    subject_data['class_level']
                )
            
            subject = Subject(
                name=subject_data['name'],
                code=subject_data['code'],
                description=subject_data.get('description', ''),
                class_level=subject_data['class_level'],
                credits=subject_data.get('credits', 4),
                is_core=subject_data.get('is_core', True),
                department=subject_data.get('department', ''),
                uneb_code=subject_data.get('uneb_code', ''),
                curriculum_year=subject_data.get('curriculum_year', 2024),
                syllabus_topics=syllabus_topics,
                textbook=subject_data.get('textbook', ''),
                reference_materials=subject_data.get('reference_materials', []),
                practical_required=subject_data.get('practical_required', False),
                continuous_assessment_weight=subject_data.get('continuous_assessment_weight', 40.0),
                final_exam_weight=subject_data.get('final_exam_weight', 60.0),
                pass_mark=subject_data.get('pass_mark', 50.0),
                created_by=creator_id
            )
            
            db.session.add(subject)
            db.session.flush()
            
            # Create subject topics if provided
            if subject_data.get('topics', []):
                for i, topic_data in enumerate(subject_data['topics']):
                    topic = SubjectTopic(
                        subject_id=subject.id,
                        name=topic_data['name'],
                        description=topic_data.get('description', ''),
                        uneb_topic_code=topic_data.get('uneb_topic_code', ''),
                        order_sequence=i + 1,
                        estimated_hours=topic_data.get('estimated_hours', 4),
                        learning_objectives=topic_data.get('learning_objectives', []),
                        teaching_resources=topic_data.get('teaching_resources', []),
                        assessment_methods=topic_data.get('assessment_methods', [])
                    )
                    db.session.add(topic)
            
            db.session.commit()
            
            return {
                'success': True,
                'subject': subject.to_dict(),
                'message': 'Subject created successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'error': str(e)}

    def _generate_uneb_syllabus(self, subject_name: str, class_level: str) -> List[Dict[str, Any]]:
        """Generate UNEB-aligned syllabus topics using AI"""
        try:
            prompt = f"""
            Generate a comprehensive UNEB curriculum syllabus for:
            Subject: {subject_name}
            Class Level: {class_level}
            
            Provide topics aligned with Uganda's UNEB curriculum standards.
            Return as JSON array with this structure:
            [{{
                "topic_name": "Topic name",
                "description": "Brief description",
                "learning_objectives": ["objective 1", "objective 2"],
                "estimated_hours": 8,
                "prerequisites": ["prerequisite topics"],
                "assessment_methods": ["method 1", "method 2"],
                "uneb_reference": "UNEB syllabus reference"
            }}]
            
            Include 8-12 main topics covering the full curriculum.
            """
            
            response = self.ai_service.generate_content(prompt, max_tokens=1500)
            
            if response and response.get('success'):
                try:
                    import json
                    return json.loads(response['content'])
                except json.JSONDecodeError:
                    pass
            
            # Fallback syllabus
            return self._generate_fallback_syllabus(subject_name, class_level)
            
        except Exception:
            return self._generate_fallback_syllabus(subject_name, class_level)

    def _generate_fallback_syllabus(self, subject_name: str, class_level: str) -> List[Dict[str, Any]]:
        """Generate fallback syllabus when AI is unavailable"""
        fallback_topics = {
            'Mathematics': [
                {'topic_name': 'Algebra', 'description': 'Linear and quadratic equations'},
                {'topic_name': 'Geometry', 'description': 'Shapes, angles, and measurements'},
                {'topic_name': 'Calculus', 'description': 'Differentiation and integration'},
                {'topic_name': 'Statistics', 'description': 'Data analysis and probability'}
            ],
            'Physics': [
                {'topic_name': 'Mechanics', 'description': 'Motion, forces, and energy'},
                {'topic_name': 'Waves', 'description': 'Sound and light waves'},
                {'topic_name': 'Electricity', 'description': 'Current, voltage, and circuits'},
                {'topic_name': 'Modern Physics', 'description': 'Atomic and nuclear physics'}
            ],
            'Chemistry': [
                {'topic_name': 'Organic Chemistry', 'description': 'Carbon compounds and reactions'},
                {'topic_name': 'Physical Chemistry', 'description': 'Chemical kinetics and thermodynamics'},
                {'topic_name': 'Analytical Chemistry', 'description': 'Quantitative and qualitative analysis'},
                {'topic_name': 'Industrial Chemistry', 'description': 'Chemical processes and applications'}
            ],
            'Biology': [
                {'topic_name': 'Cell Biology', 'description': 'Cell structure and function'},
                {'topic_name': 'Genetics', 'description': 'Heredity and genetic engineering'},
                {'topic_name': 'Ecology', 'description': 'Ecosystems and environmental science'},
                {'topic_name': 'Evolution', 'description': 'Natural selection and adaptation'}
            ]
        }
        
        topics = fallback_topics.get(subject_name, [
            {'topic_name': 'Introduction', 'description': f'Basic concepts in {subject_name}'},
            {'topic_name': 'Fundamentals', 'description': f'Core principles of {subject_name}'},
            {'topic_name': 'Applications', 'description': f'Practical applications of {subject_name}'},
            {'topic_name': 'Advanced Topics', 'description': f'Advanced concepts in {subject_name}'}
        ])
        
        # Add standard fields
        for topic in topics:
            topic.update({
                'learning_objectives': [f'Understand {topic["topic_name"].lower()}', f'Apply {topic["topic_name"].lower()} concepts'],
                'estimated_hours': 8,
                'prerequisites': [],
                'assessment_methods': ['Written test', 'Practical work'],
                'uneb_reference': f'{subject_name}-{class_level}'
            })
        
        return topics

    def assign_subject_to_class(self, assignment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assign a subject to a class with a teacher"""
        try:
            class_subject = ClassSubject(
                class_id=assignment_data['class_id'],
                subject_id=assignment_data['subject_id'],
                teacher_id=assignment_data['teacher_id'],
                periods_per_week=assignment_data.get('periods_per_week', 4),
                room=assignment_data.get('room', ''),
                academic_year=assignment_data.get('academic_year', '2024'),
                term=assignment_data.get('term', 'Term 1')
            )
            
            db.session.add(class_subject)
            db.session.commit()
            
            return {
                'success': True,
                'class_subject': class_subject.to_dict(),
                'message': 'Subject assigned to class successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'error': str(e)}

    def enroll_student_in_subject(self, enrollment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Enroll a student in a subject"""
        try:
            # Check if already enrolled
            existing = StudentSubject.query.filter_by(
                student_id=enrollment_data['student_id'],
                subject_id=enrollment_data['subject_id'],
                academic_year=enrollment_data.get('academic_year', '2024'),
                term=enrollment_data.get('term', 'Term 1')
            ).first()
            
            if existing:
                return {'success': False, 'error': 'Student already enrolled in this subject'}
            
            student_subject = StudentSubject(
                student_id=enrollment_data['student_id'],
                subject_id=enrollment_data['subject_id'],
                class_subject_id=enrollment_data['class_subject_id'],
                academic_year=enrollment_data.get('academic_year', '2024'),
                term=enrollment_data.get('term', 'Term 1')
            )
            
            db.session.add(student_subject)
            db.session.commit()
            
            return {
                'success': True,
                'student_subject': student_subject.to_dict(),
                'message': 'Student enrolled in subject successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'error': str(e)}

    def get_student_subjects(self, student_id: int, academic_year: str = '2024', term: str = 'Term 1') -> List[Dict[str, Any]]:
        """Get all subjects for a student with performance data"""
        try:
            student_subjects = StudentSubject.query.filter_by(
                student_id=student_id,
                academic_year=academic_year,
                term=term,
                is_active=True
            ).all()
            
            subjects_data = []
            for ss in student_subjects:
                subject_dict = ss.to_dict()
                
                # Add performance data
                recent_grades = Grade.query.filter_by(
                    student_id=student_id,
                    subject_id=ss.subject_id
                ).order_by(desc(Grade.assessment_date)).limit(5).all()
                
                if recent_grades:
                    subject_dict['recent_scores'] = [g.percentage for g in recent_grades]
                    subject_dict['current_grade'] = sum(g.percentage for g in recent_grades) / len(recent_grades)
                    
                    # Calculate trend
                    if len(recent_grades) >= 2:
                        recent_avg = sum(g.percentage for g in recent_grades[:2]) / 2
                        older_avg = sum(g.percentage for g in recent_grades[2:]) / max(1, len(recent_grades[2:]))
                        improvement = recent_avg - older_avg
                        
                        if improvement > 5:
                            subject_dict['trend'] = 'up'
                        elif improvement < -5:
                            subject_dict['trend'] = 'down'
                        else:
                            subject_dict['trend'] = 'stable'
                        
                        subject_dict['improvement_percentage'] = improvement
                
                # Add upcoming assessments
                upcoming_assignments = Assignment.query.filter(
                    and_(
                        Assignment.subject_id == ss.subject_id,
                        Assignment.due_date > datetime.utcnow(),
                        Assignment.status == 'active'
                    )
                ).order_by(Assignment.due_date).limit(3).all()
                
                upcoming_exams = Exam.query.filter(
                    and_(
                        Exam.subject_id == ss.subject_id,
                        Exam.scheduled_date > datetime.utcnow(),
                        Exam.status == 'active'
                    )
                ).order_by(Exam.scheduled_date).limit(3).all()
                
                subject_dict['upcoming_tests'] = []
                for assignment in upcoming_assignments:
                    subject_dict['upcoming_tests'].append({
                        'name': assignment.title,
                        'date': assignment.due_date.strftime('%Y-%m-%d'),
                        'type': 'assignment'
                    })
                
                for exam in upcoming_exams:
                    subject_dict['upcoming_tests'].append({
                        'name': exam.title,
                        'date': exam.scheduled_date.strftime('%Y-%m-%d'),
                        'type': 'exam'
                    })
                
                subjects_data.append(subject_dict)
            
            return subjects_data
            
        except Exception as e:
            return []

    def get_teacher_subjects(self, teacher_id: int, academic_year: str = '2024', term: str = 'Term 1') -> List[Dict[str, Any]]:
        """Get all subjects taught by a teacher"""
        try:
            class_subjects = ClassSubject.query.filter_by(
                teacher_id=teacher_id,
                academic_year=academic_year,
                term=term,
                is_active=True
            ).all()
            
            subjects_data = []
            for cs in class_subjects:
                subject_dict = cs.to_dict()
                
                # Add student count
                student_count = StudentSubject.query.filter_by(
                    class_subject_id=cs.id,
                    is_active=True
                ).count()
                subject_dict['student_count'] = student_count
                
                # Add performance statistics
                if student_count > 0:
                    # Get recent grades for this class-subject
                    recent_grades = Grade.query.filter(
                        and_(
                            Grade.subject_id == cs.subject_id,
                            Grade.class_id == cs.class_id,
                            Grade.teacher_id == teacher_id
                        )
                    ).all()
                    
                    if recent_grades:
                        percentages = [g.percentage for g in recent_grades]
                        subject_dict['class_average'] = sum(percentages) / len(percentages)
                        subject_dict['highest_score'] = max(percentages)
                        subject_dict['lowest_score'] = min(percentages)
                        
                        # Grade distribution
                        grade_dist = {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0}
                        for grade in recent_grades:
                            if grade.letter_grade in grade_dist:
                                grade_dist[grade.letter_grade] += 1
                        subject_dict['grade_distribution'] = grade_dist
                
                # Add upcoming assessments
                upcoming_assignments = Assignment.query.filter(
                    and_(
                        Assignment.subject_id == cs.subject_id,
                        Assignment.class_id == cs.class_id,
                        Assignment.teacher_id == teacher_id,
                        Assignment.due_date > datetime.utcnow()
                    )
                ).count()
                
                upcoming_exams = Exam.query.filter(
                    and_(
                        Exam.subject_id == cs.subject_id,
                        Exam.class_id == cs.class_id,
                        Exam.teacher_id == teacher_id,
                        Exam.scheduled_date > datetime.utcnow()
                    )
                ).count()
                
                subject_dict['upcoming_assignments'] = upcoming_assignments
                subject_dict['upcoming_exams'] = upcoming_exams
                
                subjects_data.append(subject_dict)
            
            return subjects_data
            
        except Exception as e:
            return []

    def get_subject_analytics(self, subject_id: int, class_id: Optional[int] = None) -> Dict[str, Any]:
        """Get comprehensive analytics for a subject"""
        try:
            subject = Subject.query.get(subject_id)
            if not subject:
                return {'success': False, 'error': 'Subject not found'}
            
            # Base query for grades
            grade_query = Grade.query.filter_by(subject_id=subject_id)
            if class_id:
                grade_query = grade_query.filter_by(class_id=class_id)
            
            grades = grade_query.all()
            
            analytics = {
                'subject': subject.to_dict(),
                'total_students': 0,
                'total_assessments': len(grades),
                'average_performance': 0,
                'grade_distribution': {'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0},
                'performance_trend': 'stable',
                'at_risk_students': 0,
                'top_performers': [],
                'struggling_students': []
            }
            
            if grades:
                percentages = [g.percentage for g in grades]
                analytics['average_performance'] = sum(percentages) / len(percentages)
                
                # Grade distribution
                for grade in grades:
                    if grade.letter_grade in analytics['grade_distribution']:
                        analytics['grade_distribution'][grade.letter_grade] += 1
                
                # Student performance analysis
                student_performances = {}
                for grade in grades:
                    if grade.student_id not in student_performances:
                        student_performances[grade.student_id] = []
                    student_performances[grade.student_id].append(grade.percentage)
                
                analytics['total_students'] = len(student_performances)
                
                # Identify top performers and struggling students
                student_averages = {}
                for student_id, scores in student_performances.items():
                    avg_score = sum(scores) / len(scores)
                    student_averages[student_id] = avg_score
                    
                    if avg_score < 50:
                        analytics['at_risk_students'] += 1
                
                # Sort by performance
                sorted_students = sorted(student_averages.items(), key=lambda x: x[1], reverse=True)
                
                # Top 5 performers
                for student_id, avg_score in sorted_students[:5]:
                    student = User.query.get(student_id)
                    if student:
                        analytics['top_performers'].append({
                            'student_id': student_id,
                            'student_name': student.full_name,
                            'average_score': round(avg_score, 1)
                        })
                
                # Bottom 5 performers (struggling)
                for student_id, avg_score in sorted_students[-5:]:
                    if avg_score < 60:  # Only include if below 60%
                        student = User.query.get(student_id)
                        if student:
                            analytics['struggling_students'].append({
                                'student_id': student_id,
                                'student_name': student.full_name,
                                'average_score': round(avg_score, 1)
                            })
            
            return {
                'success': True,
                'analytics': analytics
            }
            
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def update_subject_progress(self, student_id: int, subject_id: int, topic_progress: Dict[str, Any]) -> Dict[str, Any]:
        """Update student's progress in subject topics"""
        try:
            student_subject = StudentSubject.query.filter_by(
                student_id=student_id,
                subject_id=subject_id,
                is_active=True
            ).first()
            
            if not student_subject:
                return {'success': False, 'error': 'Student not enrolled in this subject'}
            
            # Update topics completed
            current_topics = student_subject.topics_completed or {}
            current_topics.update(topic_progress)
            student_subject.topics_completed = current_topics
            
            # Calculate overall progress
            subject_topics = SubjectTopic.query.filter_by(subject_id=subject_id, is_active=True).all()
            if subject_topics:
                total_progress = sum(current_topics.get(str(topic.id), 0) for topic in subject_topics)
                student_subject.mastery_percentage = (total_progress / len(subject_topics)) if subject_topics else 0
            
            student_subject.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'success': True,
                'student_subject': student_subject.to_dict(),
                'message': 'Subject progress updated successfully'
            }
            
        except Exception as e:
            db.session.rollback()
            return {'success': False, 'error': str(e)}

    def get_all_subjects(self, class_level: Optional[str] = None, department: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all subjects with optional filters"""
        query = Subject.query.filter_by(is_active=True)
        
        if class_level:
            query = query.filter_by(class_level=class_level)
        if department:
            query = query.filter_by(department=department)
            
        subjects = query.order_by(Subject.name).all()
        return [subject.to_dict() for subject in subjects]
