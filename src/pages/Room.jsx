import React, { useEffect, useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import {
  // setCurrRoom,
  setCurrRoomById,
  // setNumOfUsers,
} from '../store/actions/roomActions';
import { socketService } from '../services/socketService';
import { Chat } from '../cmps/Chat';

// images:
import defaultRoomImg from '../assets/imgs/room.png';
import back from '../assets/imgs/back.png';

export const Room = memo(() => {
  const { currRoom, usersInCurrRoom } = useSelector(
    (state) => state.roomModule
  );
  const { loggedInUser, guestUser } = useSelector((state) => state.userModule);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [usersInRoom, setUsersInRoom] = useState(usersInCurrRoom);
  useEffect(() => {
    //5 renders for some reason...
    if (!currRoom) dispatch(setCurrRoomById(id));
    else {
      console.log('check num of users in room');
      socketService.emit('room topic refresh', currRoom._id);
      socketService.emit('check-num-of-users', currRoom._id);
    }
    socketService.on('users-in-room', (num) => {
      console.log('users-in-room', num);
      setUsersInRoom(num);
    });
    return () => {
      // dispatch(setCurrRoom(null));
      // if (currRoom) {
      // console.log('left room');
      // socketService.emit('leave room', currRoom._id);
      // }
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    console.log('usersInRoom', usersInRoom);
  }, [usersInRoom]);

  const exitRoom = () => {
    history.goBack();
    socketService.emit('leave room', currRoom._id);
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
      <span>users:{usersInRoom}</span>
      <img
        className="room-img"
        src={currRoom.imgUrl ? currRoom.imgUrl : defaultRoomImg}
        alt="room"
      />
      <button onClick={exitRoom} className="back-btn">
        <img src={back} alt="back-btn" />
      </button>

      <h3 className="room-title">{currRoom.name}</h3>
      {(loggedInUser || guestUser) && <Chat />}
    </div>
  );
});
