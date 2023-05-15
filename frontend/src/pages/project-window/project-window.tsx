import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  ListItemText,
} from '@material-ui/core';
import { useStyles } from './project-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { getStatus } from '../../utils/get-status';

function ProjectWindow() {
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
      <Link to='/tasks/create'>
        <Button
          color='primary'
          className={classes.button}
        >
          Новая задача
        </Button>
      </Link>
    </div>
  );
}

export default ProjectWindow;