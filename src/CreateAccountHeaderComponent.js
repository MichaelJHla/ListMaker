import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';

function CreateAccountHeaderComponent(props) {
    return (
        <Link to={'/'}>
            <div className='sidebar-element create-account'>
                <h2>Create Account</h2>
                <FaUserPlus />
            </div>
        </Link>
        
    );
}

export { CreateAccountHeaderComponent };
