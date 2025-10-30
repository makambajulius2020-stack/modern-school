# Core models
from app.models.user import User, AuditLog, SystemSettings
from app.models.attendance import Attendance
from app.models.course import Course
from app.models.payment import Payment, PaymentGatewayConfig
from app.models.notification import Notification, NotificationTemplate
from app.models.ai_analytics import AIAnalytics, PlagiarismCheck
from app.models.profile import UserProfile, Message, LessonPlan
from app.models.class_management import SchoolClass, StudentEnrollment, ClassSchedule
from app.models.fee_structure import FeeStructure, FeeStructureItem, FeeStatement, FeePayment

# Enhanced models
from app.models.exam import Exam, ExamQuestion, ExamSubmission, ExamTemplate
from app.models.subject import Subject, ClassSubject, StudentSubject, SubjectTopic
from app.models.grade import Grade, GradeScale, StudentProgress
from app.models.assignment import Assignment, AssignmentSubmission, AssignmentTemplate, StudyMaterial
from app.models.fraud_detection import FraudDetectionRule, FraudDetection, AnomalyDetection, UserBehaviorProfile
from app.models.cocurricular import (
    CocurricularActivity, CocurricularParticipation, CocurricularEvent, 
    CocurricularAttendance, CocurricularAchievement
)
from app.models.timetable import Timetable, TimetableEntry
from app.models.complaint import Complaint
from app.models.hostel import Hostel, HostelRoom, HostelAllocation
from app.models.payroll import PayrollEntry
from app.models.award import Award
from app.models.online_class import OnlineClass, OnlineClassParticipant
from app.models.biometric import BiometricData, BiometricAttendanceLog
from app.models.student_achievement import StudentAchievement
from app.models.ai_quiz import AIStudyQuiz, QuizQuestion
from app.models.transport import (
    TransportVehicle, TransportDriver, TransportRoute, 
    StudentTransport, TransportTrip, TransportAttendance, VehicleMaintenance
)
from app.models.medical import (
    MedicalRecord, VaccinationRecord, MedicalCheckup, 
    MedicalIncident, Prescription, MedicalAlert, MedicalStaff
)

# Export all models for easy importing
__all__ = [
    # Core models
    'User', 'AuditLog', 'SystemSettings',
    'Attendance', 'Course', 'Payment', 'PaymentGatewayConfig',
    'Notification', 'NotificationTemplate', 'AIAnalytics', 'PlagiarismCheck',
    'UserProfile', 'Message', 'LessonPlan', 'SchoolClass', 'StudentEnrollment', 'ClassSchedule',
    'FeeStructure', 'FeeStructureItem', 'FeeStatement', 'FeePayment',
    
    # Enhanced models
    'Exam', 'ExamQuestion', 'ExamSubmission', 'ExamTemplate',
    'Subject', 'ClassSubject', 'StudentSubject', 'SubjectTopic',
    'Grade', 'GradeScale', 'StudentProgress',
    'Assignment', 'AssignmentSubmission', 'AssignmentTemplate', 'StudyMaterial',
    'FraudDetectionRule', 'FraudDetection', 'AnomalyDetection', 'UserBehaviorProfile',
    'CocurricularActivity', 'CocurricularParticipation', 'CocurricularEvent',
    'CocurricularAttendance', 'CocurricularAchievement',
    'Timetable', 'TimetableEntry', 'Complaint',
    'Hostel', 'HostelRoom', 'HostelAllocation', 'PayrollEntry', 'Award',
    'OnlineClass', 'OnlineClassParticipant', 'BiometricData', 'BiometricAttendanceLog',
    'StudentAchievement', 'AIStudyQuiz', 'QuizQuestion',
    'TransportVehicle', 'TransportDriver', 'TransportRoute',
    'StudentTransport', 'TransportTrip', 'TransportAttendance', 'VehicleMaintenance',
    'MedicalRecord', 'VaccinationRecord', 'MedicalCheckup',
    'MedicalIncident', 'Prescription', 'MedicalAlert', 'MedicalStaff'
]
