from app.models import Teacher, Subject, Room, ClassSchedule
from app import db

class Scheduler:
    """
    คลาสหลักสำหรับจัดการ Logic การจัดตารางสอน
    """
    def __init__(self, teachers, subjects, rooms):
        self.teachers = {t.id: t for t in teachers}
        self.subjects = {s.id: s for s in subjects}
        self.rooms = {r.id: r for r in rooms}

        # โครงสร้างสำหรับเก็บตารางสอนที่จัดแล้ว
        # key: (day, period, room_id)
        # value: (subject_id, teacher_id)
        self.schedule = {}

        # โครงสร้างสำหรับติดตามว่าครูหรือห้องเรียนไม่ว่าง ณ เวลาใด
        self.teacher_availability = {} # { teacher_id: set((day, period)) }
        self.room_availability = {} # { room_id: set((day, period)) }

    def is_teacher_available(self, teacher_id, day, period):
        """ตรวจสอบว่าครูว่างในเวลานั้นหรือไม่"""
        return (day, period) not in self.teacher_availability.get(teacher_id, set())

    def is_room_available(self, room_id, day, period):
        """ตรวจสอบว่าห้องว่างในเวลานั้นหรือไม่"""
        return (day, period) not in self.room_availability.get(room_id, set())

    def place_class(self, subject, teacher_id, room_id, day, period):
        """จองคลาสในตาราง และอัปเดต availability"""
        self.schedule[(day, period, room_id)] = (subject.id, teacher_id)

        # อัปเดตว่าครูไม่ว่าง
        if teacher_id not in self.teacher_availability:
            self.teacher_availability[teacher_id] = set()
        self.teacher_availability[teacher_id].add((day, period))

        # อัปเดตว่าห้องไม่ว่าง
        if room_id not in self.room_availability:
            self.room_availability[room_id] = set()
        self.room_availability[room_id].add((day, period))

    def generate_schedule(self):
        """
        อัลกอริทึมหลักในการจัดตารางสอน (ยังเป็นเวอร์ชัน simplified)
        """
        print("Generating schedule...")

        # TODO: Implement the actual scheduling algorithm here.
        # This would involve iterating through subjects, finding available slots,
        # checking constraints (teacher skills, room types, etc.),
        # and using backtracking or other heuristic methods for optimization.

        return self.schedule

def run_scheduler():
    """
    ฟังก์ชันสำหรับเริ่มกระบวนการจัดตารางและบันทึกลงฐานข้อมูล
    """
    # 1. ดึงข้อมูลทั้งหมดจากฐานข้อมูล
    teachers = Teacher.query.all()
    subjects = Subject.query.all()
    rooms = Room.query.all()

    # 2. สร้าง instance ของ Scheduler
    scheduler = Scheduler(teachers, subjects, rooms)

    # 3. เริ่มการจัดตาราง (ตอนนี้ยังเป็น placeholder)
    generated_schedule = scheduler.generate_schedule()

    # 4. ล้างข้อมูลตารางสอนเก่า
    try:
        ClassSchedule.query.delete()
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error clearing old schedule: {e}")
        return None

    # 5. บันทึกตารางสอนใหม่ลงฐานข้อมูล
    try:
        for key, value in generated_schedule.items():
            day, period, room_id = key
            subject_id, teacher_id = value
            new_entry = ClassSchedule(
                day_of_week=day,
                period=period,
                room_id=room_id,
                subject_id=subject_id,
                teacher_id=teacher_id
            )
            db.session.add(new_entry)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error saving new schedule: {e}")
        return None

    return generated_schedule
