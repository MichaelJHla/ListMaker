import React, { useEffect, useState } from 'react';
import { auth, database } from './FirebaseConfig';
import { ref, child, get, set } from 'firebase/database';
import { useNavigate, useParams } from 'react-router-dom';
import { AllListsItem } from './AllListsItem';
import { NewListForm } from './NewListForm';
import { MainHeader } from './MainHeader';

function AllListsPage(props) {
    //Create new state to represent the array of lists
    const [userMap, updateUserMap] = useState(new Map()); //This map assigns the key to the list name, and the value as the listID
    const [loaded, setLoaded] = useState(false); //Tracks if data is loaded from database
    const { userID } = useParams();
    const nav = useNavigate();

    //Runs whenever the component is mounted
    useEffect(() => {
        get(child(ref(database), userID)).then((snapshot) => {
            const val = snapshot.val();
            if (val != null) {
                let m = new Map();
                for (let l in val) {
                    if (l !== userID) m.set(l, val[l]['name']);
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
            list: { 0: 'Example item' }
        }

        const newListPath = userID + '/' + newID;
        set(ref(database, newListPath), newObj).then(() => {
            nav('/' + newListPath);
        });
    }

    if (loaded) { //Display proper info once loaded
        if (userMap != null) {
            const all = Array.from(userMap.keys()).map(l => <AllListsItem listID={l} listItemText={userMap.get(l)} key={l} userID={userID} />);

            return (
                <div id='all-lists-page'>
                    <MainHeader />
                    <NewListForm createNewList={(listName) => createNewList(listName)}/>
                    <div id='all-lists'>{all}</div>
                </div>
            );
        } else {
            //If no list is found, display error
            if (auth.currentUser) {
                return (
                    <div id='all-lists-page'>
                        <MainHeader />
                        <NewListForm createNewList={(listName) => createNewList(listName)}/>
                        <h3>No lists found for this user</h3>
                    </div>                
                );
            } else {
                return (
                    <div id='all-lists-page'>
                        <MainHeader />
                        <h3>No lists found for this user</h3>
                    </div>                
                );
            }
        }
    } else { //Display loading text while loading data
        return(
            <div id='all-lists-page'>
                <MainHeader />
                <h3>Loading...</h3>
            </div> 
        );
    }
}

function makeID(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export { AllListsPage };
