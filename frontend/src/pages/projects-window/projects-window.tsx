import {
    Typography,
    Button,
    AppBar,
    Toolbar,
  } from '@material-ui/core';
  import { useStyles } from './projects-window-styles';
  import { Link } from 'react-router-dom';
  
  function ProjectsWindow() {
    const classes = useStyles();
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Проекты
            </Typography>
          </Toolbar>
        </AppBar>
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
