import React, { useState, useEffect } from 'react';
import { Table, Button, message, Spin } from 'antd';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8]; // 8 คาบต่อวัน

const SchedulePage = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/schedule`);
            //  ประมวลผลข้อมูลที่ได้จาก API ให้อยู่ในรูปแบบที่ Table ของ AntD ใช้งานได้
            const formattedSchedule = formatScheduleData(response.data);
            setSchedule(formattedSchedule);
        } catch (error) {
            message.error('Failed to fetch schedule');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchSchedule(); // ยังไม่เรียกใช้ตอนเริ่มต้น รอให้มีการ generate ก่อน
    }, []);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/schedule/generate`);
            message.success('Schedule generation process started!');
            // หลังจากสั่ง generate อาจจะต้องรอสักครู่แล้วค่อย fetch ข้อมูล
            setTimeout(() => {
                fetchSchedule();
            }, 2000); // สมมติว่ารอ 2 วินาที
        } catch (error) {
            message.error('Failed to start schedule generation');
            setLoading(false);
        }
    };

    const formatScheduleData = (data) => {
        // Placeholder function: ในการใช้งานจริงต้องแปลง data จาก API
        // ให้อยู่ในรูปแบบของ antd table
        // ตัวอย่าง: { key: '1', period: 1, Mon: 'Math', Tue: 'Physics', ... }
        return []; // ตอนนี้ return array ว่างไปก่อน
    };

    const columns = [
        { title: 'Period', dataIndex: 'period', key: 'period' },
        ...DAYS.map(day => ({
            title: day,
            dataIndex: day,
            key: day,
        })),
    ];

    return (
        <div>
            <Button type="primary" onClick={handleGenerate} loading={loading} style={{ marginBottom: 16 }}>
                Generate Schedule
            </Button>
            <Spin spinning={loading}>
                <Table
                    columns={columns}
                    dataSource={schedule}
                    bordered
                    pagination={false}
                />
            </Spin>
        </div>
    );
};

export default SchedulePage;
