import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupDetail.css';
import axios from 'axios';
import GroupDeleteModal from '../components/GroupDeleteModal';
import GroupEditModal from '../components/GroupEditModal';


function GroupDetail() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [groupData, setGroupData] = useState({
        id: null,
        name: '이름',
        imageUrl: '',
        isPublic: true,
        likeCount: 0,
        badges: [],
        postCount: 0,
        createdAt: '',
        introduction: '그룹 소개를 여기에 입력하세요.',
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}`);
                console.log(response.data); 
                setGroupData(response.data); 
                setLocalLikeCount(response.data.likeCount); 
            } catch (error) {
                setErrorMessage('그룹 정보를 가져오는 데 실패했습니다.');
                console.error('Error fetching group details:', error);
            }
        };
        
        fetchGroupData();
    }, [groupId]);

    const sendClick = async () => {
        try {
            const response = await axios.post(`https://zogakzip-api-gr4l.onrender.com/api/groups/${groupId}/like`);
            const result = response.data;
            setLocalLikeCount(prevCount => prevCount + 1); 
            console.log(result.message); 
        } catch (error) {
            setErrorMessage('공감 보내기 실패');
            console.error('Error sending like:', error);
        }
    };

    const handleEdit = () => {
        // 그룹 수정 후 처리 로직
        setEditModalOpen(false);
    };

    const handleDelete = () => {
        navigate('/group');  
        setDeleteModalOpen(false);
    };

    const calculateDDay = (createdAt) => {
        const createdDate = new Date(createdAt);
        const currentDate = new Date();
        const timeDifference = currentDate - createdDate;
        const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        return dayDifference >= 0 ? `D+${dayDifference}` : `D${dayDifference}`;
    };

    return (
        <div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="card-info-group">
                <img className="profile-img" src={groupData.imageUrl} alt={groupData.name} />
                <div className="group-detail-info">
                    <div>
                        <div className="dday-count">{calculateDDay(groupData.createdAt)}</div>
                        <div className="dday-ispublic-line">|</div>
                        <div className="ispublic-info">{groupData.isPublic ? '공개' : '비공개'}</div>
                        <button className="group-edit-btn" onClick={() => setEditModalOpen(true)}>그룹 정보 수정하기</button>
                        <GroupEditModal
                            isOpen={editModalOpen}
                            onRequestClose={() => setEditModalOpen(false)}
                            onEdit={handleEdit}
                            groupId={groupId}
                        />
                        <button className="group-delete-btn" onClick={() => setDeleteModalOpen(true)}>그룹 삭제하기</button>
                        <GroupDeleteModal
                            isOpen={deleteModalOpen}
                            onRequestClose={() => setDeleteModalOpen(false)}
                            onDelete={handleDelete}
                            groupId={groupId}
                        />
                    </div>
                    <span className="name-info">{groupData.name}</span>
                    <div className="post-like-text">
                        <p className="post-count-info">추억 {groupData.postCount}</p>
                        <p className="like-count-info">그룹 공감 {localLikeCount}</p>
                    </div>
                    <p className="post-like-line">|</p>
                    <div>
                        <span className="introduction-info">{groupData.introduction}</span>
                    </div>
                </div>
                <div className="badges">
                    <p className="badge-text">획득 배지</p>
                    <div className="badge-info">
                        {groupData.badges && groupData.badges.map((badge, index) => (
                            <span key={index} className="badge">{badge}</span>
                        ))}
                    </div>
                </div>
                <div className="like">
                    <button className="send-like-btn" onClick={sendClick}>
                        공감 보내기
                    </button>
                </div>
            </div>
            <hr />
            <div className="memories-list">
                <div>
                    <p className="memory-list-text">추억목록</p>
                    <button className="memory-post-btn">추억 올리기</button>
                </div>
            </div>
        </div>
    );
}

export default GroupDetail;
