import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PrivateChat } from '../cmps/PrivatChat';
import { useHistory } from 'react-router-dom';
import { setCurrPrivateRoom } from '../store/actions/roomActions';
import { useDispatch } from 'react-redux';
import { getEmptyPrivateRoom } from '../services/roomService';

import back from '../assets/imgs/back.png';

export const PrivateRoom = () => {
  const dispatch = useDispatch();
  const { currPrivateRoom, currChatMsgs } = useSelector(
    (state) => state.roomModule
  );
  const history = useHistory();
  // console.log('currPrivateRoom:', currPrivateRoom);

  const topics = JSON.parse(sessionStorage.getItem('topics'));

  useEffect(() => {
    const privateRoom = getEmptyPrivateRoom();
    privateRoom.topics = topics;
    dispatch(setCurrPrivateRoom(privateRoom));
    // let topicsToSocket = [...topics];
    // topicsToSocket = topics.length
    //   ? topicsToSocket.map((topic) => topic.value)
    //   : [];
    // return () => {
    // socketService.emit('leave-private-room', {
    //   uid: getLoggedinUser()._id,
    //   topics: topicsToSocket,
    // });
    // };
    //eslint-disable-next-line
  }, []);

  const _PrivateChat = useMemo(
    () => <PrivateChat topics={topics} />,
    [currChatMsgs, topics]
  );

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
        <button className="back-btn" onClick={() => history.push('/')}>
          <img src={back} alt="back" />
        </button>
      </div>
      {/* <_PrivateChat topics={topics} /> */}
      {_PrivateChat}
    </div>
  );
};
