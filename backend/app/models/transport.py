from app import db
from datetime import datetime
from sqlalchemy import Index

class TransportVehicle(db.Model):
    """Transport vehicles (buses, vans, etc.)"""
    __tablename__ = 'transport_vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    vehicle_number = db.Column(db.String(20), unique=True, nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)  # bus, van, car
    capacity = db.Column(db.Integer, nullable=False)
    make = db.Column(db.String(100))
    model = db.Column(db.String(100))
    year = db.Column(db.Integer)
    license_plate = db.Column(db.String(20), unique=True, nullable=False)
    insurance_number = db.Column(db.String(100))
    insurance_expiry = db.Column(db.Date)
    registration_expiry = db.Column(db.Date)
    fuel_type = db.Column(db.String(20))  # petrol, diesel, electric
    mileage = db.Column(db.Integer, default=0)
    
    # Status and maintenance
    status = db.Column(db.String(20), default='active')  # active, maintenance, retired
    last_service_date = db.Column(db.Date)
    next_service_date = db.Column(db.Date)
    service_interval_km = db.Column(db.Integer, default=10000)
    
    # Location and tracking
    current_location = db.Column(db.String(255))
    gps_enabled = db.Column(db.Boolean, default=True)
    tracking_device_id = db.Column(db.String(100))
    
    # Financial
    purchase_date = db.Column(db.Date)
    purchase_price = db.Column(db.Numeric(12, 2))
    current_value = db.Column(db.Numeric(12, 2))
    monthly_depreciation = db.Column(db.Numeric(10, 2))
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    routes = db.relationship('TransportRoute', backref='vehicle', lazy=True)
    drivers = db.relationship('TransportDriver', backref='vehicle', lazy=True)
    maintenance_records = db.relationship('VehicleMaintenance', backref='vehicle', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'vehicle_number': self.vehicle_number,
            'vehicle_type': self.vehicle_type,
            'capacity': self.capacity,
            'make': self.make,
            'model': self.model,
            'year': self.year,
            'license_plate': self.license_plate,
            'insurance_number': self.insurance_number,
            'insurance_expiry': self.insurance_expiry.isoformat() if self.insurance_expiry else None,
            'registration_expiry': self.registration_expiry.isoformat() if self.registration_expiry else None,
            'fuel_type': self.fuel_type,
            'mileage': self.mileage,
            'status': self.status,
            'last_service_date': self.last_service_date.isoformat() if self.last_service_date else None,
            'next_service_date': self.next_service_date.isoformat() if self.next_service_date else None,
            'current_location': self.current_location,
            'gps_enabled': self.gps_enabled,
            'purchase_date': self.purchase_date.isoformat() if self.purchase_date else None,
            'purchase_price': float(self.purchase_price) if self.purchase_price else None,
            'current_value': float(self.current_value) if self.current_value else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TransportDriver(db.Model):
    """Transport drivers"""
    __tablename__ = 'transport_drivers'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('transport_vehicles.id'))
    
    # Driver details
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    license_class = db.Column(db.String(10), nullable=False)  # B, C, D, etc.
    license_expiry = db.Column(db.Date, nullable=False)
    experience_years = db.Column(db.Integer, default=0)
    
    # Employment details
    hire_date = db.Column(db.Date, nullable=False)
    salary = db.Column(db.Numeric(10, 2))
    employment_type = db.Column(db.String(20), default='full_time')  # full_time, part_time, contract
    
    # Safety and compliance
    medical_certificate_expiry = db.Column(db.Date)
    background_check_date = db.Column(db.Date)
    drug_test_date = db.Column(db.Date)
    training_certificates = db.Column(db.Text)  # JSON string of certificates
    
    # Performance tracking
    rating = db.Column(db.Float, default=0.0)  # 0-5 stars
    total_trips = db.Column(db.Integer, default=0)
    accident_count = db.Column(db.Integer, default=0)
    violation_count = db.Column(db.Integer, default=0)
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, suspended, terminated
    availability = db.Column(db.String(20), default='available')  # available, busy, off_duty
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='driver_profile')
    routes = db.relationship('TransportRoute', backref='driver', lazy=True)
    trips = db.relationship('TransportTrip', backref='driver', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'vehicle_id': self.vehicle_id,
            'license_number': self.license_number,
            'license_class': self.license_class,
            'license_expiry': self.license_expiry.isoformat(),
            'experience_years': self.experience_years,
            'hire_date': self.hire_date.isoformat(),
            'salary': float(self.salary) if self.salary else None,
            'employment_type': self.employment_type,
            'medical_certificate_expiry': self.medical_certificate_expiry.isoformat() if self.medical_certificate_expiry else None,
            'rating': self.rating,
            'total_trips': self.total_trips,
            'accident_count': self.accident_count,
            'violation_count': self.violation_count,
            'status': self.status,
            'availability': self.availability,
            'notes': self.notes,
            'user': self.user.to_dict() if self.user else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TransportRoute(db.Model):
    """Transport routes"""
    __tablename__ = 'transport_routes'
    
    id = db.Column(db.Integer, primary_key=True)
    route_name = db.Column(db.String(100), nullable=False)
    route_number = db.Column(db.String(20), unique=True, nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('transport_vehicles.id'))
    driver_id = db.Column(db.Integer, db.ForeignKey('transport_drivers.id'))
    
    # Route details
    start_location = db.Column(db.String(255), nullable=False)
    end_location = db.Column(db.String(255), nullable=False)
    waypoints = db.Column(db.Text)  # JSON string of waypoints
    total_distance_km = db.Column(db.Float)
    estimated_duration_minutes = db.Column(db.Integer)
    
    # Schedule
    pickup_time = db.Column(db.Time, nullable=False)
    dropoff_time = db.Column(db.Time, nullable=False)
    operating_days = db.Column(db.String(20), default='mon-fri')  # mon-fri, daily, custom
    
    # Capacity and pricing
    max_capacity = db.Column(db.Integer, nullable=False)
    current_enrollment = db.Column(db.Integer, default=0)
    monthly_fee = db.Column(db.Numeric(10, 2), nullable=False)
    
    # Status
    status = db.Column(db.String(20), default='active')  # active, inactive, suspended
    is_primary = db.Column(db.Boolean, default=False)
    
    # Metadata
    description = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    students = db.relationship('StudentTransport', backref='route', lazy=True)
    trips = db.relationship('TransportTrip', backref='route', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'route_name': self.route_name,
            'route_number': self.route_number,
            'vehicle_id': self.vehicle_id,
            'driver_id': self.driver_id,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'total_distance_km': self.total_distance_km,
            'estimated_duration_minutes': self.estimated_duration_minutes,
            'pickup_time': self.pickup_time.strftime('%H:%M') if self.pickup_time else None,
            'dropoff_time': self.dropoff_time.strftime('%H:%M') if self.dropoff_time else None,
            'operating_days': self.operating_days,
            'max_capacity': self.max_capacity,
            'current_enrollment': self.current_enrollment,
            'monthly_fee': float(self.monthly_fee) if self.monthly_fee else None,
            'status': self.status,
            'is_primary': self.is_primary,
            'description': self.description,
            'notes': self.notes,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'driver': self.driver.to_dict() if self.driver else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class StudentTransport(db.Model):
    """Student transport assignments"""
    __tablename__ = 'student_transport'
    
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    route_id = db.Column(db.Integer, db.ForeignKey('transport_routes.id'), nullable=False)
    
    # Assignment details
    pickup_location = db.Column(db.String(255))
    dropoff_location = db.Column(db.String(255))
    pickup_contact = db.Column(db.String(255))  # Parent/guardian contact at pickup
    emergency_contact = db.Column(db.String(255))
    
    # Status and dates
    status = db.Column(db.String(20), default='active')  # active, suspended, terminated
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    
    # Payment
    monthly_fee = db.Column(db.Numeric(10, 2))
    payment_status = db.Column(db.String(20), default='pending')  # pending, paid, overdue
    last_payment_date = db.Column(db.Date)
    
    # Special requirements
    special_needs = db.Column(db.Text)
    medical_conditions = db.Column(db.Text)
    allergies = db.Column(db.Text)
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    student = db.relationship('User', backref='transport_assignment')
    attendance_records = db.relationship('TransportAttendance', backref='student_transport', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_id': self.student_id,
            'route_id': self.route_id,
            'pickup_location': self.pickup_location,
            'dropoff_location': self.dropoff_location,
            'pickup_contact': self.pickup_contact,
            'emergency_contact': self.emergency_contact,
            'status': self.status,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'monthly_fee': float(self.monthly_fee) if self.monthly_fee else None,
            'payment_status': self.payment_status,
            'last_payment_date': self.last_payment_date.isoformat() if self.last_payment_date else None,
            'special_needs': self.special_needs,
            'medical_conditions': self.medical_conditions,
            'allergies': self.allergies,
            'notes': self.notes,
            'student': self.student.to_dict() if self.student else None,
            'route': self.route.to_dict() if self.route else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TransportTrip(db.Model):
    """Individual transport trips"""
    __tablename__ = 'transport_trips'
    
    id = db.Column(db.Integer, primary_key=True)
    route_id = db.Column(db.Integer, db.ForeignKey('transport_routes.id'), nullable=False)
    driver_id = db.Column(db.Integer, db.ForeignKey('transport_drivers.id'), nullable=False)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('transport_vehicles.id'), nullable=False)
    
    # Trip details
    trip_date = db.Column(db.Date, nullable=False)
    trip_type = db.Column(db.String(20), nullable=False)  # pickup, dropoff, both
    scheduled_start_time = db.Column(db.Time, nullable=False)
    actual_start_time = db.Column(db.Time)
    scheduled_end_time = db.Column(db.Time, nullable=False)
    actual_end_time = db.Column(db.Time)
    
    # Location tracking
    start_location = db.Column(db.String(255))
    end_location = db.Column(db.String(255))
    waypoints = db.Column(db.Text)  # JSON string of GPS coordinates
    
    # Passenger count
    expected_passengers = db.Column(db.Integer, default=0)
    actual_passengers = db.Column(db.Integer, default=0)
    
    # Status and issues
    status = db.Column(db.String(20), default='scheduled')  # scheduled, in_progress, completed, cancelled
    delay_minutes = db.Column(db.Integer, default=0)
    issues = db.Column(db.Text)  # Any issues during the trip
    weather_conditions = db.Column(db.String(50))
    
    # Fuel and maintenance
    fuel_consumed = db.Column(db.Float)
    mileage_start = db.Column(db.Integer)
    mileage_end = db.Column(db.Integer)
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    vehicle = db.relationship('TransportVehicle')
    attendance_records = db.relationship('TransportAttendance', backref='trip', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'route_id': self.route_id,
            'driver_id': self.driver_id,
            'vehicle_id': self.vehicle_id,
            'trip_date': self.trip_date.isoformat(),
            'trip_type': self.trip_type,
            'scheduled_start_time': self.scheduled_start_time.strftime('%H:%M') if self.scheduled_start_time else None,
            'actual_start_time': self.actual_start_time.strftime('%H:%M') if self.actual_start_time else None,
            'scheduled_end_time': self.scheduled_end_time.strftime('%H:%M') if self.scheduled_end_time else None,
            'actual_end_time': self.actual_end_time.strftime('%H:%M') if self.actual_end_time else None,
            'start_location': self.start_location,
            'end_location': self.end_location,
            'expected_passengers': self.expected_passengers,
            'actual_passengers': self.actual_passengers,
            'status': self.status,
            'delay_minutes': self.delay_minutes,
            'issues': self.issues,
            'weather_conditions': self.weather_conditions,
            'fuel_consumed': self.fuel_consumed,
            'mileage_start': self.mileage_start,
            'mileage_end': self.mileage_end,
            'notes': self.notes,
            'route': self.route.to_dict() if self.route else None,
            'driver': self.driver.to_dict() if self.driver else None,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TransportAttendance(db.Model):
    """Transport attendance tracking"""
    __tablename__ = 'transport_attendance'
    
    id = db.Column(db.Integer, primary_key=True)
    student_transport_id = db.Column(db.Integer, db.ForeignKey('student_transport.id'), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey('transport_trips.id'), nullable=False)
    
    # Attendance details
    attendance_date = db.Column(db.Date, nullable=False)
    attendance_type = db.Column(db.String(20), nullable=False)  # pickup, dropoff
    status = db.Column(db.String(20), nullable=False)  # present, absent, late, excused
    check_in_time = db.Column(db.DateTime)
    check_out_time = db.Column(db.DateTime)
    
    # Location and verification
    check_in_location = db.Column(db.String(255))
    check_out_location = db.Column(db.String(255))
    verified_by = db.Column(db.String(100))  # Driver, parent, system
    
    # Notes and issues
    notes = db.Column(db.Text)
    parent_notified = db.Column(db.Boolean, default=False)
    notification_sent_at = db.Column(db.DateTime)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'student_transport_id': self.student_transport_id,
            'trip_id': self.trip_id,
            'attendance_date': self.attendance_date.isoformat(),
            'attendance_type': self.attendance_type,
            'status': self.status,
            'check_in_time': self.check_in_time.isoformat() if self.check_in_time else None,
            'check_out_time': self.check_out_time.isoformat() if self.check_out_time else None,
            'check_in_location': self.check_in_location,
            'check_out_location': self.check_out_location,
            'verified_by': self.verified_by,
            'notes': self.notes,
            'parent_notified': self.parent_notified,
            'notification_sent_at': self.notification_sent_at.isoformat() if self.notification_sent_at else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class VehicleMaintenance(db.Model):
    """Vehicle maintenance records"""
    __tablename__ = 'vehicle_maintenance'
    
    id = db.Column(db.Integer, primary_key=True)
    vehicle_id = db.Column(db.Integer, db.ForeignKey('transport_vehicles.id'), nullable=False)
    
    # Maintenance details
    maintenance_type = db.Column(db.String(50), nullable=False)  # routine, repair, emergency
    service_type = db.Column(db.String(100))  # oil_change, tire_rotation, brake_service, etc.
    description = db.Column(db.Text, nullable=False)
    
    # Dates and mileage
    scheduled_date = db.Column(db.Date)
    completed_date = db.Column(db.Date)
    mileage_at_service = db.Column(db.Integer)
    
    # Service provider
    service_provider = db.Column(db.String(255))
    service_location = db.Column(db.String(255))
    technician_name = db.Column(db.String(255))
    
    # Costs
    labor_cost = db.Column(db.Numeric(10, 2))
    parts_cost = db.Column(db.Numeric(10, 2))
    total_cost = db.Column(db.Numeric(10, 2))
    
    # Parts and work done
    parts_replaced = db.Column(db.Text)  # JSON string of parts
    work_performed = db.Column(db.Text)  # Detailed work description
    
    # Status
    status = db.Column(db.String(20), default='scheduled')  # scheduled, in_progress, completed, cancelled
    
    # Next service
    next_service_date = db.Column(db.Date)
    next_service_mileage = db.Column(db.Integer)
    
    # Metadata
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'vehicle_id': self.vehicle_id,
            'maintenance_type': self.maintenance_type,
            'service_type': self.service_type,
            'description': self.description,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'completed_date': self.completed_date.isoformat() if self.completed_date else None,
            'mileage_at_service': self.mileage_at_service,
            'service_provider': self.service_provider,
            'service_location': self.service_location,
            'technician_name': self.technician_name,
            'labor_cost': float(self.labor_cost) if self.labor_cost else None,
            'parts_cost': float(self.parts_cost) if self.parts_cost else None,
            'total_cost': float(self.total_cost) if self.total_cost else None,
            'parts_replaced': self.parts_replaced,
            'work_performed': self.work_performed,
            'status': self.status,
            'next_service_date': self.next_service_date.isoformat() if self.next_service_date else None,
            'next_service_mileage': self.next_service_mileage,
            'notes': self.notes,
            'vehicle': self.vehicle.to_dict() if self.vehicle else None,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# Indexes for better performance
Index('idx_transport_vehicles_status', TransportVehicle.status)
Index('idx_transport_drivers_status', TransportDriver.status)
Index('idx_transport_routes_status', TransportRoute.status)
Index('idx_student_transport_student', StudentTransport.student_id)
Index('idx_transport_trips_date', TransportTrip.trip_date)
Index('idx_transport_attendance_date', TransportAttendance.attendance_date)
Index('idx_vehicle_maintenance_date', VehicleMaintenance.scheduled_date)
