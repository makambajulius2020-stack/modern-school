from app import db
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship


class SchoolClass(db.Model):
    __tablename__ = 'classes'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    level = Column(Enum('O-Level', 'A-Level', name='education_level'), nullable=False)
    stream = Column(String(50))
    capacity = Column(Integer, default=40)
    class_teacher_id = Column(Integer, ForeignKey('user.id'))
    room = Column(String(50))
    academic_year = Column(String(10), nullable=False)
    term = Column(Enum('Term 1', 'Term 2', 'Term 3', name='school_term'), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    class_teacher = relationship('User', foreign_keys=[class_teacher_id])
    enrollments = relationship('StudentEnrollment', back_populates='school_class')
    schedules = relationship('ClassSchedule', back_populates='school_class')
    
    @property
    def student_count(self):
        return len([e for e in self.enrollments if e.is_active])
    
    @property
    def subjects(self):
        return list(set([schedule.subject.name for schedule in self.schedules if schedule.is_active]))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'level': self.level,
            'stream': self.stream,
            'capacity': self.capacity,
            'class_teacher_id': self.class_teacher_id,
            'class_teacher': self.class_teacher.first_name + ' ' + self.class_teacher.last_name if self.class_teacher else None,
            'room': self.room,
            'academic_year': self.academic_year,
            'term': self.term,
            'student_count': self.student_count,
            'subjects': self.subjects,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class StudentEnrollment(db.Model):
    __tablename__ = 'student_enrollments'
    
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    academic_year = Column(String(10), nullable=False)
    term = Column(Enum('Term 1', 'Term 2', 'Term 3', name='school_term'), nullable=False)
    enrollment_date = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship('User', foreign_keys=[student_id])
    school_class = relationship('SchoolClass', back_populates='enrollments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'student_name': f"{self.student.first_name} {self.student.last_name}" if self.student else None,
            'class_id': self.class_id,
            'class_name': self.school_class.name if self.school_class else None,
            'academic_year': self.academic_year,
            'term': self.term,
            'enrollment_date': self.enrollment_date.isoformat() if self.enrollment_date else None,
            'is_active': self.is_active
        }

class ClassSchedule(db.Model):
    __tablename__ = 'class_schedules'
    
    id = Column(Integer, primary_key=True)
    class_id = Column(Integer, ForeignKey('classes.id'), nullable=False)
    subject_id = Column(Integer, ForeignKey('subjects.id'), nullable=False)
    teacher_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    day_of_week = Column(Enum('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', name='weekday'), nullable=False)
    start_time = Column(String(10), nullable=False)  # Format: "08:00"
    end_time = Column(String(10), nullable=False)    # Format: "09:00"
    room = Column(String(50))
    academic_year = Column(String(10), nullable=False)
    term = Column(Enum('Term 1', 'Term 2', 'Term 3', name='school_term'), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    school_class = relationship('SchoolClass', back_populates='schedules')
    subject = relationship('Subject', back_populates='class_schedules')
    teacher = relationship('User', foreign_keys=[teacher_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'class_id': self.class_id,
            'class_name': self.school_class.name if self.school_class else None,
            'subject_id': self.subject_id,
            'subject_name': self.subject.name if self.subject else None,
            'teacher_id': self.teacher_id,
            'teacher_name': f"{self.teacher.first_name} {self.teacher.last_name}" if self.teacher else None,
            'day_of_week': self.day_of_week,
            'start_time': self.start_time,
            'end_time': self.end_time,
            'time': f"{self.start_time}-{self.end_time}",
            'room': self.room,
            'academic_year': self.academic_year,
            'term': self.term,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
