import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, message } from 'antd';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';

const SubjectsPage = () => {
    const [subjects, setSubjects] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/subjects`);
            setSubjects(response.data);
        } catch (error) {
            message.error('Failed to fetch subjects');
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const showModal = () => {
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await axios.post(`${API_URL}/subjects`, values);
            message.success('Subject added successfully');
            fetchSubjects();
            handleCancel();
        } catch (error) {
            message.error('Failed to save subject');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Grade Level', dataIndex: 'grade_level', key: 'grade_level' },
        { title: 'Sessions/Week', dataIndex: 'sessions_per_week', key: 'sessions_per_week' },
        { title: 'Special Room', dataIndex: 'requires_special_room', key: 'requires_special_room', render: (val) => val ? 'Yes' : 'No' },
    ];

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Add Subject
            </Button>
            <Table columns={columns} dataSource={subjects} rowKey="id" />
            <Modal title="Add Subject" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Subject Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="grade_level" label="Grade Level" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="sessions_per_week" label="Sessions per Week" initialValue={1}>
                        <InputNumber style={{ width: '100%' }} min={1} />
                    </Form.Item>
                    <Form.Item name="requires_special_room" label="Requires Special Room" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubjectsPage;
