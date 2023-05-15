import React from 'react';
import './App.css';
import RegistrationWindow from './pages/registration-window/registration-window';
import LoginWindow from './pages/login-window/login-window';
import MainWindow from './pages/main-window/main-window';
import { Routes, Route } from 'react-router-dom';
import CreateTaskWindow from './pages/create-task-window/create-task-window';
import ProjectWindow from './pages/project-window/project-window';
import TaskWindow from './pages/task-window/task-window';
import CreateProjectWindow from './pages/create-project-window/create-project-window';
import ProjectsWindow from './pages/projects-window/projects-window';

function App() {
  return (
    <Routes>
      <Route
        path={'/'}
        element={<MainWindow />}
      />
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
        path={'/projects/:projectId'}
        element={<ProjectWindow />}
      />
      <Route
        path={'/tasks/:taskId'}
        element={<TaskWindow />}
      />
      <Route
        path={'/projects'}
        element={<ProjectsWindow />}
      />
      <Route
        path={'/projects/create'}
        element={<CreateProjectWindow />}
      />
    </Routes>
  );
}

export default App;
