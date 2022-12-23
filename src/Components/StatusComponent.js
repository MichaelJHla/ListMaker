import React from 'react';

const red = 'red';
const green = 'green';

var success = 'Success!';
var failure = 'Failure';

function StatusComponent(props) {
    if (props.successMessage) success = props.successMessage;
    if (props.failureMessage) failure = props.failureMessage;

    return (
        <h4 id='status-message' style={{backgroundColor: props.success ? green : red}}>{props.success ? success : failure}</h4>
    );
}

export { StatusComponent };
