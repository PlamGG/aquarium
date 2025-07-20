import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message } from 'antd';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api';
const { Option } = Select;

const RoomsPage = () => {
    const [rooms, setRooms] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const fetchRooms = async () => {
        try {
            const response = await axios.get(`${API_URL}/rooms`);
            setRooms(response.data);
        } catch (error) {
            message.error('Failed to fetch rooms');
        }
    };

    useEffect(() => {
        fetchRooms();
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
            await axios.post(`${API_URL}/rooms`, values);
            message.success('Room added successfully');
            fetchRooms();
            handleCancel();
        } catch (error) {
            message.error('Failed to save room');
        }
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id' },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Capacity', dataIndex: 'capacity', key: 'capacity' },
    ];

    return (
        <div>
            <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
                Add Room
            </Button>
            <Table columns={columns} dataSource={rooms} rowKey="id" />
            <Modal title="Add Room" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Room Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Room Type" initialValue="normal">
                        <Select>
                            <Option value="normal">Normal</Option>
                            <Option value="lab">Lab</Option>
                            <Option value="gym">Gym</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="capacity" label="Capacity">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RoomsPage;
