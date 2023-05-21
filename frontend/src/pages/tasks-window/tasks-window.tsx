import React, { useContext, useEffect, useState } from 'react';
import { Typography, AppBar, Toolbar, CardContent } from '@mui/material';
import { useStyles } from './tasks-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { Link as ReactLink } from 'react-router-dom';
import { Button, Card, Link } from '@mui/material';

function TasksWindow() {
  const classes = useStyles();

  const [tasks, setTasks] = useState([]);

  const {state} = useContext(appContext) as any;

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const result = await fetch('/api/tasks', {
        headers: {'Authorization': `Bearer ${state}`},
      });
      const t = (await result.json()).data;
      setTasks(t);
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
          //<MiniCard id={task.id} title={task.title} author={task.author} assigner={task.assigner}/>
          <Link underline="none" href={`/tasks/${task.id}`}>
            <Card className={classes.card}>
              <CardContent>
                  <Typography variant='h5'>{task.title}</Typography>
                  <Typography>Автор: {task.author}</Typography>
                  <Typography>Исполнитель: {task.asignee}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      }
      <ReactLink to='/tasks/create'>
        <Button
          color='primary'
          className={classes.button}
        >
          Новая задача
        </Button>
      </ReactLink>
      <ReactLink to='/projects'>
        <Button
          color='primary'
          className={classes.button}
        >
          К проектам
        </Button>
      </ReactLink>
    </div>
  );
}

export default TasksWindow;
