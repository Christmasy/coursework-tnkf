import { Typography, Button, AppBar, Toolbar, } from '@mui/material';
import { useStyles } from './main-window-styles';
import { Link } from 'react-router-dom';

function MainWindow() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Главная
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form}>
        <Link to='/registration'>
          <Button
            color='primary'
            className={classes.button}
          >
            Регистрация
          </Button>
        </Link>
        <Link to='/login'>
          <Button
            color='primary'
            className={classes.button}
          >
            Войти
          </Button>
        </Link>
      </form>
    </div>
  );
}

export default MainWindow;