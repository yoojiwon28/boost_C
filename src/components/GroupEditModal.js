import React, { useState } from 'react';
import Modal from 'react-modal';
import './GroupEditModal.css';

const GroupEditModal = ({ isOpen, onRequestClose, onEdit }) => {

    const [groupName, setGroupName] = useState('');
    const [imageUpload, setImageUpload] = useState(null);
    const [groupDescription, setGroupDescription] = useState('');
    const [publicToggle, setPublicToggle] = useState(true);

    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value); 
    };

    const handleEdit = async (e) => {
        e.preventDefault(); 
        // 제출 시 처리할 로직 추가해야 함. 
        console.log({
            groupName,
            imageUpload,
            groupDescription,
            publicToggle,
            password,
        });

    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Group Edit Modal"
            className="edit-modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal">
                <button onClick={onRequestClose} className="modal-close">X</button>
                <h2>그룹 정보 수정</h2>

                
                    
                    <button className="edit-btn" onclick={onEdit}>수정하기</button>
            </div>
        </Modal>
    );
};

export default GroupEditModal;
