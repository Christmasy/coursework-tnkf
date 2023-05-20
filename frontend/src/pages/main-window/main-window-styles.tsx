import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '16px',
    justifyContent: 'center',
  },
  textField: {
    margin: '8px',
    width: '45ch',
  },
  button: {
    margin: '8px',
    height: '5ch',
  },
});
