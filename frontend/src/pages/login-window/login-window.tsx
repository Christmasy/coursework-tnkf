import React, { useContext, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Snackbar,
} from '@material-ui/core';
import { useStyles } from './login-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { login } from '../../utils/login';

function LoginWindow() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setError] = useState(false);

  const {setNewState} = useContext(appContext) as any;
  const navigate = useNavigate();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Вход
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="password"
          label="Пароль"
          type="password"
          variant="outlined"
          className={classes.textField}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => login(email, password, setNewState, navigate, setError)}
        >
          Войти
        </Button>
        <Snackbar open={hasError} autoHideDuration={6000} onClose={() => setError(false)}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Неверное имя пользователя или пароль
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
}

export default LoginWindow;