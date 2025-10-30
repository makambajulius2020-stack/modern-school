from app import db
from datetime import datetime
from sqlalchemy import Index

class MedicalRecord(db.Model):
    """Student medical records"""
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Basic health information
    blood_group = db.Column(db.String(5))  # A+, B-, O+, etc.
    height_cm = db.Column(db.Float)
    weight_kg = db.Column(db.Float)
    bmi = db.Column(db.Float)
    
    # Medical conditions
    allergies = db.Column(db.Text)  # JSON string of allergies
    chronic_conditions = db.Column(db.Text)  # JSON string of conditions
    disabilities = db.Column(db.Text)  # JSON string of disabilities
    medications = db.Column(db.Text)  # JSON string of current medications
    
    # Emergency information
    emergency_contact_name = db.Column(db.String(255))
    emergency_contact_phone = db.Column(db.String(20))
    emergency_contact_relationship = db.Column(db.String(100))
    emergency_contact_address = db.Column(db.Text)
    
    # Insurance information
    insurance_provider = db.Column(db.String(255))
    insurance_policy_number = db.Column(db.String(100))
    insurance_group_number = db.Column(db.String(100))
    insurance_expiry_date = db.Column(db.Date)
    
    # Special requirements
    dietary_restrictions = db.Column(db.Text)
    physical_limitations = db.Column(db.Text)
    special_equipment_needed = db.Column(db.Text)
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, inactive, archived
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', backref='medical_record')
    vaccinations = db.relationship('VaccinationRecord', backref='medical_record', lazy=True)
    checkups = db.relationship('MedicalCheckup', backref='medical_record', lazy=True)
    incidents = db.relationship('MedicalIncident', backref='medical_record', lazy=True)
    prescriptions = db.relationship('Prescription', backref='medical_record', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'blood_group': self.blood_group,
            'height_cm': self.height_cm,
            'weight_kg': self.weight_kg,
            'bmi': self.bmi,
            'allergies': self.allergies,
            'chronic_conditions': self.chronic_conditions,
            'disabilities': self.disabilities,
            'medications': self.medications,
            'emergency_contact_name': self.emergency_contact_name,
            'emergency_contact_phone': self.emergency_contact_phone,
            'emergency_contact_relationship': self.emergency_contact_relationship,
            'emergency_contact_address': self.emergency_contact_address,
            'insurance_provider': self.insurance_provider,
            'insurance_policy_number': self.insurance_policy_number,
            'insurance_group_number': self.insurance_group_number,
            'insurance_expiry_date': self.insurance_expiry_date.isoformat() if self.insurance_expiry_date else None,
            'dietary_restrictions': self.dietary_restrictions,
            'physical_limitations': self.physical_limitations,
            'special_equipment_needed': self.special_equipment_needed,
            'status': self.status,
            'notes': self.notes,
            'student': self.student.to_dict() if self.student else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class VaccinationRecord(db.Model):
    """Student vaccination records"""
    __tablename__ = 'vaccination_records'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    
    # Vaccination details
    vaccine_name = db.Column(db.String(255), nullable=False)
    vaccine_type = db.Column(db.String(100))  # routine, travel, seasonal
    manufacturer = db.Column(db.String(255))
    batch_number = db.Column(db.String(100))
    lot_number = db.Column(db.String(100))
    
    # Dates
    vaccination_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date)  # Next dose due date
    expiry_date = db.Column(db.Date)
    
    # Administration details
    administered_by = db.Column(db.String(255))  # Doctor/nurse name
    administration_site = db.Column(db.String(100))  # Left arm, right arm, etc.
    route = db.Column(db.String(50))  # IM, SC, oral, etc.
    dose = db.Column(db.String(50))  # 1st dose, 2nd dose, booster
    
    # Status and reactions
    status = db.Column(db.String(20), default='completed')  # completed, scheduled, missed, contraindicated
    adverse_reactions = db.Column(db.Text)
    contraindications = db.Column(db.Text)
    
    # Documentation
    certificate_number = db.Column(db.String(100))
    provider_name = db.Column(db.String(255))
    provider_license = db.Column(db.String(100))
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'medical_record_id': self.medical_record_id,
            'vaccine_name': self.vaccine_name,
            'vaccine_type': self.vaccine_type,
            'manufacturer': self.manufacturer,
            'batch_number': self.batch_number,
            'lot_number': self.lot_number,
            'vaccination_date': self.vaccination_date.isoformat(),
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'administered_by': self.administered_by,
            'administration_site': self.administration_site,
            'route': self.route,
            'dose': self.dose,
            'status': self.status,
            'adverse_reactions': self.adverse_reactions,
            'contraindications': self.contraindications,
            'certificate_number': self.certificate_number,
            'provider_name': self.provider_name,
            'provider_license': self.provider_license,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MedicalCheckup(db.Model):
    """Medical checkup records"""
    __tablename__ = 'medical_checkups'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    
    # Checkup details
    checkup_type = db.Column(db.String(100), nullable=False)  # annual, sports, dental, vision, etc.
    checkup_date = db.Column(db.Date, nullable=False)
    next_checkup_date = db.Column(db.Date)
    
    # Provider information
    provider_name = db.Column(db.String(255), nullable=False)
    provider_type = db.Column(db.String(100))  # doctor, nurse, dentist, optometrist
    provider_license = db.Column(db.String(100))
    facility_name = db.Column(db.String(255))
    facility_address = db.Column(db.Text)
    
    # Vital signs
    height_cm = db.Column(db.Float)
    weight_kg = db.Column(db.Float)
    bmi = db.Column(db.Float)
    blood_pressure_systolic = db.Column(db.Integer)
    blood_pressure_diastolic = db.Column(db.Integer)
    heart_rate = db.Column(db.Integer)
    temperature_celsius = db.Column(db.Float)
    
    # Examination findings
    general_appearance = db.Column(db.Text)
    cardiovascular = db.Column(db.Text)
    respiratory = db.Column(db.Text)
    gastrointestinal = db.Column(db.Text)
    neurological = db.Column(db.Text)
    musculoskeletal = db.Column(db.Text)
    skin = db.Column(db.Text)
    eyes = db.Column(db.Text)
    ears = db.Column(db.Text)
    throat = db.Column(db.Text)
    
    # Assessment and recommendations
    assessment = db.Column(db.Text)
    recommendations = db.Column(db.Text)
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.Date)
    
    # Status
    status = db.Column(db.String(20), default='completed')  # completed, scheduled, cancelled, no_show
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'medical_record_id': self.medical_record_id,
            'checkup_type': self.checkup_type,
            'checkup_date': self.checkup_date.isoformat(),
            'next_checkup_date': self.next_checkup_date.isoformat() if self.next_checkup_date else None,
            'provider_name': self.provider_name,
            'provider_type': self.provider_type,
            'provider_license': self.provider_license,
            'facility_name': self.facility_name,
            'facility_address': self.facility_address,
            'height_cm': self.height_cm,
            'weight_kg': self.weight_kg,
            'bmi': self.bmi,
            'blood_pressure_systolic': self.blood_pressure_systolic,
            'blood_pressure_diastolic': self.blood_pressure_diastolic,
            'heart_rate': self.heart_rate,
            'temperature_celsius': self.temperature_celsius,
            'general_appearance': self.general_appearance,
            'cardiovascular': self.cardiovascular,
            'respiratory': self.respiratory,
            'gastrointestinal': self.gastrointestinal,
            'neurological': self.neurological,
            'musculoskeletal': self.musculoskeletal,
            'skin': self.skin,
            'eyes': self.eyes,
            'ears': self.ears,
            'throat': self.throat,
            'assessment': self.assessment,
            'recommendations': self.recommendations,
            'follow_up_required': self.follow_up_required,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MedicalIncident(db.Model):
    """Medical incidents and emergencies"""
    __tablename__ = 'medical_incidents'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    
    # Incident details
    incident_date = db.Column(db.DateTime, nullable=False)
    incident_type = db.Column(db.String(100), nullable=False)  # injury, illness, emergency, accident
    severity = db.Column(db.String(20), nullable=False)  # minor, moderate, major, critical
    location = db.Column(db.String(255))
    
    # Description
    description = db.Column(db.Text, nullable=False)
    symptoms = db.Column(db.Text)
    cause = db.Column(db.Text)
    witnesses = db.Column(db.Text)
    
    # Treatment provided
    first_aid_provided = db.Column(db.Boolean, default=False)
    first_aid_details = db.Column(db.Text)
    medical_treatment = db.Column(db.Text)
    medications_given = db.Column(db.Text)
    
    # Medical response
    emergency_services_called = db.Column(db.Boolean, default=False)
    hospital_visit_required = db.Column(db.Boolean, default=False)
    hospital_name = db.Column(db.String(255))
    hospital_admission = db.Column(db.Boolean, default=False)
    discharge_date = db.Column(db.Date)
    
    # Follow-up
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.Date)
    follow_up_notes = db.Column(db.Text)
    
    # Reporting
    reported_by = db.Column(db.String(255))  # Staff member who reported
    parent_notified = db.Column(db.Boolean, default=False)
    parent_notification_time = db.Column(db.DateTime)
    incident_report_filed = db.Column(db.Boolean, default=False)
    
    # Status
    status = db.Column(db.String(20), default='open')  # open, investigating, resolved, closed
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'medical_record_id': self.medical_record_id,
            'incident_date': self.incident_date.isoformat(),
            'incident_type': self.incident_type,
            'severity': self.severity,
            'location': self.location,
            'description': self.description,
            'symptoms': self.symptoms,
            'cause': self.cause,
            'witnesses': self.witnesses,
            'first_aid_provided': self.first_aid_provided,
            'first_aid_details': self.first_aid_details,
            'medical_treatment': self.medical_treatment,
            'medications_given': self.medications_given,
            'emergency_services_called': self.emergency_services_called,
            'hospital_visit_required': self.hospital_visit_required,
            'hospital_name': self.hospital_name,
            'hospital_admission': self.hospital_admission,
            'discharge_date': self.discharge_date.isoformat() if self.discharge_date else None,
            'follow_up_required': self.follow_up_required,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'follow_up_notes': self.follow_up_notes,
            'reported_by': self.reported_by,
            'parent_notified': self.parent_notified,
            'parent_notification_time': self.parent_notification_time.isoformat() if self.parent_notification_time else None,
            'incident_report_filed': self.incident_report_filed,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Prescription(db.Model):
    """Prescription records"""
    __tablename__ = 'prescriptions'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    
    # Prescription details
    prescription_date = db.Column(db.Date, nullable=False)
    prescribed_by = db.Column(db.String(255), nullable=False)
    prescriber_license = db.Column(db.String(100))
    facility_name = db.Column(db.String(255))
    
    # Medication details
    medication_name = db.Column(db.String(255), nullable=False)
    generic_name = db.Column(db.String(255))
    dosage = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.String(100), nullable=False)  # daily, twice daily, as needed
    duration = db.Column(db.String(100))  # 7 days, 2 weeks, etc.
    quantity = db.Column(db.String(100))
    
    # Instructions
    instructions = db.Column(db.Text)
    special_instructions = db.Column(db.Text)
    side_effects = db.Column(db.Text)
    contraindications = db.Column(db.Text)
    
    # Status and compliance
    status = db.Column(db.String(20), default='active')  # active, completed, discontinued, expired
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    refills_remaining = db.Column(db.Integer, default=0)
    compliance_notes = db.Column(db.Text)
    
    # Pharmacy information
    pharmacy_name = db.Column(db.String(255))
    pharmacy_phone = db.Column(db.String(20))
    prescription_number = db.Column(db.String(100))
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'medical_record_id': self.medical_record_id,
            'prescription_date': self.prescription_date.isoformat(),
            'prescribed_by': self.prescribed_by,
            'prescriber_license': self.prescriber_license,
            'facility_name': self.facility_name,
            'medication_name': self.medication_name,
            'generic_name': self.generic_name,
            'dosage': self.dosage,
            'frequency': self.frequency,
            'duration': self.duration,
            'quantity': self.quantity,
            'instructions': self.instructions,
            'special_instructions': self.special_instructions,
            'side_effects': self.side_effects,
            'contraindications': self.contraindications,
            'status': self.status,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'refills_remaining': self.refills_remaining,
            'compliance_notes': self.compliance_notes,
            'pharmacy_name': self.pharmacy_name,
            'pharmacy_phone': self.pharmacy_phone,
            'prescription_number': self.prescription_number,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MedicalAlert(db.Model):
    """Medical alerts and notifications"""
    __tablename__ = 'medical_alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    medical_record_id = db.Column(db.Integer, db.ForeignKey('medical_records.id'), nullable=False)
    
    # Alert details
    alert_type = db.Column(db.String(100), nullable=False)  # allergy, medication, condition, emergency
    severity = db.Column(db.String(20), nullable=False)  # low, medium, high, critical
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Trigger conditions
    trigger_condition = db.Column(db.Text)  # What triggers this alert
    active_conditions = db.Column(db.Text)  # Current conditions that make this alert active
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, inactive, resolved
    is_emergency = db.Column(db.Boolean, default=False)
    
    # Notification settings
    notify_parent = db.Column(db.Boolean, default=True)
    notify_teachers = db.Column(db.Boolean, default=True)
    notify_medical_staff = db.Column(db.Boolean, default=True)
    notify_emergency_contacts = db.Column(db.Boolean, default=False)
    
    # Dates
    created_date = db.Column(db.Date, nullable=False)
    expiry_date = db.Column(db.Date)
    last_triggered = db.Column(db.DateTime)
    
    # Metadata
    created_by = db.Column(db.String(255))  # Staff member who created the alert
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'medical_record_id': self.medical_record_id,
            'alert_type': self.alert_type,
            'severity': self.severity,
            'title': self.title,
            'description': self.description,
            'trigger_condition': self.trigger_condition,
            'active_conditions': self.active_conditions,
            'status': self.status,
            'is_emergency': self.is_emergency,
            'notify_parent': self.notify_parent,
            'notify_teachers': self.notify_teachers,
            'notify_medical_staff': self.notify_medical_staff,
            'notify_emergency_contacts': self.notify_emergency_contacts,
            'created_date': self.created_date.isoformat(),
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'last_triggered': self.last_triggered.isoformat() if self.last_triggered else None,
            'created_by': self.created_by,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class MedicalStaff(db.Model):
    """Medical staff and healthcare providers"""
    __tablename__ = 'medical_staff'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Professional details
    license_number = db.Column(db.String(100), unique=True, nullable=False)
    license_type = db.Column(db.String(100), nullable=False)  # MD, RN, LPN, etc.
    license_expiry = db.Column(db.Date, nullable=False)
    specialization = db.Column(db.String(255))
    years_experience = db.Column(db.Integer, default=0)
    
    # Employment details
    hire_date = db.Column(db.Date, nullable=False)
    employment_type = db.Column(db.String(20), default='full_time')  # full_time, part_time, contract
    salary = db.Column(db.Numeric(10, 2))
    
    # Availability and schedule
    availability = db.Column(db.String(20), default='available')  # available, busy, off_duty
    working_hours = db.Column(db.Text)  # JSON string of working hours
    on_call = db.Column(db.Boolean, default=False)
    
    # Certifications and training
    certifications = db.Column(db.Text)  # JSON string of certifications
    training_records = db.Column(db.Text)  # JSON string of training
    cpr_certified = db.Column(db.Boolean, default=False)
    cpr_expiry = db.Column(db.Date)
    
    # Performance
    rating = db.Column(db.Float, default=0.0)  # 0-5 stars
    total_patients_seen = db.Column(db.Integer, default=0)
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, suspended, terminated
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='medical_staff_profile')
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'license_number': self.license_number,
            'license_type': self.license_type,
            'license_expiry': self.license_expiry.isoformat(),
            'specialization': self.specialization,
            'years_experience': self.years_experience,
            'hire_date': self.hire_date.isoformat(),
            'employment_type': self.employment_type,
            'salary': float(self.salary) if self.salary else None,
            'availability': self.availability,
            'working_hours': self.working_hours,
            'on_call': self.on_call,
            'certifications': self.certifications,
            'training_records': self.training_records,
            'cpr_certified': self.cpr_certified,
            'cpr_expiry': self.cpr_expiry.isoformat() if self.cpr_expiry else None,
            'rating': self.rating,
            'total_patients_seen': self.total_patients_seen,
            'status': self.status,
            'notes': self.notes,
            'user': self.user.to_dict() if self.user else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Indexes for better performance
Index('idx_medical_records_student', MedicalRecord.student_id)
Index('idx_vaccination_records_date', VaccinationRecord.vaccination_date)
Index('idx_medical_checkups_date', MedicalCheckup.checkup_date)
Index('idx_medical_incidents_date', MedicalIncident.incident_date)
Index('idx_prescriptions_status', Prescription.status)
Index('idx_medical_alerts_severity', MedicalAlert.severity)
Index('idx_medical_staff_status', MedicalStaff.status)
