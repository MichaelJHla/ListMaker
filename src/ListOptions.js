/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { FaSave, FaFileDownload, FaTrashAlt } from 'react-icons/fa';

function ListOptions(props) {
    if (props.unsavedChanges) {
        return (
            <div id='list-options'>
                <a href='' id='a' className='button'><button id='download-list' onClick={() => props.createFile()}>Download <FaFileDownload /></button></a>
                <button id='save-list' onClick={() => props.saveList()}>Save <FaSave /></button>
                <h5 id='unsaved-changes'>*Unsaved changes</h5>
                <button id='delete-list' onClick={() => props.deleteList()}>Delete <FaTrashAlt /></button>
            </div>
        );
    } else {
        return (
            <div id='list-options'>
                <a href='' id='a' className='button'><button id='download-list' onClick={() => props.createFile()}>Download <FaFileDownload /></button></a>
                <button id='save-list' onClick={() => props.saveList()}>Save <FaSave /></button>
                <button id='delete-list' onClick={() => props.deleteList()}>Delete <FaTrashAlt /></button>
            </div>
        );
    }
}

export { ListOptions };
