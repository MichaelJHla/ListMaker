import React from "react";

function AccountForm(props) {
    return (
        <form className='account-form' onSubmit={(e) => {
            e.preventDefault();
            props.submit(props.text);
            document.activeElement.blur();
        }}>
            <h2>Update {props.headerText}</h2>
            <input type='text' value={props.text} onChange={(e) => props.updateText(e.target.value)} placeholder={'Your ' + props.headerText} />
            <button type='submit'>Update</button>
        </form>
    );
}

export { AccountForm };
