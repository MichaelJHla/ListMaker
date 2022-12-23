import React from 'react';
import { database, auth, functions } from '../FirebaseConfig';
import { ref, child, get, set } from 'firebase/database';
import { arrayMoveImmutable } from 'array-move';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { ListOptions } from './ListOptions';
import { ListItem } from './ListItem';
import { StatusComponent } from './StatusComponent';
import { NewItemForm } from '../Forms/NewItemForm';
import TextareaAutosize from 'react-textarea-autosize';
import { httpsCallable } from 'firebase/functions';
import { Loading } from '../Loading';
import { CollaboratorsModal } from '../Modals/CollaboratorsModal';

class List extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            listName: '',
            recentSavedListName: '',
            listItems: [],
            recentSavedItems: [],
            loaded: false, //if the page has loaded
            loading: false, //if an action is loading
            ol: true,
            showMessage: false,
            saveSuccessful: true,
            saveMessage: 'List saved!',
            collaborators: [],
            collaboratorsEmails: [],
            showModal: false
        }
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.addNewItem = this.addNewItem.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.deleteList = this.deleteList.bind(this);
        this.saveList = this.saveList.bind(this);
        this.changeMessage = this.changeMessage.bind(this);
        this.updateListState = this.updateListState.bind(this);
        this.createFile = this.createFile.bind(this);
        this.updateListItemText = this.updateListItemText.bind(this);
        this.changeListType = this.changeListType.bind(this);
        this.shareList = this.shareList.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.addNewCollaborator = this.addNewCollaborator.bind(this);
        this.removeCollaborator = this.removeCollaborator.bind(this);
    }

    changeListType(checked) {
        this.setState({
            ol: checked
        });
        if (!this.props.guestList) set(ref(database, this.props.userID + '/' + this.props.listID + '/ol'), checked);
    }

    componentDidMount() {
        if (this.props.guestList) {
            let list = JSON.parse(sessionStorage.getItem('list'));
            let listName = sessionStorage.getItem('listName');

            if ((list == null || list === '') || (listName == null || listName === '')) {
                list = ['Example item'];
                listName = 'Example list';
            }

            sessionStorage.setItem('list', JSON.stringify(list));
            sessionStorage.setItem('listName', listName);

            this.setState({
                listItems: list,
                recentSavedItems: list,
                listName: listName,
                recentSavedListName: listName,
                loaded: true
            });
        } else {
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
                    if (val['collaborators'] != null) {
                        this.setState({
                            collaborators: Object.keys(val['collaborators']),
                            collaboratorsEmails: Object.values(val['collaborators'])
                        });
                    }
                    this.setState({
                        listName: val['name'],
                        recentSavedListName: val['name'],
                        ol: val['ol'],
                        loaded: true
                    });
                }
            });    
        }
    }

    //This function is used to generate a txt file with the content of the list
    createFile() {
        const list = this.state.listItems;
        let fileString = this.state.listName + '\n\n';
        for (let i = 1; i <= list.length; i++) {
            let lineStart = '-';
            if (this.state.ol) {
                lineStart = i + '. ';
            }
            fileString += lineStart + list[i - 1] + '\n';
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

    updateListItemText(index, text) {
        let arr = this.state.listItems.slice();
        arr[index] = text;
        this.updateListState(arr);
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
        if (window.confirm('Are you sure you want to delete this list?')) {
            this.setState({
                loading: true
            })

            const del = httpsCallable(functions, 'deleteList');

            del({listID: this.props.listID}).then(() => {
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
        if (this.props.guestList) sessionStorage.setItem('list', JSON.stringify(newArr));
    }

    //Saves the new list to the database and updates the current 'saved list' state
    saveList() {
        let save;
        if (auth.currentUser.uid === this.props.userID) {
            save = httpsCallable(functions, 'saveList');
        } else if (this.state.collaborators.includes(auth.currentUser.uid)) {
            save = httpsCallable(functions, 'saveCollaborativeList');
        }

        this.setState({
            loading: true
        });

        let collabObj = {};
        for (let i = 0; i < this.state.collaborators.length; i++) {
            collabObj[this.state.collaborators[i]] = this.state.collaboratorsEmails[i];
        }

        save({userID: this.props.userID, listID: this.props.listID, list: this.state.listItems, name: this.state.listName, ol: this.state.ol, collaborators: collabObj}).then(() => {
            const arr = this.state.listItems.slice();

            this.changeMessage(true);
            this.props.setUnsavedChanges(false);
            this.setState({
                recentSavedItems: arr,
                recentSavedListName: this.state.listName,
                loading: false
            });
        }).catch(() => {
            this.changeMessage(false);
        });
    }

    shareList() {
        if (navigator.canShare) {
            navigator.share({
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.setState({
                    saveMessage: 'URL Copied to clipboard'
                }, () => {
                    this.changeMessage(true);
                });
            });
        }
    }

    //Display a message based on the success of the save to the database
    changeMessage(success) {
        this.setState({
            showMessage: true,
            saveSuccessful: success,
            loading: false
        });
        setTimeout(() => {
            this.setState({
                saveMessage: 'List saved!',
                showMessage: false
            });
        }, 2000); //Displays the message for 2 seconds
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
        return this.state.listName === this.state.recentSavedListName;
    }

    openModal() {
        this.setState({showModal: true});
    }

    closeModal() {
        this.setState({showModal: false});
    }

    addNewCollaborator(newCollaborator) {
        let temp = this.state.collaboratorsEmails.slice();
        temp.push(newCollaborator);
        this.setState({collaboratorsEmails: temp});
    }

    removeCollaborator(collab) {
        console.log(collab);
        let temp = this.state.collaboratorsEmails.slice();
        temp.splice(temp.indexOf(collab), 1);
        this.setState({collaboratorsEmails: temp});
    }

    render() {
        if (!this.state.loaded) { //Display loading message until database is loaded
            return (
                <Loading />
            );
        } else if (this.state.listName != null) { //Display list on successful load
            const fullList = this.state.listItems.map((item, index) => <ListItem 
                                                                        guestList={this.props.guestList}
                                                                        key={item} 
                                                                        index={index} 
                                                                        itemName={item} 
                                                                        userID={this.props.userID} 
                                                                        deleteItem={this.deleteItem} 
                                                                        updateListItemText={this.updateListItemText}
                                                                        collaborators={this.state.collaborators}
                                                                        />);

            //Checks if the user is looking at their own list, or at someone else's list
            if ((auth.currentUser && this.props.userID === auth.currentUser.uid) || this.props.guestList || (auth.currentUser && this.state.collaborators.includes(auth.currentUser.uid))) { 
                let l;
                if (this.state.ol) {
                    l = <Droppable droppableId='items'>
                        {(provided) => (
                            <ol id='list' {...provided.droppableProps} ref={provided.innerRef}>
                                {fullList}
                                {provided.placeholder}
                            </ol>
                        )}
                    </Droppable>
                } else {
                    l = <Droppable droppableId='items'>
                        {(provided) => (
                            <ul id='list' {...provided.droppableProps} ref={provided.innerRef}>
                                {fullList}
                                {provided.placeholder}
                            </ul>
                        )}
                    </Droppable>
                }

                //If it is the user's list, display the list along with editing options
                return (
                    <div>
                        <TextareaAutosize type='text' className='list-name' onChange={(e) => {
                            this.setState({listName: e.target.value}, () => {
                                this.props.setUnsavedChanges(!this.checkIfSavedNameEqualsCurrentName());
                                if (this.props.guestList) sessionStorage.setItem('listName', e.target.value);
                            }); 
                        }} onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.target.blur();
                            }
                        }} value={this.state.listName} />
                        <hr />
                        <ListOptions 
                            openModal={this.openModal} 
                            guestList={this.props.guestList} 
                            deleteList={this.deleteList} 
                            createFile={this.createFile} 
                            saveList={this.saveList} 
                            shareList={this.shareList} 
                            unsavedChanges={this.props.unsavedChanges} 
                            changeListType={this.changeListType} 
                            checked={this.state.ol} 
                            userID={this.props.userID}
                        />
                        < hr />
                        {this.state.showMessage ? <StatusComponent success={this.state.saveSuccessful} successMessage={this.state.saveMessage} failureMessage='Save unsuccessful' /> : null }
                        <NewItemForm addNewItem={this.addNewItem} />
                        <DragDropContext onDragEnd={this.handleOnDragEnd}>
                            {l}
                        </DragDropContext>
                        {this.state.loading ? <Loading /> : null}
                        {this.state.showModal ? <CollaboratorsModal 
                                                    userID={this.props.userID} 
                                                    listID={this.props.listID} 
                                                    collaborators={this.state.collaboratorsEmails} 
                                                    closeModal={this.closeModal}
                                                    addNewCollaborator={this.addNewCollaborator}
                                                    removeCollaborator={this.removeCollaborator}
                                                /> 
                                                : null}
                    </div>
                );
            } else {
                //If not the user's own list, display list with no interactive elements
                if (this.state.ol) {
                    return (
                        <div>
                            <h3 className='list-name'>{this.state.listName}</h3>
                            <hr />
                            <ol id='list'>
                                {fullList}
                            </ol>
                        </div>
                    ); 
                } else {
                    return (
                        <div>
                            <h3 className='list-name'>{this.state.listName}</h3>
                            <hr />
                            <ul id='list'>
                                {fullList}
                            </ul>
                        </div>

                    );
                }
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
