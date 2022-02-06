import React from 'react';
import { database, auth } from './FirebaseConfig';
import { ref, child, get, set, remove } from 'firebase/database';
import { arrayMoveImmutable } from 'array-move';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ListOptions } from './ListOptions';
import { ListItem } from './ListItem';
import { NewItemForm } from './NewItemForm';

class List extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            listName: '',
            recentSavedListName: '',
            listItems: [],
            recentSavedItems: [],
            message: '',
            messageColor: 'green',
            display: 'none',
            loaded: false
        }
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.saveList = this.saveList.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.clearMessage = this.clearMessage.bind(this);
        this.updateListState = this.updateListState.bind(this);
        this.createFile = this.createFile.bind(this);
    }

    componentDidMount() {
        get(child(ref(database), this.props.userID + '/' + this.props.listID)).then((snapshot) => {
            const val = snapshot.val();
            if (val == null) {
                this.setState({
                    listName: null,
                    loaded: true
                });
            } else {
                if (val['list'] != null) {
                    this.setState({
                        listItems: val['list'],
                        recentSavedItems: val['list']
                    });
                }
                this.setState({
                    listName: val['name'],
                    recentSavedListName: val['name'],
                    loaded: true
                });
            }
        });
    }

    //This function is used to generate a txt file with the content of the list
    createFile() {
        const list = this.state.listItems;
        let fileString = this.state.listName + '\n\n';
        for (let i = 1; i <= list.length; i++) {
            fileString += i + '. ' + list[i - 1] + '\n';
        }
        let a = document.getElementById('a');
        const file = new Blob([fileString], {type: 'text/plain'});
        a.href = URL.createObjectURL(file);
        a.download = this.state.listName + '.txt';
    }

    //Needed for Draggable
    handleOnDragEnd(result) {
        if (!result.destination) return;
        const newArr = arrayMoveImmutable(this.state.listItems, result.source.index, result.destination.index);
        this.updateListState(newArr);
    }

    //Push the new item to the end of the list
    addNewItem(itemName) {
        if (this.state.listItems.includes(itemName)) { //Prevent repeats
            window.alert('No repeat items are allowed in a list');
            return;
        } 

        let newArr = this.state.listItems.slice();
        newArr.push(itemName);
        this.updateListState(newArr);
    }

    //Remove an item with the given name
    deleteItem(itemName) {
        let newArr = this.state.listItems.slice();
        const index = newArr.indexOf(itemName);
        newArr.splice(index, 1);
        this.updateListState(newArr);
    }

    //Deletes the entire list after confirming with the user
    deleteList() {
        if (window.confirm("Are you sure you want to delete this list?")) {
            remove(ref(database, this.props.userID + '/' + this.props.listID)).then(() => {
                this.props.navToAllLists();
            });
        }
    }

    //After updating the state, check if there are unsaved changes based on the new list
    updateListState(newArr) {
        this.setState({
            listItems: newArr,
        }, () => {
            this.props.setUnsavedChanges(!this.checkIfSavedListEqualsCurrentList());
        });
    }

    //Saves the new list to the database and updates the current 'saved list' state
    saveList() {
        set(ref(database, this.props.userID + '/' + this.props.listID + '/'), {list: this.state.listItems, name: this.state.listName}).then(() => {
            const arr = this.state.listItems.slice();
            this.setState({
                recentSavedItems: arr,
                recentSavedListName: this.state.listName
            });
            this.changeMessage(true);
            this.props.setUnsavedChanges(false);
        }).catch(() => {
            this.changeMessage(false);
        });
    }

    //Display a message based on the success of the save to the database
    changeMessage(success) {
        if (success) {
            this.setState({
                message: 'List saved successfully!',
                messageColor: 'green',
                display: 'block'
            });
        } else {
            this.setState({
                messageColor: 'red',
                message: 'Error saving list. Please try again.',
                display: 'block'
            });
        }
        setTimeout(this.clearMessage, 2000); //Displays the message for 2 seconds
    }

    //Compares the current list along with the 'saved' list to see if they are the same
    checkIfSavedListEqualsCurrentList() {
        const a = this.state.listItems;
        const b = this.state.recentSavedItems;

        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }

    checkIfSavedNameEqualsCurrentName() {
        return this.state.listName == this.state.recentSavedListName;
    }

    //Clear the message
    clearMessage() {
        this.setState({
            display: 'none'
        });
    }

    render() {
        if (!this.state.loaded) { //Display loading message until database is loaded
            return (
                <h3>Loading...</h3>
            );
        } else if (this.state.listName != null) { //Display list on successful load
            const fullList = this.state.listItems.map((item, index) => <ListItem 
                                                                        key={item} 
                                                                        index={index} 
                                                                        itemName={item} 
                                                                        userID={this.props.userID} 
                                                                        deleteItem={this.deleteItem} 
                                                                        />);

            //Checks if the user is looking at their own list, or at someone else's list
            if (auth.currentUser && this.props.userID === auth.currentUser.uid) { 
                //If it is the user's list, display the list along with editing options
                return (
                    <div>
                        <input type='text' className='list-name' onChange={(e) => {
                            this.setState({listName: e.target.value}, () => {
                                this.props.setUnsavedChanges(!this.checkIfSavedNameEqualsCurrentName());
                            }); 
                        }} value={this.state.listName} />
                        <h4 id='status-message' style={{backgroundColor: this.state.messageColor, display: this.state.display}}>{this.state.message}</h4>
                        <ListOptions deleteList={this.deleteList} createFile={this.createFile} saveList={this.saveList} unsavedChanges={this.props.unsavedChanges} />
                        <NewItemForm addNewItem={this.addNewItem} />
                        <DragDropContext onDragEnd={this.handleOnDragEnd}>
                            <Droppable droppableId='items'>
                                {(provided) => (
                                    <ol id='list' {...provided.droppableProps} ref={provided.innerRef}>
                                        {fullList}
                                        {provided.placeholder}
                                    </ol>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </div>
                );
            } else {
                //If not the user's own list, display list with no interactive elements
                return (
                    <div>
                        <h3 className='list-name'>{this.state.listName}</h3>
                        <ol id='list'>
                            {fullList}
                        </ol>
                    </div>
                );       
            }
        } else {
            //If no list is found, display error
            return (
                <h3>No list found for this link</h3>
            );
        }
    }
}

export { List }
