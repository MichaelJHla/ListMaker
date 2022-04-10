import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaBars } from 'react-icons/fa';
import { auth } from './FirebaseConfig';
import TextareaAutosize from 'react-textarea-autosize';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemName: this.props.itemName
        };

        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleItemChange(e) {
        this.setState({
            itemName: e.target.value
        });
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            e.target.blur();
        } else {
            e.target.style.height = 'inherit';
            e.target.style.height = `${e.target.scrollHeight}px`; 
        }
    }

    handleBlur() {
        this.props.updateListItemText(this.props.index, this.state.itemName);
    }

    render() {
        //Checks if the user is looking at their own list, or at someone else's list
        if ((auth.currentUser && auth.currentUser.uid === this.props.userID) || this.props.guestList || (auth.currentUser && this.props.collaborators.includes(auth.currentUser.uid))) {
            //Display editing options if it is the user's own list
            return (
                <Draggable draggableId={this.props.itemName} index={this.props.index}>
                    {(provided) => (
                        <li className='list-item' ref={provided.innerRef} {...provided.draggableProps}>
                            <div className='row'>
                                <div className='handle' {...provided.dragHandleProps}>
                                    <FaBars />
                                </div>
                                <div className='item-name-wrapper'>
                                    <TextareaAutosize type='text' className='item-name' value={this.state.itemName} onChange={this.handleItemChange} onBlur={this.handleBlur} onKeyDown={this.handleKeyPress} />
                                </div>
                                <button className='trash-button' onClick={() => this.props.deleteItem(this.props.itemName)}>
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
                            <p className='item-name'>{this.props.itemName}</p>
                        </div>
                    </div>
                </li>            
            );
        }
    }
}

export { ListItem };
