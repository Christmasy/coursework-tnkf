import React, { useEffect, useState } from 'react';

export const appContext = React.createContext({});

function AppContext(props: any) {
  const [state, setState] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      setState(token);
    }
  }, [])

  function setNewState(token: string) {
    localStorage.setItem('token', token);
    setState(token);
  }

  return <appContext.Provider value={{state, setNewState}}>{props.children}</appContext.Provider>
}

export default AppContext;