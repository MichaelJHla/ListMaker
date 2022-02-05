import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignInPage } from './SignInPage';
import { AllListsPage } from './AllListsPage';
import { SingleListPage } from './SingleListPage';

function MainPage(props) {
    return (
        <Routes>
            <Route exact path='/' element={<SignInPage />} />
            <Route exact path='/:userID' element={<AllListsPage />} />
            <Route path='/:userID/:listID' element={<SingleListPage />} />
        </Routes>
    );
}

export { MainPage };
