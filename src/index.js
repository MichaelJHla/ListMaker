import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter  } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { MainPage } from './Pages/MainPage';
import './index.css';

//the page will not load until the user is confirmed as signed in or not
onAuthStateChanged(auth, () => {
    ReactDOM.render(
        <BrowserRouter><MainPage /></BrowserRouter>,
        document.getElementById('root')
    );
});
