import React from 'react';
import { FaShareAlt } from 'react-icons/fa';

function ShareHeaderComponent(props) {
    return (
        <div className='sidebar-element share' onClick={() => {
            if (navigator.canShare) {
                navigator.share({
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href).then(function() {
                    window.alert('URL copied to clipboard!');
                });
            }
        }}>
            <h2>Share</h2>
            <div className='svg-container'>
                <FaShareAlt />
            </div>
        </div>
    );
}

export { ShareHeaderComponent };
