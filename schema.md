# โครงสร้างฐานข้อมูล (Database Schema)

## 1. ตาราง `teachers` (ข้อมูลครู)

| ชื่อคอลัมน์   | ประเภทข้อมูล | รายละเอียด                       |
| :------------ | :------------ | :------------------------------- |
| `id`          | `INTEGER`     | Primary Key, Auto Increment      |
| `name`        | `VARCHAR(255)`| ชื่อ-นามสกุลของครู               |
| `unavailable` | `JSON`        | เก็บข้อมูลช่วงเวลาที่ไม่สะดวกสอน |

## 2. ตาราง `subjects` (ข้อมูลวิชา)

| ชื่อคอลัมน์      | ประเภทข้อมูล | รายละเอียด                          |
| :--------------- | :------------ | :---------------------------------- |
| `id`             | `INTEGER`     | Primary Key, Auto Increment         |
| `name`           | `VARCHAR(255)`| ชื่อวิชา                            |
| `grade_level`    | `INTEGER`     | ระดับชั้น                           |
| `sessions_per_week` | `INTEGER`  | จำนวนคาบต่อสัปดาห์                |
| `requires_special_room` | `BOOLEAN` | ต้องการห้องพิเศษหรือไม่             |

## 3. ตาราง `rooms` (ข้อมูลห้องเรียน)

| ชื่อคอลัมน์   | ประเภทข้อมูล | รายละเอียด                                |
| :------------ | :------------ | :---------------------------------------- |
| `id`          | `INTEGER`     | Primary Key, Auto Increment               |
| `name`        | `VARCHAR(255)`| ชื่อห้องเรียน (เช่น 101, Lab Com 1)       |
| `type`        | `ENUM`        | ประเภทห้อง ('normal', 'lab', 'gym')     |
| `capacity`    | `INTEGER`     | ความจุนักเรียน                           |

## 4. ตาราง `class_schedules` (ตารางสอน)

| ชื่อคอลัมน์   | ประเภทข้อมูล | รายละเอียด                                       |
| :------------ | :------------ | :----------------------------------------------- |
| `id`          | `INTEGER`     | Primary Key, Auto Increment                      |
| `day_of_week` | `INTEGER`     | วันในสัปดาห์ (1=จันทร์, 2=อังคาร, ...)           |
| `period`      | `INTEGER`     | คาบเรียน (1, 2, 3, ...)                          |
| `class_id`    | `INTEGER`     | Foreign Key อ้างอิงถึง `classes.id` (ตารางห้องเรียนของนักเรียน) |
| `subject_id`  | `INTEGER`     | Foreign Key อ้างอิงถึง `subjects.id`             |
| `teacher_id`  | `INTEGER`     | Foreign Key อ้างอิงถึง `teachers.id`             |
| `room_id`     | `INTEGER`     | Foreign Key อ้างอิงถึง `rooms.id`                |

## 5. ตาราง `teacher_subject` (ตารางเชื่อมโยงครูกับวิชาที่สอนได้)

| ชื่อคอลัมน์   | ประเภทข้อมูล | รายละเอียด                                  |
| :------------ | :------------ | :------------------------------------------ |
| `teacher_id`  | `INTEGER`     | Foreign Key อ้างอิงถึง `teachers.id`        |
| `subject_id`  | `INTEGER`     | Foreign Key อ้างอิงถึง `subjects.id`        |
|               |               | **Primary Key:** (`teacher_id`, `subject_id`) |
