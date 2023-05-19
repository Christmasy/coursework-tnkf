import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  //Button,
  AppBar,
  Toolbar,
  ListItemText,
} from '@material-ui/core';
import { useStyles } from './project-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { ListItemButton } from '@mui/material';
//import { Link } from 'react-router-dom';
import { getStatus } from '../../utils/get-status';
import { Button, Card, Link } from '@mui/material';
import {
  CardContent,
} from '@material-ui/core';

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
          <Link underline="none" href={`/tasks/${task.id}`}>
            <Card>
              <CardContent>
                  <Typography variant='h5'>{task.title}</Typography>
                  <Typography>Автор: {task.author}</Typography>
                  <Typography>Исполнитель: {task.asignee}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      }
    </div>
  );
}

export default ProjectWindow;