import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { List } from './List';
import { MainHeader } from './MainHeader';

function SingleListPage(props) {
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const { userID } = useParams();
    const { listID } = useParams();
    const nav = useNavigate();

    const navToAllLists = () => {
        nav('/' + userID);
    }

    return (
        <div id='single-list-page'>
            <MainHeader />
            <List navToAllLists={navToAllLists} setUnsavedChanges={setUnsavedChanges} userID ={userID} listID={listID} unsavedChanges={unsavedChanges} />
        </div>
    );
}

export { SingleListPage };
