import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

function AllListsItem(props) {
    const nav = useNavigate(); //Used to navigate to a given list URL

    return (
        <div className='all-lists-item' onClick={() => { nav('/' + props.userID + '/' + props.listID); }}>
            {props.listItemText}
            <span className='open-list' >
                <FaEdit />
            </span>
        </div>
    );    
}

export { AllListsItem };
