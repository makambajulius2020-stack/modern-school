from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import Hostel, HostelRoom, HostelAllocation
from datetime import datetime

hostels_bp = Blueprint('hostels', __name__)

@hostels_bp.route('/hostels', methods=['GET'])
@jwt_required(optional=True)
def list_hostels():
    items = Hostel.query.all()
    return jsonify({'success': True, 'items': [i.to_dict() for i in items]})

@hostels_bp.route('/hostels', methods=['POST'])
@jwt_required()
def create_hostel():
    data = request.get_json() or {}
    h = Hostel(name=data['name'], gender=data.get('gender','mixed'), capacity=data.get('capacity',0), warden_id=data.get('warden_id'))
    db.session.add(h)
    db.session.commit()
    return jsonify({'success': True, 'item': h.to_dict()}), 201

@hostels_bp.route('/rooms', methods=['POST'])
@jwt_required()
def create_room():
    data = request.get_json() or {}
    r = HostelRoom(hostel_id=data['hostel_id'], room_number=data['room_number'], bed_count=data.get('bed_count',4))
    db.session.add(r)
    db.session.commit()
    return jsonify({'success': True, 'item': r.to_dict()}), 201

@hostels_bp.route('/rooms', methods=['GET'])
@jwt_required(optional=True)
def list_rooms():
    items = HostelRoom.query.all()
    return jsonify({'success': True, 'items': [i.to_dict() for i in items]})

@hostels_bp.route('/allocations', methods=['POST'])
@jwt_required()
def allocate_room():
    data = request.get_json() or {}
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None
    a = HostelAllocation(room_id=data['room_id'], student_id=data['student_id'], start_date=start_date, end_date=end_date, status='active')
    db.session.add(a)
    db.session.commit()
    return jsonify({'success': True, 'item': a.to_dict()}), 201

@hostels_bp.route('/allocations', methods=['GET'])
@jwt_required(optional=True)
def list_allocations():
    items = HostelAllocation.query.order_by(HostelAllocation.id.desc()).limit(200).all()
    return jsonify({'success': True, 'items': [i.to_dict() for i in items]})
