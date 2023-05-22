import React, { useContext, useState } from 'react';
import { Typography, AppBar, Toolbar, TextField, Button } from '@mui/material';
import { useStyles } from './registration-window-styles';
import { login } from '../../utils/login';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { appContext } from '../../components/app-context/app-context';
import { REACT_APP_API_URL } from '../../utils/url';

async function reg(
  email: string,
  password: string,
  setNewState: (token: string) => void,
  navigate: NavigateFunction
){
  await fetch(REACT_APP_API_URL + '/reg', { method:'POST', body:JSON.stringify({username:email, password, email}), headers:{'Content-Type':'application/json'}});
  await login(email, password, setNewState, navigate, () => {});
}

function RegistrationWindow() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setNewState} = useContext(appContext) as any;
  const navigate = useNavigate();

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
          onClick={() => reg(email, password, setNewState, navigate)}
        >
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}

export default RegistrationWindow;