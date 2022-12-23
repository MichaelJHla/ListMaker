import React from "react";
import spinner from './loading.gif';

function Loading(props) {
    return (
        <div id='loading-div'>
            <img id='spinner' alt='loading' src={spinner} />
        </div>
    );
}

export { Loading };
