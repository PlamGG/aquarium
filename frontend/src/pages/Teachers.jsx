import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

const TeachersPage = () => {
    const [teachers, setTeachers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [form] = Form.useForm();

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${API_URL}/teachers`);
            setTeachers(response.data);
        } catch (error) {
            message.error('Failed to fetch teachers');
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const showModal = (teacher = null) => {
        setEditingTeacher(teacher);
        form.setFieldsValue(teacher ? { name: teacher.name } : { name: '' });
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingTeacher(null);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingTeacher) {
                await axios.put(`${API_URL}/teachers/${editingTeacher.id}`, values);
                message.success('Teacher updated successfully');
            } else {
                await axios.post(`${API_URL}/teachers`, values);
                message.success('Teacher added successfully');
            }
            fetchTeachers();
            handleCancel();
        } catch (error) {
            message.error('Failed to save teacher');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/teachers/${id}`);
            message.success('Teacher deleted successfully');
            fetchTeachers();
        } catch (error) {
            message.error('Failed to delete teacher');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <span>
                    <Button type="link" onClick={() => showModal(record)}>Edit</Button>
                    <Button type="link" danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </span>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
                Add Teacher
            </Button>
            <Table columns={columns} dataSource={teachers} rowKey="id" />
            <Modal
                title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Teacher Name"
                        rules={[{ required: true, message: 'Please input the teacher name!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default TeachersPage;
