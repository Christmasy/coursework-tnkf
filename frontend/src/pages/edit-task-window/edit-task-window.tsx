import React, { useContext, useEffect, useState } from 'react';
import { Typography, TextField, Button, AppBar, Toolbar, InputLabel, Select, MenuItem } from '@mui/material';
import { useStyles } from './edit-task-window-styles';
import {DateTimePicker} from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { appContext } from '../../components/app-context/app-context';
import { NavigateFunction, useNavigate, useParams } from 'react-router-dom';
import { REACT_APP_API_URL } from '../../utils/url';

async function editTask(
  token: string,
  projectId: number,
  asigneeId: number,
  title: string,
  description: string,
  deadline: dayjs.Dayjs,
  status: number,
  navigate: NavigateFunction,
  taskId: string
){
  await fetch(REACT_APP_API_URL + `/tasks/${taskId}/edit`,{
    method:'POST',
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type':'application/json'},
    body: JSON.stringify({asigneeId, projectId, title, description, deadline, status, taskId})
  });
  navigate(`/projects/${projectId}`);
}

function EditTaskWindow() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, changeProject] = useState(0);
  const [asignee, changeAsignee] = useState(0);
  const [status, changeStatus] = useState(0);
  const [date, setDate] = useState(dayjs(new Date(Date.now())));
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const { taskId } = useParams();

  const {state} = useContext(appContext) as any;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const taskResult = await fetch(REACT_APP_API_URL + `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${state}`}});
      const task = (await taskResult.json()).data;
      const usersResult = await fetch(REACT_APP_API_URL + '/users', {headers: {'Authorization': `Bearer ${state}`}});
      const users = await usersResult.json();
      const projectsResult = await fetch(REACT_APP_API_URL + '/projects', {headers: {'Authorization': `Bearer ${state}`}});
      const projects = await projectsResult.json();
      setUsers(users.data);
      setProjects(projects.data);
      setTitle(task.title);
      setDescription(task.description);
      changeProject(task.project_id);
      changeAsignee(task.asignee_id);
      changeStatus(task.status);
      setDate(dayjs(new Date(task.deadline)));
      if(projects.length > 0) {
        changeProject(projects[0].id);
      }
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Редактирование задачи
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form}>
        <TextField
          id="title"
          label="Название"
          type="title"
          variant="outlined"
          className={classes.textField}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="description"
          label="Описание"
          type="description"
          variant="outlined"
          className={classes.textField}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <InputLabel id="project">Проект</InputLabel>
        <Select
          labelId="project"
          id="project"
          value={project}
          label="project"
          onChange={(e) => changeProject(parseInt(e.target.value as string))}
          className={classes.projectInput}
        >
          {projects.map((project: any) => <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>)}
        </Select>
        <InputLabel id="project">Исполнитель</InputLabel>
        <Select
          labelId="asignee"
          id="asignee"
          value={asignee}
          label="Asignee"
          onChange={(e) => changeAsignee(parseInt(e.target.value as string))}
          className={classes.asigneeInput}
        >
          <MenuItem key={0} value={0}>unassigned</MenuItem>
          {users.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>)}
        </Select>
        <InputLabel id="status">Статус</InputLabel>
        <Select
          labelId="status"
          id="status"
          value={status}
          label="status"
          onChange={(e) => changeStatus(parseInt(e.target.value as string))}
          className={classes.statusInput}
        >
          <MenuItem value={0}>Backlog</MenuItem>
          <MenuItem value={1}>To Do</MenuItem>
          <MenuItem value={2}>In Progress</MenuItem>
          <MenuItem value={3}>Code Review</MenuItem>
          <MenuItem value={4}>Done</MenuItem>
        </Select>
        <DateTimePicker 
          label="Дедлайн"
          value={date}
          onChange={(newValue) => setDate(newValue!)}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => editTask(state, project, asignee, title, description, date, status, navigate, taskId!)}
        >
          Редактировать
        </Button>
      </form>
    </div>
  );
}

export default EditTaskWindow;
