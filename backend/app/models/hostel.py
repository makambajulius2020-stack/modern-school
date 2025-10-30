from app import db
from datetime import datetime

class Hostel(db.Model):
    __tablename__ = 'hostels'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # male, female, mixed
    capacity = db.Column(db.Integer, default=0)
    warden_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    rooms = db.relationship('HostelRoom', backref='hostel', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'gender': self.gender,
            'capacity': self.capacity,
            'warden_id': self.warden_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

class HostelRoom(db.Model):
    __tablename__ = 'hostel_rooms'

    id = db.Column(db.Integer, primary_key=True)
    hostel_id = db.Column(db.Integer, db.ForeignKey('hostels.id'), nullable=False)
    room_number = db.Column(db.String(20), nullable=False)
    bed_count = db.Column(db.Integer, default=4)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    allocations = db.relationship('HostelAllocation', backref='room', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'hostel_id': self.hostel_id,
            'room_number': self.room_number,
            'bed_count': self.bed_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

class HostelAllocation(db.Model):
    __tablename__ = 'hostel_allocations'

    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('hostel_rooms.id'), nullable=False)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), default='active')  # active, completed, cancelled

    def to_dict(self):
        return {
            'id': self.id,
            'room_id': self.room_id,
            'student_id': self.student_id,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'status': self.status,
        }
