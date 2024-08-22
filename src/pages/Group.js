import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Group.css'; 
import groupIcon from '../assets/groupicon.svg'; 

function Group() {
  const [groups, setGroups] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublic, setIsPublic] = useState(true); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [filteredGroups, setFilteredGroups] = useState([]); 
  const [sortOrder, setSortOrder] = useState('latest'); 
  const navigate = useNavigate();
  const groupRefs = useRef([]); 

  const fetchGroups = async () => {
    try {
      const response = await axios.get('https://zogakzip-api-gr4l.onrender.com/api/groups');
      setGroups(response.data.data); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    let sortedGroups = groups.filter(group => 
      group.isPublic === isPublic &&
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    switch (sortOrder) {
      case 'latest':
        sortedGroups = sortedGroups.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'posts':
        sortedGroups = sortedGroups.sort((a, b) => b.postCount - a.postCount);
        break;
      case 'likes':
        sortedGroups = sortedGroups.sort((a, b) => b.likeCount - a.likeCount);
        break;
      case 'badges':
        sortedGroups = sortedGroups.sort((a, b) => b.badgeCount - a.badgeCount);
        break;
      default:
        break;
    }

    setFilteredGroups(sortedGroups);
  }, [searchTerm, groups, isPublic, sortOrder]);

  const handleVisibilityChange = (visibilityType) => {
    setIsPublic(visibilityType === 'public');
  };

  const calculateDDay = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - createdDate;
    const dayDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference >= 0 ? `D+${dayDifference}` : `D${dayDifference}`;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); 
  };

  const handleCreateGroupClick = () => {
    navigate('/group/makegroup'); 
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); 
  };

  const handleGroupClick = (group) => {
    if (group.isPublic) {
      navigate(`/group/${group.id}`);
    } else {
      navigate(`/group/${group.id}/password-check`); 
    }
  };

  // 이미지가 로드될 때마다 레이아웃 업데이트
  const handleImageLoad = () => {
    groupRefs.current.forEach(groupItem => {
      if (groupItem) {
        const image = groupItem.querySelector('.group-image');
        const info = groupItem.querySelector('.group-info');
        if (image && info) {
          const imageHeight = image.offsetHeight;
          info.style.marginTop = `${imageHeight + 20}px`;
        }
      }
    });
  };

  // 페이지가 로드된 후 레이아웃을 한 번 업데이트
  useEffect(() => {
    const handleResize = () => {
      handleImageLoad(); // 이미지 로드 후 레이아웃 조정
    };

    // 페이지가 로드된 후 한 번 레이아웃 조정
    window.addEventListener('load', handleResize);

    return () => {
      window.removeEventListener('load', handleResize);
    };
  }, [filteredGroups]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button 
        className="register-group-btn-right" 
        onClick={handleCreateGroupClick} 
      >
        그룹 만들기
      </button>
      <div className="group-type">
        <button 
          className={isPublic ? 'show-public-group active' : 'show-public-group'} 
          onClick={() => handleVisibilityChange('public')}
        >
          공개
        </button>
        <button 
          className={!isPublic ? 'show-private-group active' : 'show-private-group'} 
          onClick={() => handleVisibilityChange('private')}
        >
          비공개
        </button>
      </div>
      <div className="search-group">
        <input 
          className="search-bar-group" 
          type="text" 
          placeholder="그룹명을 입력해주세요" 
          value={searchTerm}
          onChange={handleSearchChange} 
        />
      </div>
      <select 
          className="sort-dropdown" 
          value={sortOrder} 
          onChange={handleSortChange} 
        >
          <option value="latest">최신순</option>
          <option value="posts">게시글 많은 순</option>
          <option value="likes">공감순</option>
          <option value="badges">획득 뱃지순</option>
        </select>

      {filteredGroups.length === 0 ? (
        <div className="no-groups-message">
          <img src={groupIcon} className="group-icon-img" alt="search icon" />
          <p className="none-group-text">등록된 그룹이 없습니다.</p>
          <p className="make-group-text">가장 먼저 그룹을 만들어보세요!</p>
          <button 
            className="register-group-btn-center" 
            onClick={handleCreateGroupClick} 
          >
            그룹 만들기
          </button>
        </div>
      ) : (
        <div className="group-list">
          {filteredGroups.map((group, index) => (
            <div 
              key={group.id} 
              onClick={() => handleGroupClick(group)} 
              className="group-item-link" 
              style={{ cursor: 'pointer' }} 
              ref={(el) => (groupRefs.current[index] = el)} 
            >
              <div className="group-item">
                {isPublic && group.imageUrl && (
                  <img 
                    src={group.imageUrl} 
                    alt={group.name} 
                    className="group-image" 
                    onLoad={handleImageLoad} 
                  />
                )}
                <div className="group-info">
                  <div>
                    <span>{calculateDDay(group.createdAt)}  </span>
                    <span>|</span>
                    <span>{group.isPublic ? '공개' : '비공개'}</span>
                  </div>
                  <h3>{group.name}</h3>
                  {isPublic && <p>{group.introduction}</p>}
                  <div className="group-stats">
                    {isPublic && <span>획득 뱃지 {group.badgeCount} </span>}
                    <span>그룹 공감 {group.likeCount} </span>
                    <span>추억 {group.postCount} </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Group;