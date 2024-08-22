import React from 'react';
import './Modal.css'; 

function Modal({ message, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Modal;