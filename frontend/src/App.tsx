import React from 'react';
import './App.css';
import RegistrationWindow from './pages/registration-window/registration-window';
import LoginWindow from './pages/login-window/login-window';
import { Routes, Route } from 'react-router-dom';
import CreateTaskWindow from './pages/create-task-window/create-task-window';
import TasksWindow from './pages/tasks-window/tasks-window';
import TaskWindow from './pages/task-window/task-window';
import CreateProjectWindow from './pages/create-project-window/create-project-window';

function App() {
  return (
    <Routes>
      <Route
        path={'/login'}
        element={<LoginWindow />}
      />
      <Route
        path={'/registration'}
        element={<RegistrationWindow />}
      />
      <Route
        path={'/tasks/create'}
        element={<CreateTaskWindow />}
      />
      <Route
        path={'/tasks'}
        element={<TasksWindow />}
      />
      <Route
        path={'/tasks/:taskId'}
        element={<TaskWindow />}
      />
      <Route
        path={'/projects/create'}
        element={<CreateProjectWindow />}
      />
    </Routes>
  );
}

export default App;
