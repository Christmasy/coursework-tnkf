import { NavigateFunction } from 'react-router-dom';

export async function login(
  email: string,
  password: string,
  setState: (token: string) => void,
  navigate: NavigateFunction,
  setError: (hasError: boolean) => void
){
  console.log(process.env.REACT_APP_API_URL);
  const result = await fetch(process.env.REACT_APP_API_URL + '/login', {mode: 'no-cors', method:'POST', body:JSON.stringify({username:email, password}), headers:{'Content-Type':'application/json'}});
  if(result.status === 401) {
    setError(true);
    return;
  }
  const token = (await result.json()).data;
  setState(token);
  navigate('/tasks');
}