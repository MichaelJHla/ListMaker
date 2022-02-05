import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaBars } from 'react-icons/fa';
import { auth } from './FirebaseConfig';

function ListItem(props) {
    //Checks if the user is looking at their own list, or at someone else's list
    if (auth.currentUser && auth.currentUser.uid === props.userID) {
        //Display editing options if it is the user's own list
        return (
            <Draggable draggableId={props.itemName} index={props.index}>
                {(provided) => (
                    <li className='list-item' ref={provided.innerRef} {...provided.draggableProps}>
                        <div className='row'>
                            <div className='handle' {...provided.dragHandleProps}>
                                <FaBars />
                            </div>
                            <div className='item-name-wrapper'>
                                <p className='item-name'>{props.itemName}</p>
                            </div>
                            <button className='trash-button' onClick={() => props.deleteItem(props.itemName)}>
                                <FaTrash />
                            </button>
                        </div>
                    </li>            
                )}
            </Draggable>
        );
    } else {
        //Display minimal info if it is not the user's list
        return (
            <li className='list-item'>
                <div className='row'>
                    <div className='item-name-wrapper'>
                        <p className='item-name'>{props.itemName}</p>
                    </div>
                </div>
            </li>            
        );
    }
}

export { ListItem };
