import { useNavigate } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { auth } from './FirebaseConfig';

function BackToMyListsHeaderComponent(props) {
    const nav = useNavigate();

    return (
        <div className='sidebar-element back-to-lists' onClick={() => {
            if (props.unsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
            nav('/' + auth.currentUser.uid);
        }}>
            <h2>Your Lists</h2>
            <div className='svg-container'>
                <FaReply />
            </div>
        </div> 
    );
}

export { BackToMyListsHeaderComponent };
