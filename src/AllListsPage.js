import React, { useEffect, useState } from 'react';
import { auth, database, functions } from './FirebaseConfig';
import { ref, child, get } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import { AllListsItem } from './AllListsItem';
import { NewListForm } from './NewListForm';
import { MainHeader } from './MainHeader';
import { makeID } from './MakeID';
import { httpsCallable } from 'firebase/functions';

function AllListsPage(props) {
    //Create new state to represent the array of lists
    const [userMap, updateUserMap] = useState(new Map()); //This map assigns the key to the list name, and the value as the listID
    const [userName, updateUserName] = useState('');
    const [loaded, setLoaded] = useState(false); //Tracks if data is loaded from database
    const { userID } = useParams();
    const nav = useNavigate();

    //Runs whenever the component is mounted
    useEffect(() => {
        get(child(ref(database), userID)).then((snapshot) => {
            const val = snapshot.val();

            if (val != null) {
                if (val['name'] != null) updateUserName(val['name']);
                let m = new Map();
                for (let l in val) {
                    if (l !== userID && l !== 'name') m.set(l, val[l]['name']);
                }
                updateUserMap(m);
            } else {
                updateUserMap(null);
            }
            setLoaded(true);
        });
    }, [userID]);

    //Creates a new list for the user in the database with an example item,
    // then the user is navigated to the new list
    const createNewList = (listName) => {
        const trimmedListName = listName.trim();
        
        const newID = makeID(6);
        const newObj = {
            name: trimmedListName,
            list: { 0: 'Example item' },
            ol: true,
            listID: newID
        }

        const makeList = httpsCallable(functions, 'makeList');

        const newListPath = userID + '/' + newID;
        makeList(newObj).then(() => {
            nav('/' + newListPath);
        });
    }

    if (loaded) { //Display proper info once loaded
        const newListForm = (auth.currentUser && auth.currentUser.uid === userID) ? <NewListForm createNewList={(listName) => createNewList(listName)}/> : <></>;

        let all = [];
        if (userMap != null) {
            all = Array.from(userMap.keys()).map(l => <AllListsItem listID={l} listItemText={userMap.get(l)} key={l} userID={userID} />);
        }

        return (<div id='all-lists-page'>
                <MainHeader />
                <h1>{userName !== '' ? userName + "'s Lists" : 'All Lists'}</h1>
                <hr />
                {newListForm}
                {all.length > 0 ? <div id='all-lists'>{all}</div> : <h3>No list found</h3> }
            </div>
        );
    } else { //Display loading text while loading data
        return(
            <div id='all-lists-page'>
                <MainHeader />
                <h3>Loading...</h3>
            </div> 
        );
    }
}

export { AllListsPage };
