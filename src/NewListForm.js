import React from 'react';

class NewListForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listName: ''
        };

        this.handleListNameChange = this.handleListNameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleListNameChange(e) {
        this.setState({
            listName: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.createNewList(this.state.listName);
    }

    render() {
        return (
            <form id='new-list-form' onSubmit={this.handleSubmit}>
                <h3>Create a new list: </h3>
                <input type='text' placeholder='New list' onChange={this.handleListNameChange} required />
                <button type='submit'>Create list</button>
            </form>
        );
    }
}

export { NewListForm };
