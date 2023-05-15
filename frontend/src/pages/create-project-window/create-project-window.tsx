import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  ListItem,
} from '@material-ui/core';
import { useStyles } from './create-project-window-styles';
import { appContext } from '../../components/app-context/app-context';
import { ListItemButton } from '@mui/material';

async function createProject(token: string, title: string, members: number[]) {
  const result = await fetch('/api/projects/create',{
    method:'POST',
    headers: {'Authorization': `Bearer ${token}`, 'Content-Type':'application/json'},
    body: JSON.stringify({title})
  });
  const proms = [];
  const projectId = (await result.json()).data.id;
  for(const member of members) {
    proms.push(fetch(`/api/projects/${projectId}/adduser`, {
      method:'POST',
      headers: {'Authorization': `Bearer ${token}`, 'Content-Type':'application/json'},
      body: JSON.stringify({userId: member})
    }));
  }
  await Promise.all(proms);
}

function CreateProjectWindow() {
  const classes = useStyles();
  const [title, setTitle] = useState('');
  const [project, changeProject] = useState(0);
  const [member, changeMember] = useState(0);
  const [members, setMembers] = useState([] as any);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  function addMember() {
    setMembers([...members, member]);
  }

  const {state} = useContext(appContext) as any;

  useEffect(() => {
    const fetchData = async () => {
      if(!state) {
        return;
      }
      const usersResult = await fetch('/api/users', {headers: {'Authorization': `Bearer ${state}`}});
      const users = await usersResult.json();
      setUsers(users.data);
    }
    fetchData();
  }, [state]);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Создание проекта
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form}>
        <TextField
          id="title"
          label="Название"
          type="title"
          variant="outlined"
          className={classes.textField}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select
          labelId="member"
          id="member"
          value={member}
          label="Member"
          onChange={(e) => changeMember(parseInt(e.target.value as string))}
          className={classes.memberInput}
        >
          <MenuItem key={0} value={0}>unassigned</MenuItem>
          {users.map((user: any) => <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>)}
        </Select>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={addMember}
        >
          Добавить пользователя
        </Button>
        {
          /*.filter((user: any) => members.find((member: any) => member === user.id)) */
          users.filter((user: any) => members.find((member: any) => member === user.id) !== undefined).map((user: any) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.username} />
            </ListItem>
          ))
        }
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => createProject(state, title, members)}
        >
          Создать
        </Button>
      </form>
    </div>
  );
}

export default CreateProjectWindow;
