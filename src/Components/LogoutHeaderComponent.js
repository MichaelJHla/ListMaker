import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseConfig';
import { signOut } from 'firebase/auth';

function LogoutHeaderComponent(props) {
    const nav = useNavigate();

    return (
        <div className='sidebar-element logout' onClick={() => {
            if (props.unsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
            
            signOut(auth).then(() => {
                nav('/');
            });
        }}>
            <h2>Logout</h2>
            <div className='svg-container'>
                <FaSignOutAlt />
            </div>
        </div>
    );
}

export { LogoutHeaderComponent };
