import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import React, { useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { auth } from "../FirebaseConfig";

function AuthenticateModal(props) {
    const [authenticatePassword, updateAuthenticatePassword] = useState('');

    return(
        <div className='modal-background'>
            <div id='authenticate-modal'>
                <FaTimesCircle id='close-icon' onClick={() => props.closeModal()} />
                <p>In order to complete this action, please enter your password again</p>
                <form id='authenticate-form' onSubmit={(e) => {
                    e.preventDefault();
                    const credential = EmailAuthProvider.credential(auth.currentUser.email, authenticatePassword);
                    reauthenticateWithCredential(auth.currentUser, credential).then(() => {
                        props.submitFunction(props.prevVal);
                    }).catch((error) => {
                        window.alert(error.message);
                    });
                }}>
                    <input type='password' value={authenticatePassword} onChange={(e) => updateAuthenticatePassword(e.target.value)} />
                </form>
            </div>
        </div>
    );
}

export { AuthenticateModal };
