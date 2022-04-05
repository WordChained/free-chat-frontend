import React, { useEffect, useState, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  // setCurrRoom,
  setCurrRoomById,
} from '../store/actions/roomActions';
import { socketService } from '../services/socketService';
import { Chat } from '../cmps/Chat';

// images:
import defaultRoomImg from '../assets/imgs/room.png';
import back from '../assets/imgs/back.png';
import onlineUsers from '../assets/imgs/online-users.png';

import { getLoggedinUser } from '../store/actions/userActions';

export const Room = memo(() => {
  const { currRoom, currChatMsgs } = useSelector((state) => state.roomModule);
  const _Chat = useMemo(() => <Chat />, [currChatMsgs]);
  const { loggedInUser, guestUser } = useSelector((state) => state.userModule);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [usersInRoom, setUsersInRoom] = useState(null);
  useEffect(() => {
    //5 renders for some reason...
    if (!currRoom) {
      dispatch(setCurrRoomById(id));
    } else {
      socketService.emit('room topic refresh', {
        topic: currRoom._id,
        uid: getLoggedinUser()._id,
      });
      socketService.emit('check-num-of-users', currRoom._id);
    }
    socketService.on('users-in-room', (num) => {
      setUsersInRoom(num);
    });
    return () => {
      dispatch(setCurrRoomById(id));
      // if (currRoom) {
      // console.log('left room');
      // socketService.emit('leave room', currRoom._id);
      // }
    };
    //eslint-disable-next-line
  }, []);

  const exitRoom = () => {
    navigate('/rooms');
    socketService.emit('leave room', {
      topic: currRoom._id,
      uid: getLoggedinUser()._id,
    });
    dispatch(setCurrRoomById(null));
    // dispatch(setCurrRoom(null));
  };
  if (!currRoom)
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  return (
    <div className="room-container">
      <div className="top-line">
        <div className="left-group">
          <img
            className="room-img"
            src={currRoom.imgUrl ? currRoom.imgUrl : defaultRoomImg}
            alt="room"
          />
          <h3 className="room-title">{currRoom.name}</h3>
        </div>
        <div className="user-count">
          <img src={onlineUsers} alt="online" />
          {usersInRoom && <span>{usersInRoom.toLocaleString('he-IL')}</span>}
        </div>
        <button onClick={exitRoom} className="back-btn">
          <img src={back} alt="back-btn" />
        </button>
      </div>
      {(loggedInUser || guestUser) && _Chat}
    </div>
  );
});
