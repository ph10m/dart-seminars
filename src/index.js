import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { collection, doc, setDoc } from "firebase/firestore"; 

import {
  EmailAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

import firebase from 'firebase/compat/app';
import { getFirestore } from 'firebase/firestore'
import 'firebase/compat/auth';

import {previous_seminars} from "./data/seminars"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_MSG,
  appId: process.env.REACT_APP_ID
};
firebase.initializeApp(firebaseConfig);
const db = getFirestore();

const upload  = async() => {

  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function getDateOfWeek(w, y) {
    var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week
    return new Date(y, 0, d);
  }
  const semref = collection(db, "seminars")
  previous_seminars.forEach(async(sem) => {
    console.log(sem)
    var date = getDateOfWeek(sem.week, 2021)
    date = date.toISOString()

    console.log(date)
    const id = uuidv4()
    await setDoc(doc(semref, id), {
      id: id,
      topic: sem.what,
      presenter: sem.who,
      date: date,
      link: sem.link,
      description: "",
    });
  })
}
// upload()


const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/signedIn',
  signInOptions: [
    EmailAuthProvider.PROVIDER_ID,
    {
      provider: GoogleAuthProvider.PROVIDER_ID,
      scopes: [
        'https://www.googleapis.com/auth/contacts.readonly'
      ],
      customParameters: {
        prompt: 'select_account'
      }
    },
    GithubAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App loginConfig={uiConfig} db={db}/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
