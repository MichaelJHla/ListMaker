/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FaSave, FaFileDownload, FaTrashAlt, FaShareAlt } from 'react-icons/fa';
import Switch from 'react-switch';

function ListOptions(props) {
    return (
        <div id='list-options'>
            <div className='options'>
                <span>List Type:</span>
                <Switch onChange={props.changeListType} checked={props.checked} onColor='#068E8C' offColor='#DAA788'
                    checkedIcon={<span style={
                        {display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        height: '100%'}
                    }>ol</span>} 
                    uncheckedIcon={<span style={
                        {display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        height: '100%'}
                    }>ul</span>}
                />
                <a href='' id='a' className='button'><button id='download-list' onClick={() => props.createFile()}>Download <FaFileDownload /></button></a>
            </div>
            { !props.guestList ? 
            <div className='options'>
                <button id='save-list' onClick={() => props.saveList()}>Save <FaSave /></button>
                <button id='share-list' onClick={() => props.shareList()}>Share <FaShareAlt /></button>
                <button id='delete-list' onClick={() => props.deleteList()}>Delete <FaTrashAlt /></button>
            </div> : null }
            { props.guestList ? <span>Create Account to save the list!<br />List will delete when you close the tab.</span> : null }
            <div id='unsaved-placeholder'>
                { (props.unsavedChanges || props.guestList) ? <span id='unsaved-changes'>*Unsaved changes</span> : null }
            </div>
        </div>
    );
}

export { ListOptions };
