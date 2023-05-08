import React from 'react';
import {
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
} from '@material-ui/core';
import { useStyles } from './registration-window-styles';

function RegistrationWindow() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Регистрация
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form}>
        <TextField
          id="email"
          label="Электронная почта"
          type="email"
          variant="outlined"
          className={classes.textField}
        />
        <TextField
          id="password"
          label="Пароль"
          type="password"
          variant="outlined"
          className={classes.textField}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
        >
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}

export default RegistrationWindow;