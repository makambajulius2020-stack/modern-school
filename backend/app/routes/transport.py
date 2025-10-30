from flask import Blueprint, request, jsonify
from app import db
from app.models.transport import (
    TransportVehicle, TransportDriver, TransportRoute, 
    StudentTransport, TransportTrip, TransportAttendance, VehicleMaintenance
)
from app.models.user import User
from datetime import datetime, date, time
from sqlalchemy import and_, or_
import json

transport_bp = Blueprint('transport', __name__, url_prefix='/api/transport')

# ==================== VEHICLE MANAGEMENT ====================

@transport_bp.route('/vehicles', methods=['GET'])
def get_vehicles():
    """Get all transport vehicles"""
    try:
        vehicles = TransportVehicle.query.all()
        return jsonify({
            'success': True,
            'vehicles': [vehicle.to_dict() for vehicle in vehicles]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/vehicles', methods=['POST'])
def create_vehicle():
    """Create a new transport vehicle"""
    try:
        data = request.get_json()
        
        vehicle = TransportVehicle(
            vehicle_number=data['vehicle_number'],
            vehicle_type=data['vehicle_type'],
            capacity=data['capacity'],
            make=data.get('make'),
            model=data.get('model'),
            year=data.get('year'),
            license_plate=data['license_plate'],
            insurance_number=data.get('insurance_number'),
            insurance_expiry=datetime.strptime(data['insurance_expiry'], '%Y-%m-%d').date() if data.get('insurance_expiry') else None,
            registration_expiry=datetime.strptime(data['registration_expiry'], '%Y-%m-%d').date() if data.get('registration_expiry') else None,
            fuel_type=data.get('fuel_type'),
            mileage=data.get('mileage', 0),
            status=data.get('status', 'active'),
            last_service_date=datetime.strptime(data['last_service_date'], '%Y-%m-%d').date() if data.get('last_service_date') else None,
            next_service_date=datetime.strptime(data['next_service_date'], '%Y-%m-%d').date() if data.get('next_service_date') else None,
            service_interval_km=data.get('service_interval_km', 10000),
            current_location=data.get('current_location'),
            gps_enabled=data.get('gps_enabled', True),
            tracking_device_id=data.get('tracking_device_id'),
            purchase_date=datetime.strptime(data['purchase_date'], '%Y-%m-%d').date() if data.get('purchase_date') else None,
            purchase_price=data.get('purchase_price'),
            current_value=data.get('current_value'),
            monthly_depreciation=data.get('monthly_depreciation'),
            notes=data.get('notes')
        )
        
        db.session.add(vehicle)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vehicle created successfully',
            'vehicle': vehicle.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/vehicles/<int:vehicle_id>', methods=['GET'])
def get_vehicle(vehicle_id):
    """Get a specific vehicle"""
    try:
        vehicle = TransportVehicle.query.get_or_404(vehicle_id)
        return jsonify({
            'success': True,
            'vehicle': vehicle.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/vehicles/<int:vehicle_id>', methods=['PUT'])
def update_vehicle(vehicle_id):
    """Update a vehicle"""
    try:
        vehicle = TransportVehicle.query.get_or_404(vehicle_id)
        data = request.get_json()
        
        # Update fields
        for field in ['vehicle_number', 'vehicle_type', 'capacity', 'make', 'model', 'year',
                     'license_plate', 'insurance_number', 'fuel_type', 'mileage', 'status',
                     'current_location', 'gps_enabled', 'tracking_device_id', 'notes']:
            if field in data:
                setattr(vehicle, field, data[field])
        
        # Update date fields
        if 'insurance_expiry' in data:
            vehicle.insurance_expiry = datetime.strptime(data['insurance_expiry'], '%Y-%m-%d').date() if data['insurance_expiry'] else None
        if 'registration_expiry' in data:
            vehicle.registration_expiry = datetime.strptime(data['registration_expiry'], '%Y-%m-%d').date() if data['registration_expiry'] else None
        if 'last_service_date' in data:
            vehicle.last_service_date = datetime.strptime(data['last_service_date'], '%Y-%m-%d').date() if data['last_service_date'] else None
        if 'next_service_date' in data:
            vehicle.next_service_date = datetime.strptime(data['next_service_date'], '%Y-%m-%d').date() if data['next_service_date'] else None
        
        # Update numeric fields
        for field in ['service_interval_km', 'purchase_price', 'current_value', 'monthly_depreciation']:
            if field in data:
                setattr(vehicle, field, data[field])
        
        vehicle.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vehicle updated successfully',
            'vehicle': vehicle.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/vehicles/<int:vehicle_id>', methods=['DELETE'])
def delete_vehicle(vehicle_id):
    """Delete a vehicle"""
    try:
        vehicle = TransportVehicle.query.get_or_404(vehicle_id)
        db.session.delete(vehicle)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Vehicle deleted successfully'
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DRIVER MANAGEMENT ====================

@transport_bp.route('/drivers', methods=['GET'])
def get_drivers():
    """Get all transport drivers"""
    try:
        drivers = TransportDriver.query.all()
        return jsonify({
            'success': True,
            'drivers': [driver.to_dict() for driver in drivers]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/drivers', methods=['POST'])
def create_driver():
    """Create a new transport driver"""
    try:
        data = request.get_json()
        
        driver = TransportDriver(
            user_id=data['user_id'],
            vehicle_id=data.get('vehicle_id'),
            license_number=data['license_number'],
            license_class=data['license_class'],
            license_expiry=datetime.strptime(data['license_expiry'], '%Y-%m-%d').date(),
            experience_years=data.get('experience_years', 0),
            hire_date=datetime.strptime(data['hire_date'], '%Y-%m-%d').date(),
            salary=data.get('salary'),
            employment_type=data.get('employment_type', 'full_time'),
            medical_certificate_expiry=datetime.strptime(data['medical_certificate_expiry'], '%Y-%m-%d').date() if data.get('medical_certificate_expiry') else None,
            background_check_date=datetime.strptime(data['background_check_date'], '%Y-%m-%d').date() if data.get('background_check_date') else None,
            drug_test_date=datetime.strptime(data['drug_test_date'], '%Y-%m-%d').date() if data.get('drug_test_date') else None,
            training_certificates=json.dumps(data.get('training_certificates', [])),
            rating=data.get('rating', 0.0),
            status=data.get('status', 'active'),
            availability=data.get('availability', 'available'),
            notes=data.get('notes')
        )
        
        db.session.add(driver)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Driver created successfully',
            'driver': driver.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/drivers/<int:driver_id>', methods=['GET'])
def get_driver(driver_id):
    """Get a specific driver"""
    try:
        driver = TransportDriver.query.get_or_404(driver_id)
        return jsonify({
            'success': True,
            'driver': driver.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/drivers/<int:driver_id>', methods=['PUT'])
def update_driver(driver_id):
    """Update a driver"""
    try:
        driver = TransportDriver.query.get_or_404(driver_id)
        data = request.get_json()
        
        # Update fields
        for field in ['user_id', 'vehicle_id', 'license_number', 'license_class', 'experience_years',
                     'salary', 'employment_type', 'rating', 'status', 'availability', 'notes']:
            if field in data:
                setattr(driver, field, data[field])
        
        # Update date fields
        if 'license_expiry' in data:
            driver.license_expiry = datetime.strptime(data['license_expiry'], '%Y-%m-%d').date()
        if 'hire_date' in data:
            driver.hire_date = datetime.strptime(data['hire_date'], '%Y-%m-%d').date()
        if 'medical_certificate_expiry' in data:
            driver.medical_certificate_expiry = datetime.strptime(data['medical_certificate_expiry'], '%Y-%m-%d').date() if data['medical_certificate_expiry'] else None
        if 'background_check_date' in data:
            driver.background_check_date = datetime.strptime(data['background_check_date'], '%Y-%m-%d').date() if data['background_check_date'] else None
        if 'drug_test_date' in data:
            driver.drug_test_date = datetime.strptime(data['drug_test_date'], '%Y-%m-%d').date() if data['drug_test_date'] else None
        
        # Update JSON fields
        if 'training_certificates' in data:
            driver.training_certificates = json.dumps(data['training_certificates'])
        
        driver.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Driver updated successfully',
            'driver': driver.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ROUTE MANAGEMENT ====================

@transport_bp.route('/routes', methods=['GET'])
def get_routes():
    """Get all transport routes"""
    try:
        routes = TransportRoute.query.all()
        return jsonify({
            'success': True,
            'routes': [route.to_dict() for route in routes]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/routes', methods=['POST'])
def create_route():
    """Create a new transport route"""
    try:
        data = request.get_json()
        
        route = TransportRoute(
            route_name=data['route_name'],
            route_number=data['route_number'],
            vehicle_id=data.get('vehicle_id'),
            driver_id=data.get('driver_id'),
            start_location=data['start_location'],
            end_location=data['end_location'],
            waypoints=json.dumps(data.get('waypoints', [])),
            total_distance_km=data.get('total_distance_km'),
            estimated_duration_minutes=data.get('estimated_duration_minutes'),
            pickup_time=datetime.strptime(data['pickup_time'], '%H:%M').time(),
            dropoff_time=datetime.strptime(data['dropoff_time'], '%H:%M').time(),
            operating_days=data.get('operating_days', 'mon-fri'),
            max_capacity=data['max_capacity'],
            current_enrollment=data.get('current_enrollment', 0),
            monthly_fee=data['monthly_fee'],
            status=data.get('status', 'active'),
            is_primary=data.get('is_primary', False),
            description=data.get('description'),
            notes=data.get('notes')
        )
        
        db.session.add(route)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Route created successfully',
            'route': route.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/routes/<int:route_id>', methods=['GET'])
def get_route(route_id):
    """Get a specific route"""
    try:
        route = TransportRoute.query.get_or_404(route_id)
        return jsonify({
            'success': True,
            'route': route.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/routes/<int:route_id>', methods=['PUT'])
def update_route(route_id):
    """Update a route"""
    try:
        route = TransportRoute.query.get_or_404(route_id)
        data = request.get_json()
        
        # Update fields
        for field in ['route_name', 'route_number', 'vehicle_id', 'driver_id', 'start_location',
                     'end_location', 'total_distance_km', 'estimated_duration_minutes', 'operating_days',
                     'max_capacity', 'current_enrollment', 'monthly_fee', 'status', 'is_primary',
                     'description', 'notes']:
            if field in data:
                setattr(route, field, data[field])
        
        # Update time fields
        if 'pickup_time' in data:
            route.pickup_time = datetime.strptime(data['pickup_time'], '%H:%M').time()
        if 'dropoff_time' in data:
            route.dropoff_time = datetime.strptime(data['dropoff_time'], '%H:%M').time()
        
        # Update JSON fields
        if 'waypoints' in data:
            route.waypoints = json.dumps(data['waypoints'])
        
        route.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Route updated successfully',
            'route': route.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== STUDENT TRANSPORT ASSIGNMENTS ====================

@transport_bp.route('/student-assignments', methods=['GET'])
def get_student_assignments():
    """Get all student transport assignments"""
    try:
        assignments = StudentTransport.query.all()
        return jsonify({
            'success': True,
            'assignments': [assignment.to_dict() for assignment in assignments]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/student-assignments', methods=['POST'])
def create_student_assignment():
    """Create a new student transport assignment"""
    try:
        data = request.get_json()
        
        assignment = StudentTransport(
            student_id=data['student_id'],
            route_id=data['route_id'],
            pickup_location=data.get('pickup_location'),
            dropoff_location=data.get('dropoff_location'),
            pickup_contact=data.get('pickup_contact'),
            emergency_contact=data.get('emergency_contact'),
            status=data.get('status', 'active'),
            start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date(),
            end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
            monthly_fee=data.get('monthly_fee'),
            payment_status=data.get('payment_status', 'pending'),
            last_payment_date=datetime.strptime(data['last_payment_date'], '%Y-%m-%d').date() if data.get('last_payment_date') else None,
            special_needs=data.get('special_needs'),
            medical_conditions=data.get('medical_conditions'),
            allergies=data.get('allergies'),
            notes=data.get('notes')
        )
        
        db.session.add(assignment)
        
        # Update route enrollment count
        route = TransportRoute.query.get(data['route_id'])
        if route:
            route.current_enrollment += 1
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Student transport assignment created successfully',
            'assignment': assignment.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/student-assignments/<int:assignment_id>', methods=['GET'])
def get_student_assignment(assignment_id):
    """Get a specific student transport assignment"""
    try:
        assignment = StudentTransport.query.get_or_404(assignment_id)
        return jsonify({
            'success': True,
            'assignment': assignment.to_dict()
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/student-assignments/<int:assignment_id>', methods=['PUT'])
def update_student_assignment(assignment_id):
    """Update a student transport assignment"""
    try:
        assignment = StudentTransport.query.get_or_404(assignment_id)
        data = request.get_json()
        
        # Update fields
        for field in ['student_id', 'route_id', 'pickup_location', 'dropoff_location', 'pickup_contact',
                     'emergency_contact', 'status', 'monthly_fee', 'payment_status', 'special_needs',
                     'medical_conditions', 'allergies', 'notes']:
            if field in data:
                setattr(assignment, field, data[field])
        
        # Update date fields
        if 'start_date' in data:
            assignment.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if 'end_date' in data:
            assignment.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data['end_date'] else None
        if 'last_payment_date' in data:
            assignment.last_payment_date = datetime.strptime(data['last_payment_date'], '%Y-%m-%d').date() if data['last_payment_date'] else None
        
        assignment.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Student transport assignment updated successfully',
            'assignment': assignment.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== TRIP MANAGEMENT ====================

@transport_bp.route('/trips', methods=['GET'])
def get_trips():
    """Get all transport trips"""
    try:
        trips = TransportTrip.query.all()
        return jsonify({
            'success': True,
            'trips': [trip.to_dict() for trip in trips]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/trips', methods=['POST'])
def create_trip():
    """Create a new transport trip"""
    try:
        data = request.get_json()
        
        trip = TransportTrip(
            route_id=data['route_id'],
            driver_id=data['driver_id'],
            vehicle_id=data['vehicle_id'],
            trip_date=datetime.strptime(data['trip_date'], '%Y-%m-%d').date(),
            trip_type=data['trip_type'],
            scheduled_start_time=datetime.strptime(data['scheduled_start_time'], '%H:%M').time(),
            actual_start_time=datetime.strptime(data['actual_start_time'], '%H:%M').time() if data.get('actual_start_time') else None,
            scheduled_end_time=datetime.strptime(data['scheduled_end_time'], '%H:%M').time(),
            actual_end_time=datetime.strptime(data['actual_end_time'], '%H:%M').time() if data.get('actual_end_time') else None,
            start_location=data.get('start_location'),
            end_location=data.get('end_location'),
            waypoints=json.dumps(data.get('waypoints', [])),
            expected_passengers=data.get('expected_passengers', 0),
            actual_passengers=data.get('actual_passengers', 0),
            status=data.get('status', 'scheduled'),
            delay_minutes=data.get('delay_minutes', 0),
            issues=data.get('issues'),
            weather_conditions=data.get('weather_conditions'),
            fuel_consumed=data.get('fuel_consumed'),
            mileage_start=data.get('mileage_start'),
            mileage_end=data.get('mileage_end'),
            notes=data.get('notes')
        )
        
        db.session.add(trip)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Trip created successfully',
            'trip': trip.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ATTENDANCE TRACKING ====================

@transport_bp.route('/attendance', methods=['GET'])
def get_transport_attendance():
    """Get transport attendance records"""
    try:
        attendance_records = TransportAttendance.query.all()
        return jsonify({
            'success': True,
            'attendance': [record.to_dict() for record in attendance_records]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/attendance', methods=['POST'])
def create_transport_attendance():
    """Create a new transport attendance record"""
    try:
        data = request.get_json()
        
        attendance = TransportAttendance(
            student_transport_id=data['student_transport_id'],
            trip_id=data['trip_id'],
            attendance_date=datetime.strptime(data['attendance_date'], '%Y-%m-%d').date(),
            attendance_type=data['attendance_type'],
            status=data['status'],
            check_in_time=datetime.fromisoformat(data['check_in_time']) if data.get('check_in_time') else None,
            check_out_time=datetime.fromisoformat(data['check_out_time']) if data.get('check_out_time') else None,
            check_in_location=data.get('check_in_location'),
            check_out_location=data.get('check_out_location'),
            verified_by=data.get('verified_by'),
            notes=data.get('notes'),
            parent_notified=data.get('parent_notified', False),
            notification_sent_at=datetime.fromisoformat(data['notification_sent_at']) if data.get('notification_sent_at') else None
        )
        
        db.session.add(attendance)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Transport attendance record created successfully',
            'attendance': attendance.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== MAINTENANCE MANAGEMENT ====================

@transport_bp.route('/maintenance', methods=['GET'])
def get_maintenance_records():
    """Get all vehicle maintenance records"""
    try:
        maintenance_records = VehicleMaintenance.query.all()
        return jsonify({
            'success': True,
            'maintenance': [record.to_dict() for record in maintenance_records]
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@transport_bp.route('/maintenance', methods=['POST'])
def create_maintenance_record():
    """Create a new maintenance record"""
    try:
        data = request.get_json()
        
        maintenance = VehicleMaintenance(
            vehicle_id=data['vehicle_id'],
            maintenance_type=data['maintenance_type'],
            service_type=data.get('service_type'),
            description=data['description'],
            scheduled_date=datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date() if data.get('scheduled_date') else None,
            completed_date=datetime.strptime(data['completed_date'], '%Y-%m-%d').date() if data.get('completed_date') else None,
            mileage_at_service=data.get('mileage_at_service'),
            service_provider=data.get('service_provider'),
            service_location=data.get('service_location'),
            technician_name=data.get('technician_name'),
            labor_cost=data.get('labor_cost'),
            parts_cost=data.get('parts_cost'),
            total_cost=data.get('total_cost'),
            parts_replaced=json.dumps(data.get('parts_replaced', [])),
            work_performed=data.get('work_performed'),
            status=data.get('status', 'scheduled'),
            next_service_date=datetime.strptime(data['next_service_date'], '%Y-%m-%d').date() if data.get('next_service_date') else None,
            next_service_mileage=data.get('next_service_mileage'),
            notes=data.get('notes')
        )
        
        db.session.add(maintenance)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Maintenance record created successfully',
            'maintenance': maintenance.to_dict()
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DASHBOARD STATISTICS ====================

@transport_bp.route('/dashboard', methods=['GET'])
def get_transport_dashboard():
    """Get transport dashboard statistics"""
    try:
        # Vehicle statistics
        total_vehicles = TransportVehicle.query.count()
        active_vehicles = TransportVehicle.query.filter_by(status='active').count()
        maintenance_vehicles = TransportVehicle.query.filter_by(status='maintenance').count()
        
        # Driver statistics
        total_drivers = TransportDriver.query.count()
        active_drivers = TransportDriver.query.filter_by(status='active').count()
        available_drivers = TransportDriver.query.filter_by(availability='available').count()
        
        # Route statistics
        total_routes = TransportRoute.query.count()
        active_routes = TransportRoute.query.filter_by(status='active').count()
        total_capacity = db.session.query(db.func.sum(TransportRoute.max_capacity)).scalar() or 0
        total_enrollment = db.session.query(db.func.sum(TransportRoute.current_enrollment)).scalar() or 0
        
        # Trip statistics (today)
        today = date.today()
        today_trips = TransportTrip.query.filter_by(trip_date=today).count()
        completed_trips = TransportTrip.query.filter(
            and_(TransportTrip.trip_date == today, TransportTrip.status == 'completed')
        ).count()
        
        # Maintenance statistics
        pending_maintenance = VehicleMaintenance.query.filter_by(status='scheduled').count()
        overdue_maintenance = VehicleMaintenance.query.filter(
            and_(VehicleMaintenance.status == 'scheduled', VehicleMaintenance.scheduled_date < today)
        ).count()
        
        return jsonify({
            'success': True,
            'dashboard': {
                'vehicles': {
                    'total': total_vehicles,
                    'active': active_vehicles,
                    'maintenance': maintenance_vehicles
                },
                'drivers': {
                    'total': total_drivers,
                    'active': active_drivers,
                    'available': available_drivers
                },
                'routes': {
                    'total': total_routes,
                    'active': active_routes,
                    'total_capacity': total_capacity,
                    'total_enrollment': total_enrollment,
                    'utilization_rate': round((total_enrollment / total_capacity * 100) if total_capacity > 0 else 0, 2)
                },
                'trips': {
                    'today_total': today_trips,
                    'today_completed': completed_trips,
                    'completion_rate': round((completed_trips / today_trips * 100) if today_trips > 0 else 0, 2)
                },
                'maintenance': {
                    'pending': pending_maintenance,
                    'overdue': overdue_maintenance
                }
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
