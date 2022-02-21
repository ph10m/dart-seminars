import './App.css';
import firebase from 'firebase/compat/app';
import { useState, useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Button, Fab } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const FloatWithIcon = ({Icon, text, ...props }) => (
  <Fab variant="extended" {...props}>
    <Icon sx={{ mr: 1 }}/>
    {text}
  </Fab>
)

function App({loginConfig}) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    // Make sure we un-register Firebase observer
    // when the component unmounts.
    return () => unregisterAuthObserver(); 
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <FloatWithIcon
          Icon={LoginIcon}
          text="Login"
          onClick={() => setLoginPrompt(true)}
        />
        {loginPrompt && (
          <StyledFirebaseAuth uiConfig={loginConfig} firebaseAuth={firebase.auth()} />
        )}
      </div>
    );
  }
  return (
    <div className="App">
      <h1>DART Internal Seminars</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}</p>
      <FloatWithIcon
        Icon={LogoutIcon}
        text="Sign out"
        onClick={() => firebase.auth().signOut()}
      />
    </div>
  );
}

export default App;
