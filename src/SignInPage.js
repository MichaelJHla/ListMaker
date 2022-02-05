import React, { useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, functions } from './FirebaseConfig';

function SignInPage(props) {
    const nav = useNavigate();

    useEffect(() => { //If the user is signed in, then load their lists
        if (auth.currentUser) {
            nav('/' + auth.currentUser.uid);
        }
    }, [nav]);

    return (
        <div id='sign-in-page'>
            <h1>Welcome to My Ranks Lists</h1>
            <h2>Please enter your email to get started</h2>
            <form id='login-form' onSubmit={(e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                signInWithEmailAndPassword(auth, email, 'ListPassword').then(() => {
                    nav('/' + auth.currentUser.uid);
                })
                .catch((error) => { //If error is no user for this email, create a new user with the email
                    if (error.code.includes('user-not-found')) {
                        createUserWithEmailAndPassword(auth, email, 'ListPassword').then(() => {
                            const newEntry = httpsCallable(functions, 'createUserInDatabase');
                            newEntry().then(() => {
                                nav('/' + auth.currentUser.uid);
                            });
                        });
                    } else {
                        window.alert(error.message);
                    }
                });
            }}>
                <input id='email' type='email' placeholder='Email' required />
                <button type='submit'>View Lists</button>
            </form>
        </div>
    );
}

export { SignInPage };
