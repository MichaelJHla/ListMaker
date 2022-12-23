import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List } from '../Components/List';
import { MainHeader } from '../Components/MainHeader';
import { auth } from '../FirebaseConfig';

function SingleListPage(props) {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const { userID } = useParams();
    const { listID } = useParams();
    const nav = useNavigate();

    useEffect(() => {
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

export { SingleListPage };
