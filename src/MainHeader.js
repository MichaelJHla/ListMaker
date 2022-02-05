import React from 'react';
import { auth } from './FirebaseConfig';
import { LogoutHeaderComponent } from './LogoutHeaderComponent';
import { useParams } from 'react-router-dom';
import { BackToMyListsHeaderComponent } from './BackToMyListsHeaderComponent';
import { BackToUsersListsHeaderComponent } from './BackToUsersListsHeaderComponent';
import { CreateAccountHeaderComponent } from './CreateAccountHeaderComponent';

function MainHeader(props) {
    const { userID } = useParams();
    const { listID } = useParams();

    let headerElements = [];

    if (!auth.currentUser) { //If not logged in
        if (listID != null) { //If viewing a list
            headerElements.push(<BackToUsersListsHeaderComponent key={headerElements.length} />);
        }
        headerElements.push(<CreateAccountHeaderComponent key={headerElements.length} />);
    } else { //If logged in
        //If viewing your own list, or viewing the all list page of someone else
        if ((userID !== auth.currentUser.uid && listID == null) || (userID === auth.currentUser.uid && listID != null)) {
            headerElements.push(<BackToMyListsHeaderComponent key={headerElements.length} />);
        } else if (userID !== auth.currentUser.uid && listID != null) { //If viewing someone else's list
            headerElements.push(<BackToUsersListsHeaderComponent key={headerElements.length} />);
        }
        headerElements.push(<LogoutHeaderComponent key={headerElements.length} />);
    }

    return (
        <header>
            <h1>My Rank Lists</h1>
            <div className='sidebar'>
                {headerElements}
            </div>
        </header>
    );
}

export { MainHeader };
