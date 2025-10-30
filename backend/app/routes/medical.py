from flask import Blueprint, request, jsonify
from app import db
from app.models.medical import (
    MedicalRecord, VaccinationRecord, MedicalCheckup, MedicalIncident,
    Prescription, MedicalAlert, MedicalStaff
)
from app.models.user import User
from datetime import datetime, date
from sqlalchemy import and_, or_
import json

medical_bp = Blueprint('medical', __name__, url_prefix='/api/medical')

# ==================== MEDICAL RECORDS MANAGEMENT ====================

@medical_bp.route('/records', methods=['GET'])
def get_medical_records():
    """Get all medical records"""
    try:
        records = MedicalRecord.query.all()
        return jsonify({
            'success': True,
            'records': [record.to_dict() for record in records]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/records', methods=['POST'])
def create_medical_record():
    """Create a new medical record"""
    try:
        data = request.get_json()
        
        record = MedicalRecord(
            student_id=data['student_id'],
            blood_group=data.get('blood_group'),
            height_cm=data.get('height_cm'),
            weight_kg=data.get('weight_kg'),
            bmi=data.get('bmi'),
            allergies=json.dumps(data.get('allergies', [])),
            chronic_conditions=json.dumps(data.get('chronic_conditions', [])),
            disabilities=json.dumps(data.get('disabilities', [])),
            medications=json.dumps(data.get('medications', [])),
            emergency_contact_name=data.get('emergency_contact_name'),
            emergency_contact_phone=data.get('emergency_contact_phone'),
            emergency_contact_relationship=data.get('emergency_contact_relationship'),
            emergency_contact_address=data.get('emergency_contact_address'),
            insurance_provider=data.get('insurance_provider'),
            insurance_policy_number=data.get('insurance_policy_number'),
            insurance_group_number=data.get('insurance_group_number'),
            insurance_expiry_date=datetime.strptime(data['insurance_expiry_date'], '%Y-%m-%d').date() if data.get('insurance_expiry_date') else None,
            dietary_restrictions=data.get('dietary_restrictions'),
            physical_limitations=data.get('physical_limitations'),
            special_equipment_needed=data.get('special_equipment_needed'),
            status=data.get('status', 'active'),
            notes=data.get('notes')
        )
        
        db.session.add(record)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical record created successfully',
            'record': record.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/records/<int:record_id>', methods=['GET'])
def get_medical_record(record_id):
    """Get a specific medical record"""
    try:
        record = MedicalRecord.query.get_or_404(record_id)
        return jsonify({
            'success': True,
            'record': record.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/records/<int:record_id>', methods=['PUT'])
def update_medical_record(record_id):
    """Update a medical record"""
    try:
        record = MedicalRecord.query.get_or_404(record_id)
        data = request.get_json()
        
        # Update fields
        for field in ['student_id', 'blood_group', 'height_cm', 'weight_kg', 'bmi',
                     'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relationship',
                     'emergency_contact_address', 'insurance_provider', 'insurance_policy_number',
                     'insurance_group_number', 'dietary_restrictions', 'physical_limitations',
                     'special_equipment_needed', 'status', 'notes']:
            if field in data:
                setattr(record, field, data[field])
        
        # Update date fields
        if 'insurance_expiry_date' in data:
            record.insurance_expiry_date = datetime.strptime(data['insurance_expiry_date'], '%Y-%m-%d').date() if data['insurance_expiry_date'] else None
        
        # Update JSON fields
        for field in ['allergies', 'chronic_conditions', 'disabilities', 'medications']:
            if field in data:
                setattr(record, field, json.dumps(data[field]))
        
        record.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical record updated successfully',
            'record': record.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== VACCINATION MANAGEMENT ====================

@medical_bp.route('/vaccinations', methods=['GET'])
def get_vaccinations():
    """Get all vaccination records"""
    try:
        vaccinations = VaccinationRecord.query.all()
        return jsonify({
            'success': True,
            'vaccinations': [vaccination.to_dict() for vaccination in vaccinations]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/vaccinations', methods=['POST'])
def create_vaccination():
    """Create a new vaccination record"""
    try:
        data = request.get_json()
        
        vaccination = VaccinationRecord(
            medical_record_id=data['medical_record_id'],
            vaccine_name=data['vaccine_name'],
            vaccine_type=data.get('vaccine_type'),
            manufacturer=data.get('manufacturer'),
            batch_number=data.get('batch_number'),
            lot_number=data.get('lot_number'),
            vaccination_date=datetime.strptime(data['vaccination_date'], '%Y-%m-%d').date(),
            due_date=datetime.strptime(data['due_date'], '%Y-%m-%d').date() if data.get('due_date') else None,
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date() if data.get('expiry_date') else None,
            administered_by=data.get('administered_by'),
            administration_site=data.get('administration_site'),
            route=data.get('route'),
            dose=data.get('dose'),
            status=data.get('status', 'completed'),
            adverse_reactions=data.get('adverse_reactions'),
            contraindications=data.get('contraindications'),
            certificate_number=data.get('certificate_number'),
            provider_name=data.get('provider_name'),
            provider_license=data.get('provider_license'),
            notes=data.get('notes')
        )
        
        db.session.add(vaccination)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vaccination record created successfully',
            'vaccination': vaccination.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/vaccinations/<int:vaccination_id>', methods=['GET'])
def get_vaccination(vaccination_id):
    """Get a specific vaccination record"""
    try:
        vaccination = VaccinationRecord.query.get_or_404(vaccination_id)
        return jsonify({
            'success': True,
            'vaccination': vaccination.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== MEDICAL CHECKUPS ====================

@medical_bp.route('/checkups', methods=['GET'])
def get_checkups():
    """Get all medical checkups"""
    try:
        checkups = MedicalCheckup.query.all()
        return jsonify({
            'success': True,
            'checkups': [checkup.to_dict() for checkup in checkups]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/checkups', methods=['POST'])
def create_checkup():
    """Create a new medical checkup"""
    try:
        data = request.get_json()
        
        checkup = MedicalCheckup(
            medical_record_id=data['medical_record_id'],
            checkup_type=data['checkup_type'],
            checkup_date=datetime.strptime(data['checkup_date'], '%Y-%m-%d').date(),
            next_checkup_date=datetime.strptime(data['next_checkup_date'], '%Y-%m-%d').date() if data.get('next_checkup_date') else None,
            provider_name=data['provider_name'],
            provider_type=data.get('provider_type'),
            provider_license=data.get('provider_license'),
            facility_name=data.get('facility_name'),
            facility_address=data.get('facility_address'),
            height_cm=data.get('height_cm'),
            weight_kg=data.get('weight_kg'),
            bmi=data.get('bmi'),
            blood_pressure_systolic=data.get('blood_pressure_systolic'),
            blood_pressure_diastolic=data.get('blood_pressure_diastolic'),
            heart_rate=data.get('heart_rate'),
            temperature_celsius=data.get('temperature_celsius'),
            general_appearance=data.get('general_appearance'),
            cardiovascular=data.get('cardiovascular'),
            respiratory=data.get('respiratory'),
            gastrointestinal=data.get('gastrointestinal'),
            neurological=data.get('neurological'),
            musculoskeletal=data.get('musculoskeletal'),
            skin=data.get('skin'),
            eyes=data.get('eyes'),
            ears=data.get('ears'),
            throat=data.get('throat'),
            assessment=data.get('assessment'),
            recommendations=data.get('recommendations'),
            follow_up_required=data.get('follow_up_required', False),
            follow_up_date=datetime.strptime(data['follow_up_date'], '%Y-%m-%d').date() if data.get('follow_up_date') else None,
            status=data.get('status', 'completed'),
            notes=data.get('notes')
        )
        
        db.session.add(checkup)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical checkup created successfully',
            'checkup': checkup.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/checkups/<int:checkup_id>', methods=['GET'])
def get_checkup(checkup_id):
    """Get a specific medical checkup"""
    try:
        checkup = MedicalCheckup.query.get_or_404(checkup_id)
        return jsonify({
            'success': True,
            'checkup': checkup.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== MEDICAL INCIDENTS ====================

@medical_bp.route('/incidents', methods=['GET'])
def get_incidents():
    """Get all medical incidents"""
    try:
        incidents = MedicalIncident.query.all()
        return jsonify({
            'success': True,
            'incidents': [incident.to_dict() for incident in incidents]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/incidents', methods=['POST'])
def create_incident():
    """Create a new medical incident"""
    try:
        data = request.get_json()
        
        incident = MedicalIncident(
            medical_record_id=data['medical_record_id'],
            incident_date=datetime.fromisoformat(data['incident_date']),
            incident_type=data['incident_type'],
            severity=data['severity'],
            location=data.get('location'),
            description=data['description'],
            symptoms=data.get('symptoms'),
            cause=data.get('cause'),
            witnesses=data.get('witnesses'),
            first_aid_provided=data.get('first_aid_provided', False),
            first_aid_details=data.get('first_aid_details'),
            medical_treatment=data.get('medical_treatment'),
            medications_given=data.get('medications_given'),
            emergency_services_called=data.get('emergency_services_called', False),
            hospital_visit_required=data.get('hospital_visit_required', False),
            hospital_name=data.get('hospital_name'),
            hospital_admission=data.get('hospital_admission', False),
            discharge_date=datetime.strptime(data['discharge_date'], '%Y-%m-%d').date() if data.get('discharge_date') else None,
            follow_up_required=data.get('follow_up_required', False),
            follow_up_date=datetime.strptime(data['follow_up_date'], '%Y-%m-%d').date() if data.get('follow_up_date') else None,
            follow_up_notes=data.get('follow_up_notes'),
            reported_by=data.get('reported_by'),
            parent_notified=data.get('parent_notified', False),
            parent_notification_time=datetime.fromisoformat(data['parent_notification_time']) if data.get('parent_notification_time') else None,
            incident_report_filed=data.get('incident_report_filed', False),
            status=data.get('status', 'open'),
            notes=data.get('notes')
        )
        
        db.session.add(incident)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical incident created successfully',
            'incident': incident.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/incidents/<int:incident_id>', methods=['GET'])
def get_incident(incident_id):
    """Get a specific medical incident"""
    try:
        incident = MedicalIncident.query.get_or_404(incident_id)
        return jsonify({
            'success': True,
            'incident': incident.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== PRESCRIPTIONS ====================

@medical_bp.route('/prescriptions', methods=['GET'])
def get_prescriptions():
    """Get all prescriptions"""
    try:
        prescriptions = Prescription.query.all()
        return jsonify({
            'success': True,
            'prescriptions': [prescription.to_dict() for prescription in prescriptions]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/prescriptions', methods=['POST'])
def create_prescription():
    """Create a new prescription"""
    try:
        data = request.get_json()
        
        prescription = Prescription(
            medical_record_id=data['medical_record_id'],
            prescription_date=datetime.strptime(data['prescription_date'], '%Y-%m-%d').date(),
            prescribed_by=data['prescribed_by'],
            prescriber_license=data.get('prescriber_license'),
            facility_name=data.get('facility_name'),
            medication_name=data['medication_name'],
            generic_name=data.get('generic_name'),
            dosage=data['dosage'],
            frequency=data['frequency'],
            duration=data.get('duration'),
            quantity=data.get('quantity'),
            instructions=data.get('instructions'),
            special_instructions=data.get('special_instructions'),
            side_effects=data.get('side_effects'),
            contraindications=data.get('contraindications'),
            status=data.get('status', 'active'),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            refills_remaining=data.get('refills_remaining', 0),
            compliance_notes=data.get('compliance_notes'),
            pharmacy_name=data.get('pharmacy_name'),
            pharmacy_phone=data.get('pharmacy_phone'),
            prescription_number=data.get('prescription_number'),
            notes=data.get('notes')
        )
        
        db.session.add(prescription)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Prescription created successfully',
            'prescription': prescription.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/prescriptions/<int:prescription_id>', methods=['GET'])
def get_prescription(prescription_id):
    """Get a specific prescription"""
    try:
        prescription = Prescription.query.get_or_404(prescription_id)
        return jsonify({
            'success': True,
            'prescription': prescription.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== MEDICAL ALERTS ====================

@medical_bp.route('/alerts', methods=['GET'])
def get_alerts():
    """Get all medical alerts"""
    try:
        alerts = MedicalAlert.query.all()
        return jsonify({
            'success': True,
            'alerts': [alert.to_dict() for alert in alerts]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/alerts', methods=['POST'])
def create_alert():
    """Create a new medical alert"""
    try:
        data = request.get_json()
        
        alert = MedicalAlert(
            medical_record_id=data['medical_record_id'],
            alert_type=data['alert_type'],
            severity=data['severity'],
            title=data['title'],
            description=data['description'],
            trigger_condition=data.get('trigger_condition'),
            active_conditions=data.get('active_conditions'),
            status=data.get('status', 'active'),
            is_emergency=data.get('is_emergency', False),
            notify_parent=data.get('notify_parent', True),
            notify_teachers=data.get('notify_teachers', True),
            notify_medical_staff=data.get('notify_medical_staff', True),
            notify_emergency_contacts=data.get('notify_emergency_contacts', False),
            created_date=datetime.strptime(data['created_date'], '%Y-%m-%d').date(),
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date() if data.get('expiry_date') else None,
            last_triggered=datetime.fromisoformat(data['last_triggered']) if data.get('last_triggered') else None,
            created_by=data.get('created_by'),
            notes=data.get('notes')
        )
        
        db.session.add(alert)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical alert created successfully',
            'alert': alert.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/alerts/<int:alert_id>', methods=['GET'])
def get_alert(alert_id):
    """Get a specific medical alert"""
    try:
        alert = MedicalAlert.query.get_or_404(alert_id)
        return jsonify({
            'success': True,
            'alert': alert.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== MEDICAL STAFF MANAGEMENT ====================

@medical_bp.route('/staff', methods=['GET'])
def get_medical_staff():
    """Get all medical staff"""
    try:
        staff = MedicalStaff.query.all()
        return jsonify({
            'success': True,
            'staff': [member.to_dict() for member in staff]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/staff', methods=['POST'])
def create_medical_staff():
    """Create a new medical staff member"""
    try:
        data = request.get_json()
        
        staff = MedicalStaff(
            user_id=data['user_id'],
            license_number=data['license_number'],
            license_type=data['license_type'],
            license_expiry=datetime.strptime(data['license_expiry'], '%Y-%m-%d').date(),
            specialization=data.get('specialization'),
            years_experience=data.get('years_experience', 0),
            hire_date=datetime.strptime(data['hire_date'], '%Y-%m-%d').date(),
            employment_type=data.get('employment_type', 'full_time'),
            salary=data.get('salary'),
            availability=data.get('availability', 'available'),
            working_hours=json.dumps(data.get('working_hours', {})),
            on_call=data.get('on_call', False),
            certifications=json.dumps(data.get('certifications', [])),
            training_records=json.dumps(data.get('training_records', [])),
            cpr_certified=data.get('cpr_certified', False),
            cpr_expiry=datetime.strptime(data['cpr_expiry'], '%Y-%m-%d').date() if data.get('cpr_expiry') else None,
            rating=data.get('rating', 0.0),
            total_patients_seen=data.get('total_patients_seen', 0),
            status=data.get('status', 'active'),
            notes=data.get('notes')
        )
        
        db.session.add(staff)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Medical staff created successfully',
            'staff': staff.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@medical_bp.route('/staff/<int:staff_id>', methods=['GET'])
def get_medical_staff_member(staff_id):
    """Get a specific medical staff member"""
    try:
        staff = MedicalStaff.query.get_or_404(staff_id)
        return jsonify({
            'success': True,
            'staff': staff.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DASHBOARD STATISTICS ====================

@medical_bp.route('/dashboard', methods=['GET'])
def get_medical_dashboard():
    """Get medical dashboard statistics"""
    try:
        # Medical records statistics
        total_records = MedicalRecord.query.count()
        active_records = MedicalRecord.query.filter_by(status='active').count()
        
        # Vaccination statistics
        total_vaccinations = VaccinationRecord.query.count()
        completed_vaccinations = VaccinationRecord.query.filter_by(status='completed').count()
        overdue_vaccinations = VaccinationRecord.query.filter(
            and_(VaccinationRecord.due_date < date.today(), VaccinationRecord.status != 'completed')
        ).count()
        
        # Checkup statistics
        total_checkups = MedicalCheckup.query.count()
        this_month_checkups = MedicalCheckup.query.filter(
            and_(MedicalCheckup.checkup_date >= date.today().replace(day=1),
                 MedicalCheckup.checkup_date <= date.today())
        ).count()
        upcoming_checkups = MedicalCheckup.query.filter(
            and_(MedicalCheckup.next_checkup_date >= date.today(),
                 MedicalCheckup.next_checkup_date <= date.today().replace(day=1) + datetime.timedelta(days=30))
        ).count()
        
        # Incident statistics
        total_incidents = MedicalIncident.query.count()
        this_month_incidents = MedicalIncident.query.filter(
            and_(MedicalIncident.incident_date >= datetime.combine(date.today().replace(day=1), datetime.min.time()),
                 MedicalIncident.incident_date <= datetime.now())
        ).count()
        critical_incidents = MedicalIncident.query.filter_by(severity='critical').count()
        
        # Prescription statistics
        total_prescriptions = Prescription.query.count()
        active_prescriptions = Prescription.query.filter_by(status='active').count()
        expired_prescriptions = Prescription.query.filter(
            and_(Prescription.end_date < date.today(), Prescription.status == 'active')
        ).count()
        
        # Alert statistics
        total_alerts = MedicalAlert.query.count()
        active_alerts = MedicalAlert.query.filter_by(status='active').count()
        emergency_alerts = MedicalAlert.query.filter_by(is_emergency=True).count()
        
        # Staff statistics
        total_staff = MedicalStaff.query.count()
        active_staff = MedicalStaff.query.filter_by(status='active').count()
        available_staff = MedicalStaff.query.filter_by(availability='available').count()
        
        return jsonify({
            'success': True,
            'dashboard': {
                'records': {
                    'total': total_records,
                    'active': active_records
                },
                'vaccinations': {
                    'total': total_vaccinations,
                    'completed': completed_vaccinations,
                    'overdue': overdue_vaccinations,
                    'completion_rate': round((completed_vaccinations / total_vaccinations * 100) if total_vaccinations > 0 else 0, 2)
                },
                'checkups': {
                    'total': total_checkups,
                    'this_month': this_month_checkups,
                    'upcoming': upcoming_checkups
                },
                'incidents': {
                    'total': total_incidents,
                    'this_month': this_month_incidents,
                    'critical': critical_incidents
                },
                'prescriptions': {
                    'total': total_prescriptions,
                    'active': active_prescriptions,
                    'expired': expired_prescriptions
                },
                'alerts': {
                    'total': total_alerts,
                    'active': active_alerts,
                    'emergency': emergency_alerts
                },
                'staff': {
                    'total': total_staff,
                    'active': active_staff,
                    'available': available_staff
                }
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== SEARCH AND FILTERING ====================

@medical_bp.route('/search', methods=['GET'])
def search_medical_records():
    """Search medical records"""
    try:
        query = request.args.get('q', '')
        student_id = request.args.get('student_id')
        blood_group = request.args.get('blood_group')
        has_allergies = request.args.get('has_allergies')
        has_conditions = request.args.get('has_conditions')
        
        records = MedicalRecord.query
        
        if query:
            records = records.join(User).filter(
                or_(User.name.ilike(f'%{query}%'), User.email.ilike(f'%{query}%'))
            )
        
        if student_id:
            records = records.filter_by(student_id=student_id)
        
        if blood_group:
            records = records.filter_by(blood_group=blood_group)
        
        if has_allergies == 'true':
            records = records.filter(MedicalRecord.allergies != '[]')
        
        if has_conditions == 'true':
            records = records.filter(MedicalRecord.chronic_conditions != '[]')
        
        results = records.all()
        
        return jsonify({
            'success': True,
            'records': [record.to_dict() for record in results],
            'count': len(results)
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
