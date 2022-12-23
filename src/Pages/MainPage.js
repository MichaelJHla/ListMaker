import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignInPage } from './SignInPage';
import { AllListsPage } from './AllListsPage';
import { SingleListPage } from './SingleListPage';
import { AccountPage } from './AccountPage';

function MainPage(props) {
    return (
        <Routes>
            <Route exact path='/' element={<SignInPage />} />
            <Route exact path='/:userID' element={<AllListsPage />} />
            <Route exact path='/:userID/:listID' element={<SingleListPage />} />
            <Route exact path='/account' element={<AccountPage />} />
        </Routes>
    );
}

export { MainPage };
