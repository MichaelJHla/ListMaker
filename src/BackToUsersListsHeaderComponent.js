import { useNavigate } from 'react-router-dom';
import { FaReply } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

function BackToUsersListsHeaderComponent(props) {
    const { userID } = useParams();
    const nav = useNavigate();

    return (
        <div className='sidebar-element back-to-lists' onClick={() => nav('/' + userID)}>
            <h2>Back</h2>
            <div className='svg-container'>
                <FaReply />
            </div>
        </div> 
    );
}

export { BackToUsersListsHeaderComponent };
