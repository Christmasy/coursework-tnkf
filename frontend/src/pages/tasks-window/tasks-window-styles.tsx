import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
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
    marginTop: theme.spacing(4),
    justifyContent: 'center',
  },
  textField: {
    margin: theme.spacing(2),
    width: '45ch',
  },
  button: {
    margin: theme.spacing(2),
    height: '5ch',
  },
  card: {
    display: 'flex',
    width: '30vw',
    transitionDuration: '0.3s'
  }
}));
