import React, { useState } from 'react';
import axios from 'axios';
import './MakeGroup.css';
import Modal from './Modal'; 
import { useNavigate } from 'react-router-dom';

function MakeGroup() {
    const [name, setName] = useState(''); 
    const [imageUpload, setImageUpload] = useState(null);
    const [introduction, setIntroduction] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [password, setPassword] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // 네비게이션 기능 사용

    const uploadImageAndGetURL = async () => {
        if (!imageUpload) {
            setMessage('이미지 파일을 선택해주세요.');
            return null;
        }

        const formData = new FormData();
        formData.append('image', imageUpload);

        try {
            const response = await axios({
                method: 'post',
                url: 'https://zogakzip-api-gr4l.onrender.com/api/image',
                data: formData
            });
            return response.data.imageUrl;
        } catch (error) {
            setMessage('이미지 업로드 실패');
            return null;
        }
    };

    const submitForm = async (e) => {
        e.preventDefault(); 

        const imageUrl = await uploadImageAndGetURL();
        if (!imageUrl) return;  // 이미지 URL을 가져오지 못한 경우 중단

        const groupData = {
            name: name,          
            password: password,  
            imageUrl: imageUrl,  
            isPublic: isPublic,  
            introduction: introduction 
        }

        try {
            await axios({
                method: 'post',
                url: 'https://zogakzip-api-gr4l.onrender.com/api/groups',
                headers: {
                    'Content-Type': 'application/json' 
                },
                data: JSON.stringify(groupData)
            });
            setMessage('그룹 만들기 성공');
            setShowModal(true);
        } catch (error) {
            setMessage('그룹 만들기 실패');
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/Group');
    };

    return (
        <div className="App">
            <main>
                <h2>그룹 만들기</h2>
                <form onSubmit={submitForm}>
                    <div className="form-group">
                        <label htmlFor="name">그룹명</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="그룹명을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageUpload">대표 이미지</label>
                        <input
                            type="file"
                            id="imageUpload"
                            name="imageUpload"
                            onChange={(e) => setImageUpload(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="introduction">그룹 소개</label>
                        <textarea
                            id="introduction"
                            name="introduction"
                            placeholder="그룹을 소개해 주세요"
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="isPublic">그룹 공개 선택</label>
                        <label className="switch">
                            공개: 
                            <input 
                                type="checkbox"
                                id="isPublic"
                                name="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="그룹 비밀번호를 생성해 주세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">만들기</button>
                    {showModal && <Modal message={message} onClose={handleCloseModal} />}
                </form>
            </main>
        </div>
    );
}

export default MakeGroup;
