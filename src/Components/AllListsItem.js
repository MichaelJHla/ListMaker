import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import spinner from '../loading.gif';
import { child, get, ref } from 'firebase/database';
import { database } from '../FirebaseConfig';

function AllListsItem(props) {
    const [text, updateText] = useState(props.listItemText);
    const nav = useNavigate(); //Used to navigate to a given list URL

    useEffect(() => {
        if (text === '') {
            get(child(ref(database), props.userID + '/' + props.listID + '/name')).then((snapshot) => {
                updateText(snapshot.val());
            });
        }
    }, [props.listID, props.userID, text])

    return (
        <div className='all-lists-item' onClick={() => { nav('/' + props.userID + '/' + props.listID); }}>
            {text === '' ? <img className='all-list-spinner' alt='loading' src={spinner} /> : text}
            <span className='open-list' >
                <FaEdit />
            </span>
        </div>
    );    
}

export { AllListsItem };
