import { Link } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { auth } from './FirebaseConfig';

function BackToMyListsHeaderComponent(props) {
    return (
        <Link to={'/' + auth.currentUser.uid}>
            <div className='sidebar-element back-to-lists'>
                <h2>Back To My Lists</h2>
                <FaReply />
            </div> 
        </Link>
    );
}

export { BackToMyListsHeaderComponent };
