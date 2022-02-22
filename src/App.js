import './App.css';
import firebase from 'firebase/compat/app';
import { useState, useEffect, Fragment } from 'react';
import ResponsiveAppBar from './components/Topbar';
import PopupLogin from './components/PopupLogin';
import { collection, onSnapshot, getDocs, doc, addDoc } from 'firebase/firestore';
import SeminarCard from './components/card';
import { Box, Grid, Typography } from '@mui/material';
import { FloatWithIcon } from './components/FloatWithIcon';
import { Add } from '@mui/icons-material';
import SeminarForm from './components/SeminarForm';
import { uuidv4 } from './util/uuid';
import moment from 'moment';
import { dateConvert } from './util/date';

function App({loginConfig, db}) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [seminars, setSeminars] = useState(null)
  const [editingSeminar, setEditingSeminar] = useState(null);
  const [input, setInput] = useState("");

  const user = firebase.auth().currentUser;

  useEffect(() => {
    onSnapshot(collection(db, "seminars"), (snapshot) => {
      setSeminars(snapshot.docs.map(doc => doc.data()))
    })
  }, [input])

  const addSeminar = (e) => {
    e.preventDefault();
    setSeminars([...seminars, input]);
    setInput("")
  };

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    // Make sure we un-register Firebase observer
    // when the component unmounts.
    return () => unregisterAuthObserver(); 
  }, []);

  const signIn = () => {
    setLoginPrompt(true)
  }
  const signOut = () => {
    setLoginPrompt(false)
    firebase.auth().signOut()
  }

  const newSeminar = () => {
    const seminarTemplate = {
      date: moment().toISOString(),
      description: "please provide a description, or more URLs",
      id: uuidv4(),
      link: "http://example.com",
      topic: "Headline/topic",
      presenter: user.displayName,
    }
    setEditingSeminar(seminarTemplate)
  }

  const editSeminar = (seminar) => {
    setEditingSeminar(seminar);
  }

  // sort 
  if (seminars) {
    seminars.sort(function(a, b) {
      const date1 = new Date(a.date)
      const date2 = new Date(b.date)

      if (date1 > date2) return -1;
      if (date1 < date2) return 1;
      return 0;
    })
  }

  const firstSeminar = seminars[0];

  return (
    <div className="App">
      <ResponsiveAppBar
        logo="DART - Internal Seminars (logo?)"
        user={user}
        signedIn={isSignedIn}
        loginAction={signIn}
        logoutAction={signOut}
        newSeminar={newSeminar}
      />
      {/* <Grow in={loginPrompt}>
        <div id="signin-prompt">
          <h2>Sign in using one of the below services</h2>
          <StyledFirebaseAuth uiConfig={loginConfig} firebaseAuth={firebase.auth()} />
          <Button variant="outlined" color="secondary" onClick={() => setLoginPrompt(false)}>Cancel</Button> 
        </div>
      </Grow> */}
      {!isSignedIn && (
        <PopupLogin
          isOpen={loginPrompt}
          onCancel={() => setLoginPrompt(false)}
          auth={firebase.auth()}
          loginConfig={loginConfig}
        />
      )}
      {user && editingSeminar && (
        <SeminarForm
          isOpen={!!editingSeminar}
          db={db}
          seminar={editingSeminar}
          editFn={setEditingSeminar}
        />
      )}
      <div className="content">
        {moment(firstSeminar.date) > moment() && (
          <>
            <Typography variant="h2" fontSize={50} padding={2} marginTop={3}>
              Next up
            </Typography>
            <Typography variant="h5">{firstSeminar.topic}</Typography>
            <Typography>by {firstSeminar.presenter}</Typography>
            <Typography variant="overline">
              {dateConvert(firstSeminar.date)}
            </Typography>
          </>
        )}
        {seminars && (
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={3}
            padding={6}
          >
            {seminars.map((seminar, i) => (
              <Fragment key={i}>
                {seminar.topic && (
                <Grid item xs="auto" key={seminar.date}>
                    <SeminarCard
                      data={seminar}
                      editable={user}
                      onEdit={() => editSeminar(seminar)}
                    />
                </Grid>
                )}
              </Fragment>
            ))}
          </Grid>
        )}
      </div>
    </div>
  );
}

export default App;
