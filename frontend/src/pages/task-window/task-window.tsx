import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { useStyles } from './task-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { useParams } from 'react-router-dom';
import { getStatus } from '../../utils/get-status';

function TaskWindow() {
  const classes = useStyles();
  const [task, setTask] = useState({} as any);
  const { taskId } = useParams();

  const {state} = useContext(appContext) as any;

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const result = await fetch(`/api/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${state}`}});
      setTask((await result.json()).data);
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Задача
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography>{task.title}</Typography>
      <Typography>{task.description}</Typography>
      <Typography>{task.deadline}</Typography>
      <Typography>{getStatus(task.status)}</Typography>
    </div>
  );
}

export default TaskWindow;
