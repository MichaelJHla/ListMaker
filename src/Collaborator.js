import { httpsCallable } from 'firebase/functions';
import { FaTrash } from 'react-icons/fa';
import { functions } from './FirebaseConfig';

function Collaborator(props) {
    return (
        <div className='collaborator'>
            <h3>{props.text}</h3>
            <button className='trash-button' onClick={() => {
                props.updateActionIsLoading(true);
                const removeCollaborator = httpsCallable(functions, 'removeCollaborator');
                removeCollaborator({removeUser: props.text, listID: props.listID}).then(() => {
                    props.removeCollaborator(props.text);
                    props.updateActionIsLoading(false);
                }).catch((error) => {
                    console.log(error);
                    props.updateActionIsLoading(false);
                    window.alert("Unable to remove collaborator. Please try again.")
                });
            }}>
                <FaTrash />
            </button>
        </div>
    );
}

export { Collaborator };