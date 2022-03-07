import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List } from './List';
import { MainHeader } from './MainHeader';
import { auth } from './FirebaseConfig';

let unsaved = false;

function SingleListPage(props) {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const { userID } = useParams();
    const { listID } = useParams();
    const nav = useNavigate();

    useEffect(() => {
        unsaved = unsavedChanges;
        if ((userID ==='guest' && listID==='list') && auth.currentUser) {
            nav('/' + auth.currentUser.uid);
        }
    });

    const navToAllLists = () => {
        nav('/' + userID);
    }

    return (
        <div id='single-list-page'>
            <MainHeader unsavedChanges={unsavedChanges} />
            <List guestList={(userID==='guest' && listID==='list')} navToAllLists={navToAllLists} setUnsavedChanges={setUnsavedChanges} userID ={userID} listID={listID} unsavedChanges={unsavedChanges} />
        </div>
    );
}

window.addEventListener('beforeunload', function (e) {
    if (unsaved){
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
    }
});

export { SingleListPage };
