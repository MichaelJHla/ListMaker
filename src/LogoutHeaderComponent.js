import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { auth } from './FirebaseConfig';
import { signOut } from 'firebase/auth';

function LogoutHeaderComponent(props) {
    const nav = useNavigate();

    return (
        <div className='sidebar-element logout' onClick={() => {
            signOut(auth).then(() => {
                nav('/');
            });
        }}>
            <h2>Logout</h2>
            <FaSignOutAlt />
        </div>
    );
}

export { LogoutHeaderComponent };
