import React, { useContext, useEffect, useState } from 'react';
import { Typography, AppBar, Toolbar } from '@mui/material';
import { useStyles } from './projects-window-styles';
import { Link as ReactLink } from 'react-router-dom';
import { appContext } from '../../components/app-context/app-context';
  
import {
  CardContent,
} from '@material-ui/core';
import { Button, Card, Link } from '@mui/material';

function ProjectsWindow() {
  const classes = useStyles();

  const [projects, setProjects] = useState([]);

  const {state} = useContext(appContext) as any;

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const result = await fetch('/api/projects', {headers: {'Authorization': `Bearer ${state}`}});
      setProjects((await result.json()).data);
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Проекты
          </Typography>
        </Toolbar>
      </AppBar>
      {
        projects.map((project:any) => (
          <Link underline="none" href={`/projects/${project.id}`}>
            <Card>
              <CardContent>
                  <Typography variant='h5'>{project.title}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))
      }
      <ReactLink to='/projects/create'>
        <Button
          color='primary'
          className={classes.button}
        >
          Создать новый проект
        </Button>
      </ReactLink>
    </div>
  );
}

export default ProjectsWindow;
