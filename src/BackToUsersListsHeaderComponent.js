import { Link } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function BackToUsersListsHeaderComponent(props) {
    const { userID } = useParams();

    return (
        <Link to={'/' + userID}>
            <div className='sidebar-element back-to-lists'>
                <h2>Back To This User's Lists</h2>
                <FaReply />
            </div> 
        </Link>
    );
}

export { BackToUsersListsHeaderComponent };
