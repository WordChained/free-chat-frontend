import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PrivateChat } from '../cmps/PrivatChat';
import { useHistory } from 'react-router-dom';
import { setCurrPrivateRoom } from '../store/actions/roomActions';
import { useDispatch } from 'react-redux';
import { getEmptyPrivateRoom } from '../services/roomService';
import { getLoggedinUser } from '../store/actions/userActions';

import back from '../assets/imgs/back.png';
import { socketService } from '../services/socketService';

export const PrivateRoom = () => {
  const dispatch = useDispatch();
  const { currPrivateRoom } = useSelector((state) => state.roomModule);
  const history = useHistory();
  console.log('currPrivateRoom:', currPrivateRoom);

  //   const [topics, setTopics] = useState(storageService.load('topics'));
  const [topics, setTopics] = useState(
    JSON.parse(sessionStorage.getItem('topics'))
  );

  // const [firstMsg, setFirstMsg] = useState('');
  useEffect(() => {
    const privateRoom = getEmptyPrivateRoom();
    privateRoom.topics = topics;
    dispatch(setCurrPrivateRoom(privateRoom));
    let topicsToSocket = [...topics];
    topicsToSocket = topics.length
      ? topicsToSocket.map((topic) => topic.value)
      : [];
    return () => {
      //   socketService.emit('leave-private-room', {
      //     uid: getLoggedinUser()._id,
      //     topics: topicsToSocket,
      //   });
    };
    //eslint-disable-next-line
  }, []);

  if (!currPrivateRoom)
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  return (
    <div className="private-room-container room-container">
      <div className="top-line">
        <div className="header">
          <h2>Free Chat</h2>
          <div className="topic-list">
            {currPrivateRoom.topics.map((topic, idx) => {
              if (idx === topics.length - 1)
                return <span key={topic.value}>{topic.label}.</span>;
              else return <span key={topic.value}>{topic.label} , </span>;
            })}
          </div>
        </div>
        <button
          className="back-btn"
          onClick={() => {
            history.push('/');
          }}
        >
          <img src={back} alt="back" />
        </button>
      </div>
      <PrivateChat topics={topics} />
    </div>
  );
};
