import React, { useContext, useEffect, useState } from 'react';
import { useStyles } from './task-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { useParams } from 'react-router-dom';
import { getStatus } from '../../utils/get-status';
import { Card } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { Typography, AppBar, Toolbar, CardContent } from '@mui/material';
import { REACT_APP_API_URL } from '../../utils/url';

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
      const result = await fetch(REACT_APP_API_URL + `/tasks/${taskId}`, {headers: {'Authorization': `Bearer ${state}`}});
      setTask((await result.json()).data);
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Задача {task.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Card>
        <CardContent>
          <Typography variant='h5'>{task.title}</Typography>
          <Typography>Описание задачи: {task.description}</Typography>
          <Typography>Дедлайн: {task.deadline}</Typography>
          <Typography>Статус: {getStatus(task.status)}</Typography>
        </CardContent>
      </Card>
      <Link to='/tasks'>
        <Button
          color='primary'
          className={classes.button}
        >
          Вернуться ко всем задачам
        </Button>
      </Link>
      <Link to={`/tasks/${taskId}/edit`}>
        <Button
          color='primary'
          className={classes.button}
        >
          Редактировать задачу
        </Button>
      </Link>
    </div>
  );
}

export default TaskWindow;
