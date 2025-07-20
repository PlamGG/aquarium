from flask import Blueprint, jsonify, request
from app import db
from app.models import Teacher

bp = Blueprint('routes', __name__)

# GET all teachers
@bp.route('/teachers', methods=['GET'])
def get_teachers():
    teachers = Teacher.query.all()
    return jsonify([teacher.to_dict() for teacher in teachers])

# GET a single teacher
@bp.route('/teachers/<int:id>', methods=['GET'])
def get_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    return jsonify(teacher.to_dict())

# CREATE a teacher
@bp.route('/teachers', methods=['POST'])
def create_teacher():
    data = request.get_json() or {}
    if 'name' not in data:
        return jsonify({'error': 'Missing name'}), 400

    teacher = Teacher(name=data['name'])
    if 'unavailable' in data:
        teacher.unavailable = data['unavailable']

    db.session.add(teacher)
    db.session.commit()
    return jsonify(teacher.to_dict()), 201

# UPDATE a teacher
@bp.route('/teachers/<int:id>', methods=['PUT'])
def update_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    data = request.get_json() or {}

    teacher.name = data.get('name', teacher.name)
    if 'unavailable' in data:
        teacher.unavailable = data['unavailable']

    db.session.commit()
    return jsonify(teacher.to_dict())

from app.models import Subject, Room

# DELETE a teacher
@bp.route('/teachers/<int:id>', methods=['DELETE'])
def delete_teacher(id):
    teacher = Teacher.query.get_or_404(id)
    db.session.delete(teacher)
    db.session.commit()
    return '', 204

# --- Subject Routes ---
@bp.route('/subjects', methods=['GET'])
def get_subjects():
    subjects = Subject.query.all()
    return jsonify([subject.to_dict() for subject in subjects])

@bp.route('/subjects', methods=['POST'])
def create_subject():
    data = request.get_json() or {}
    # Add validation as needed
    subject = Subject(
        name=data.get('name'),
        grade_level=data.get('grade_level'),
        sessions_per_week=data.get('sessions_per_week'),
        requires_special_room=data.get('requires_special_room')
    )
    db.session.add(subject)
    db.session.commit()
    return jsonify(subject.to_dict()), 201

# --- Room Routes ---
@bp.route('/rooms', methods=['GET'])
def get_rooms():
    rooms = Room.query.all()
    return jsonify([room.to_dict() for room in rooms])

@bp.route('/rooms', methods=['POST'])
def create_room():
    data = request.get_json() or {}
    # Add validation as needed
    room = Room(
        name=data.get('name'),
        type=data.get('type'),
        capacity=data.get('capacity')
    )
    db.session.add(room)
    db.session.commit()
    return jsonify(room.to_dict()), 201

# --- Scheduler Routes ---
from app.scheduler import run_scheduler

@bp.route('/schedule/generate', methods=['POST'])
def generate_schedule_route():
    # ในการใช้งานจริง ควรจะรัน process นี้แบบ background (asynchronously)
    # แต่สำหรับตอนนี้จะรันแบบง่ายๆ ไปก่อน
    schedule = run_scheduler()
    # เนื่องจาก schedule ตอนนี้เป็นแค่ placeholder เราจะ return message ง่ายๆไปก่อน
    return jsonify({"message": "Schedule generation started.", "schedule": schedule}), 200

@bp.route('/schedule', methods=['GET'])
def get_schedule():
    schedule_entries = ClassSchedule.query.all()
    return jsonify([entry.to_dict() for entry in schedule_entries])
