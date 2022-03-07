import React from 'react';
import { auth } from './FirebaseConfig';
import { LogoutHeaderComponent } from './LogoutHeaderComponent';
import { useLocation, useParams } from 'react-router-dom';
import { BackToMyListsHeaderComponent } from './BackToMyListsHeaderComponent';
import { BackToUsersListsHeaderComponent } from './BackToUsersListsHeaderComponent';
import { CreateAccountHeaderComponent } from './CreateAccountHeaderComponent';
import { ShareHeaderComponent } from './ShareHeaderComponent';
import { ReactComponent as Logo } from './image2vector.svg';
import { AccountHeaderComponent } from './AccountHeaderComponent';

function MainHeader(props) {
    const { userID } = useParams();
    const { listID } = useParams();
    const location = useLocation();


    let headerElements = [];

    if (!auth.currentUser) { //If not logged in
        if (listID != null && userID !== 'guest') { //If viewing a list
            headerElements.push(<BackToUsersListsHeaderComponent key={headerElements.length} />);
        }

        headerElements.push(<CreateAccountHeaderComponent inGuestList={listID === 'list'} key={headerElements.length} />);
    } else { //If logged in
        if (listID == null && userID === auth.currentUser.uid) {
            headerElements.push(<ShareHeaderComponent key={headerElements.length} />);
        //If viewing your own list, or viewing the all list page of someone else
        } else if ((userID !== auth.currentUser.uid && listID == null) || (userID === auth.currentUser.uid && listID != null)) {
            headerElements.push(<BackToMyListsHeaderComponent key={headerElements.length} unsavedChanges={props.unsavedChanges} />);
        } else if (userID !== auth.currentUser.uid && listID != null) { //If viewing someone else's list
            headerElements.push(<BackToUsersListsHeaderComponent key={headerElements.length} />);
        }
        
        if (location.pathname.includes('account')) {
            headerElements.push(<LogoutHeaderComponent key={headerElements.length} unsavedChanges={props.unsavedChanges} />);
        } else {
            headerElements.push(<AccountHeaderComponent key={headerElements.length} unsavedChanges={props.unsavedChanges} />);
        }
    }

    return (
        <header>
            <Logo id='header-logo' className='logo-svg' />
            <div className='sidebar'>
                {headerElements}
            </div>
        </header>
    );
}

export { MainHeader };
