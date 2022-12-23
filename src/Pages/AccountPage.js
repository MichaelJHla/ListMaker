import React, { useEffect, useState } from 'react';
import { MainHeader } from '../Components/MainHeader';
import { ref, get, child } from 'firebase/database';
import { auth, database, functions } from '../FirebaseConfig';
import { AuthenticateModal } from '../Modals/AuthenticateModal';
import { deleteUser, updateEmail, updatePassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { StatusComponent } from '../Components/StatusComponent';
import { AccountForm } from '../Forms/AccountForm';
import { httpsCallable } from 'firebase/functions';
import { Loading } from '../Loading';

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

    const [isLoading, updateIsLoading] = useState(false);

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
        updateIsLoading(true);
        updateName({name: newName}).then(() => {
            updateIsLoading(false);
            updateSuccessMessage(NameSuccess);
            changeMessage(true);
        });
    }

    const submitEmail = (newEmail) => {
        updateIsLoading(true);
        updateEmail(auth.currentUser, newEmail).then(() => {
            updateIsLoading(false);
            updateSuccessMessage(EmailSuccess);
            changeMessage(true);
            modal = null;
            updateShowModal(false);

            const updateEmailInDatabase = httpsCallable(functions, 'updateEmailInDatabase');
            updateEmailInDatabase();
        }).catch((error) => {
            updateIsLoading(false);
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
        updateIsLoading(true);
        updatePassword(auth.currentUser, newPassword).then(() => {
            updateIsLoading(false);
            updateSuccessMessage(PasswordSuccess);
            changeMessage(true);
            modal = null;
            updateShowModal(false);
            updateUserPassword1('');
            updateUserPassword2('');
        }).catch((error) => {
            updateIsLoading(false);
            if (error.code.includes('requires-recent-login')) {
                modal = <AuthenticateModal closeModal={closeModal} prevVal={newPassword} submitFunction={submitPassword} />
                updateShowModal(true);
            } else {
                updateFailMessage(error.message);
                changeMessage(false);
            }
        });
    }

    const deleteCurrentUser = () => {
        if (window.confirm("Are you sure you want to delete your account? This is permanent and all data associated with your account will be deleted.")) {
            updateIsLoading(true);
            deleteUser(auth.currentUser).then(() => {
                nav('/');
            }).catch((error) => {
                console.log(error);
                updateIsLoading(false);
                if (error.code.includes('requires-recent-login')) {
                    modal = <AuthenticateModal closeModal={closeModal} submitFunction={deleteCurrentUser} />
                    updateShowModal(true);
                } else {
                    updateFailMessage(error.message);
                    changeMessage(false);
                }
            });
        }
    };

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

                <button id='delete-account' onClick={() => deleteCurrentUser()}>Delete Account</button>
            </div>
            {showMessage ? <StatusComponent success={saveSuccessful} successMessage={successMessage} failureMessage={failMessage} /> : null}
            {showModal ? modal : null}
            {isLoading ? <Loading /> : null}
        </div>
    );
}

export { AccountPage };
