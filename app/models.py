from app import db
import json

# ตารางเชื่อมโยงครูกับวิชาที่สอนได้
teacher_subject = db.Table('teacher_subject',
    db.Column('teacher_id', db.Integer, db.ForeignKey('teachers.id'), primary_key=True),
    db.Column('subject_id', db.Integer, db.ForeignKey('subjects.id'), primary_key=True)
)

class Teacher(db.Model):
    __tablename__ = 'teachers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)

    # เก็บข้อมูลช่วงเวลาที่ไม่สะดวกสอนในรูปแบบ JSON string
    _unavailable = db.Column(db.Text, name='unavailable')

    subjects = db.relationship('Subject', secondary=teacher_subject, lazy='subquery',
                               backref=db.backref('teachers', lazy=True))

    @property
    def unavailable(self):
        return json.loads(self._unavailable) if self._unavailable else []

    @unavailable.setter
    def unavailable(self, value):
        self._unavailable = json.dumps(value)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'unavailable': self.unavailable,
            'subjects': [subject.id for subject in self.subjects]
        }

class Subject(db.Model):
    __tablename__ = 'subjects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    grade_level = db.Column(db.Integer, nullable=False)
    sessions_per_week = db.Column(db.Integer, default=1)
    requires_special_room = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'grade_level': self.grade_level,
            'sessions_per_week': self.sessions_per_week,
            'requires_special_room': self.requires_special_room
        }

class Room(db.Model):
    __tablename__ = 'rooms'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), default='normal')  # 'normal', 'lab', 'gym'
    capacity = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'capacity': self.capacity
        }

class ClassSchedule(db.Model):
    __tablename__ = 'class_schedules'
    id = db.Column(db.Integer, primary_key=True)
    day_of_week = db.Column(db.Integer, nullable=False) # 1=Mon, 2=Tue...
    period = db.Column(db.Integer, nullable=False)
    # class_id ควรจะหมายถึงกลุ่มนักเรียน เช่น 'ม.1/1' แต่ยังไม่มี model นี้
    # ในที่นี้จะใช้ room_id แทนไปก่อนเพื่อความง่าย
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.id'), nullable=False)

    room = db.relationship('Room')
    subject = db.relationship('Subject')
    teacher = db.relationship('Teacher')

    def to_dict(self):
        return {
            'id': self.id,
            'day_of_week': self.day_of_week,
            'period': self.period,
            'room_id': self.room_id,
            'subject_id': self.subject_id,
            'teacher_id': self.teacher_id
        }
