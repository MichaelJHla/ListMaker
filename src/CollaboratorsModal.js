import { httpsCallable } from "firebase/functions";
import { useState } from "react";
import { FaTimesCircle, FaPlus } from 'react-icons/fa';
import { auth, functions } from "./FirebaseConfig";
import { Collaborator } from "./Collaborator";
import spinner from './loading.gif';

function CollaboratorsModal(props) {
    const [actionIsLoading, updateActionIsLoading] = useState(false);
    const [collaborator, updateCollaborator] = useState('');

    const fullList = props.collaborators.map((item, index) => <Collaborator
                                                                    listID={props.listID}
                                                                    removeCollaborator={props.removeCollaborator}
                                                                    key={item}
                                                                    text={item}
                                                                    updateActionIsLoading={updateActionIsLoading}
                                                                />);

    return (
        <div className='modal-background'>
            <div id='collaborators-modal'>
                <FaTimesCircle id='close-icon' onClick={() => props.closeModal()} />
                <h2>Collaborators:</h2>
                {fullList}
                <form id='collaborators-form' onSubmit={(e) => {
                    e.preventDefault();
                    const submitCollaborator = httpsCallable(functions, 'newCollaborator');
                    if (!(props.collaborators.includes(collaborator) || auth.currentUser.email === collaborator)) {
                        updateActionIsLoading(true);
                        submitCollaborator({newUser: collaborator, listID: props.listID}).then(() => {
                            updateActionIsLoading(false);
                            props.addNewCollaborator(collaborator);
                            updateCollaborator('');
                        }).catch((error) => {
                            console.log(error);
                            updateActionIsLoading(false);
                            window.alert("Submission failed. Please check the provided user info, and try again");
                        });
                    } else {
                        window.alert("Unable to add a user as a collaborator twice.");
                    }
                }}>
                    <input type='email' value={collaborator} onChange={(e) => updateCollaborator(e.target.value)} placeholder='User email' required />
                    <button type='input'>Add <FaPlus /></button>
                </form>
                {actionIsLoading ? <img id='spinner' alt='loading' src={spinner} /> : null}
            </div>
        </div>
    );
}

export { CollaboratorsModal };
