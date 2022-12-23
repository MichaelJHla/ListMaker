import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

function CreateAccountHeaderComponent(props) {
    const nav = useNavigate();
    return (
        <div className='sidebar-element create-account' onClick={() => nav('/')}>
            <h2>Create Account</h2>
            <div className='svg-container'>
                <FaUserPlus />
            </div>
        </div>
    );
}

export { CreateAccountHeaderComponent };
