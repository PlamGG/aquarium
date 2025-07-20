import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import TeachersPage from './pages/Teachers';
import SubjectsPage from './pages/Subjects';
import RoomsPage from './pages/Rooms';
import SchedulePage from './pages/Schedule';
import './App.css';

const { Header, Content, Footer } = Layout;

const App = () => {
  const [current, setCurrent] = useState('teachers');

  const renderPage = () => {
    switch (current) {
      case 'teachers':
        return <TeachersPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'schedule':
        return <SchedulePage />;
      default:
        return <TeachersPage />;
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
        >
          <Menu.Item key="teachers">Teachers</Menu.Item>
          <Menu.Item key="subjects">Subjects</Menu.Item>
          <Menu.Item key="rooms">Rooms</Menu.Item>
          <Menu.Item key="schedule">Schedule</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content" style={{ margin: '16px 0' }}>
          {renderPage()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        School Scheduler ©2024 Created by Jules
      </Footer>
    </Layout>
  );
};

export default App;
