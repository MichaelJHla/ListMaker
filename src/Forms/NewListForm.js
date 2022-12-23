import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

function NewListForm(props) {
    const [listName, updateListName] = useState('');

    return (
        <form id='new-list-form' onSubmit={(e) => {
            e.preventDefault();
            document.activeElement.blur();
            props.createNewList(listName);
        }}>
            <input type='text' placeholder='New list' onChange={(e) => updateListName(e.target.value)} required />
            <button type='submit'><FaPlus />Add</button>
        </form>
    );
}

export { NewListForm };
