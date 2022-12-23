import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';

function AccountHeaderComponent(props) {
    const nav = useNavigate();

    return (
        <div className='sidebar-element account' onClick={() => {
            if (props.unsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) return;
            nav('/account');
        }}>
            <h2>Account</h2>
            <div className='svg-container'>
                <FaUser />
            </div>
        </div> 
    );
}

export { AccountHeaderComponent };
