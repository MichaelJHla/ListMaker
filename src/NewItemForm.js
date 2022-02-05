import React from 'react';
import { FaPlus } from 'react-icons/fa';

class NewItemForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: ''
        };

        this.handleItemChange = this.handleItemChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleItemChange(e) {
        this.setState({
            item: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.addNewItem(this.state.item);
        document.querySelector('input').value = '';
    }

    render() {
        return (
            <form id='new-item-form' onSubmit={this.handleSubmit}>
                <input type='text' placeholder='New item' onChange={this.handleItemChange} required />
                <button type='submit'>Add <FaPlus /></button>
            </form>
        );
    }
}

export { NewItemForm };
