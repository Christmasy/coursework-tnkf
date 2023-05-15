import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  Button,
  AppBar,
  Toolbar,
  ListItemText,
} from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import { useStyles } from './projects-window-styles';
import { Link } from 'react-router-dom';
import { appContext } from '../../components/app-context/app-context';
  
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
          <ListItemButton component="a" href={`/projects/${project.id}`}>
            <ListItemText primary={project.title} />
          </ListItemButton>
        ))
      }
      <Link to='/projects/create'>
        <Button
          color='primary'
          className={classes.button}
        >
          Создать новый проект
        </Button>
      </Link>
    </div>
  );
}

export default ProjectsWindow;
