import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { useStyles } from './tasks-window-styles';
import dayjs from 'dayjs';
import { appContext } from '../../components/app-context/app-context';
import { ListItemButton } from '@mui/material';
import { getStatus } from '../../utils/get-status';

function TasksWindow() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);

  const {state} = useContext(appContext) as any;

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const result = await fetch('/api/tasks', {headers: {'Authorization': `Bearer ${state}`}});
      setTasks((await result.json()).data);
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Задачи
          </Typography>
        </Toolbar>
      </AppBar>
      {
        tasks.map((task:any) => (
          <ListItemButton component="a" href={`/tasks/${task.id}`}>
            <ListItemText primary={task.title} />
            <ListItemText primary={task.description} />
            <ListItemText primary={task.deadline} />
            <ListItemText primary={getStatus(task.status)} />
          </ListItemButton>
        ))
      }
    </div>
  );
}

export default TasksWindow;