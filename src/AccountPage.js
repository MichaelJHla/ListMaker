import React, { useEffect, useState } from 'react';
import { MainHeader } from './MainHeader';
import { ref, get, child } from 'firebase/database';
import { auth, database, functions } from './FirebaseConfig';
import { AuthenticateModal } from './AuthenticateModal';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { StatusComponent } from './StatusComponent';
import { AccountForm } from './AccountForm';
import { httpsCallable } from 'firebase/functions';
import { Loading } from './Loading';

let modal = null;

const NameSuccess = 'Successful name update!';
const EmailSuccess = 'Successful email update!';
const PasswordSuccess = 'Successful password update!';

function AccountPage(props) {
    const [userEmail, updateUserEmail] = useState('');
    const [userPassword1, updateUserPassword1] = useState('');
    const [userPassword2, updateUserPassword2] = useState('');
    const [userName, updateUserName] = useState('');
    const [showModal, updateShowModal] = useState(false);

    const [successMessage, updateSuccessMessage] = useState('');
    const [failMessage, updateFailMessage] = useState('Unsuccessful');
    const [showMessage, updateShowMessage] = useState(false);
    const [saveSuccessful, updateSaveSuccessful] = useState(true);

    const nav = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            nav('/');
        } else {
            get(child(ref(database), auth.currentUser.uid + '/name')).then((snapshot) => {
                if (snapshot.val() != null) updateUserName(snapshot.val());
                updateUserEmail(auth.currentUser.email);
            });    
        }
    }, [nav]);

    const changeMessage = (success) => {
        updateSaveSuccessful(success);
        updateShowMessage(true);
        setTimeout(() => {
            updateShowMessage(false);
        }, 2500);
    }

    const closeModal = () => {
        modal = null;
        updateShowModal(false);
    }

    const submitName = (newName) => {

        const updateName = httpsCallable(functions, 'updateName');
        updateName({name: newName}).then(() => {
            updateSuccessMessage(NameSuccess);
            changeMessage(true);
        });
    }

    const submitEmail = (newEmail) => {
        updateEmail(auth.currentUser, newEmail).then(() => {
            updateSuccessMessage(EmailSuccess);
            changeMessage(true);
            modal = null;
            updateShowModal(false);
        }).catch((error) => {
            if (error.code.includes('requires-recent-login')) {
                modal = <AuthenticateModal closeModal={closeModal} prevVal={newEmail} submitFunction={submitEmail} />
                updateShowModal(true);
            } else {
                updateFailMessage(error.message);
                changeMessage(false);
            }
        });
    }

    const submitPassword = (newPassword) => {
        updatePassword(auth.currentUser, newPassword).then(() => {
            updateSuccessMessage(PasswordSuccess);
            changeMessage(true);
            modal = null;
            updateShowModal(false);
            updateUserPassword1('');
            updateUserPassword2('');
        }).catch((error) => {
            if (error.code.includes('requires-recent-login')) {
                modal = <AuthenticateModal closeModal={closeModal} prevVal={newPassword} submitFunction={submitPassword} />
                updateShowModal(true);
            } else {
                updateFailMessage(error.message);
                changeMessage(false);
            }
        });
    }

    return (
        <div id='account-page'>
            <MainHeader />
            <h1>Your Account</h1>
            <hr />
            <div id='forms'>
                <AccountForm headerText='Name' submit={submitName} text={userName} updateText={updateUserName} />
                <AccountForm headerText='Email' submit={submitEmail} text={userEmail} updateText={updateUserEmail} />

                <form onSubmit={(e) => {
                    e.preventDefault();
                    document.activeElement.blur();
                    if (userPassword1 !== userPassword2) {
                        updateUserPassword1('');
                        updateUserPassword2('');
                        updateFailMessage('Passwords did not match.');
                        changeMessage(false);
                    } else {
                        submitPassword(userPassword1, updateShowModal);
                    }
                }}>
                    <h2>Update Password</h2>
                    <input type='password' value={userPassword1} onChange={(e) => updateUserPassword1(e.target.value)} placeholder='New Password' required />
                    <input type='password' value={userPassword2} onChange={(e) => updateUserPassword2(e.target.value)} placeholder='Confirm Password' required />
                    <button type='submit'>Update</button>
                </form>
            </div>
            {showMessage ? <StatusComponent success={saveSuccessful} successMessage={successMessage} failureMessage={failMessage} /> : null}
            {showModal ? modal : null}
            <Loading />
        </div>
    );
}

export { AccountPage };
