import React, { useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, functions } from './FirebaseConfig';
import { Loading } from './Loading';

function SignInPage(props) {
    const nav = useNavigate();

    const [isLoading, updateIsLoading] = useState(false);

    useEffect(() => { //If the user is signed in, then load their lists
        if (auth.currentUser) {
            nav('/' + auth.currentUser.uid);
        }
    }, [nav]);

    return (
        <div id='sign-in-page'>
            <h1 id='site-title'><span>Welcome to</span>My Ranks Lists</h1>
            <hr />
            <p>This web app was designed to help save and share ranked lists (e.g., My Favorite Games, Best Movies Ever). You can create ordered and unordered lists which you can edit, download, and share with your friends!</p>
            <button id='new-list-button' onClick={() => {nav('/guest/list')}}>Create a new list</button>
            <h4>Or</h4>
            <form id='login-form' onSubmit={(e) => {
                e.preventDefault();
                document.activeElement.blur();

                updateIsLoading(true);

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                signInWithEmailAndPassword(auth, email, password).then(() => {
                    nav('/' + auth.currentUser.uid);
                }).catch((error) => { //If error is no user for this email, create a new user with the email
                    if (error.code.includes('user-not-found')) {
                        createUserWithEmailAndPassword(auth, email, password).then(() => {
                            const newEntry = httpsCallable(functions, 'createUserInDatabase');

                            newEntry().then(() => {
                                const list = JSON.parse(sessionStorage.getItem('list'));
                                const listName = sessionStorage.getItem('listName');

                                if ((list != null || list === '') && (listName != null || listName === '')) {
                                    const makeList = httpsCallable(functions, 'makeList');
                                    const newObj = {
                                        name: listName,
                                        list: list,
                                        ol: true
                                    }

                                    makeList(newObj).then((result) => {
                                        window.location.replace('/' + auth.currentUser.uid);
                                    });
                                } else {
                                    window.location.replace('/' + auth.currentUser.uid);
                                }
                            });
                        });
                    } else {
                        updateIsLoading(false);
                        window.alert(error.message);
                    }
                });
            }}>
                <h2>Login/Sign Up</h2>
                <div id='inputs'>
                    <label htmlFor='email'>Email:</label>
                    <input id='email' type='email' required />
                    <label htmlFor='password'>Password:</label>
                    <input id='password' type='password' required />
                </div>
                <div id='buttons'>
                    <button type='submit'>Continue</button>
                    <button onClick={() => {
                        const email = document.getElementById('email').value;
                        sendPasswordResetEmail(auth, email).then(() => {
                            window.alert('Password reset email sent to ' + email);
                        }).catch((error) => {
                            window.alert(error.message);
                        });
                    }}>Forgot Password?</button>
                </div>
            </form>
            {isLoading ? <Loading /> : null}
        </div>
    );
}

export { SignInPage };
