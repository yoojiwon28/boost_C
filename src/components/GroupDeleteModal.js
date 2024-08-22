import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'; 
import './GroupDeleteModal.css';

const GroupDeleteModal = ({ isOpen, onRequestClose, onDelete, groupId }) => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleDelete = async () => {
        try {
            await deleteGroup(groupId, password);
            onDelete(); 
            onRequestClose(); 
        } catch (error) {
            setErrorMessage('그룹 삭제에 실패했습니다.'); 
            console.error('Error deleting group:', error); 
        }
    };


    const deleteGroup = async (groupId, password) => {
        try {
            await axios.delete(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}`, {
                data: { password } 
            });
        } catch (error) {
            throw new Error('그룹 삭제에 실패했습니다.');
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Group Delete Modal"
            className="delete-modal"
            overlayClassName="modal-overlay"
        >
            <div className="modal">
                <button onClick={onRequestClose} className="modal-close">X</button>
                <h2>그룹 삭제</h2>
                <div className="delete-check">
                    <p>삭제 권한 인증</p>
                    <input
                        name="pw"
                        className="pw-input"
                        placeholder="비밀번호를 입력해주세요"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 에러 메시지 표시 */}
                <button className="delete-btn" onClick={handleDelete}>삭제하기</button>
            </div>
        </Modal>
    );
};

export default GroupDeleteModal;