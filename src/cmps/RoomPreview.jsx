import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

//icons
import edit from '../assets/imgs/edit-large.png';
import removeIcon from '../assets/imgs/remove.png';
import add from '../assets/imgs/add.png';

import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrRoom, remove, query } from '../store/actions/roomActions';
import { update, getUserById } from '../store/actions/userActions';

import { socketService } from '../services/socketService';

export const RoomPreview = ({ room, user, exit, getRoomId }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const editRoom = () => {
    exit(true);
    getRoomId(room._id);
    dispatch(query());
  };

  const routeToRoom = () => {
    dispatch(setCurrRoom(room));
    history.push(`${room._id}`);
    socketService.emit('room topic', { topic: room._id, uid: user._id });
    socketService.emit('check-num-of-users', room._id);
  };

  const toggleToLiked = () => {
    if (user.likedRooms.includes(room._id)) {
      user.likedRooms = user.likedRooms.filter((r) => r !== room._id);
      dispatch(update(user));
      dispatch(getUserById(user._id));
    } else {
      user.likedRooms = [...user.likedRooms, room._id];
      dispatch(update(user));
      dispatch(getUserById(user._id));
    }
    dispatch(query());
  };

  const removeRoomBtn = () => {
    const confirms = window.confirm(
      `Are you sure you want to remove the room ${room.name} and all it's content?`
    );
    if (confirms) {
      dispatch(remove(room._id));
      //remove the room id from likedRooms in the user
      user.likedRooms = user.likedRooms.filter((r) => r !== room._id);
      dispatch(update(user));
      dispatch(getUserById(user._id));
      dispatch(query());
    }
  };

  const isToday = (timeString) => {
    const date = new Date(timeString);
    const currTimeStamp = new Date(Date.now());
    const sameDay = currTimeStamp.getDate() === date.getDate();
    const sameMonth = currTimeStamp.getMonth() + 1 === date.getMonth() + 1;
    const sameYear = currTimeStamp.getFullYear() === date.getFullYear();
    if (sameDay && sameMonth && sameYear)
      return date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
      });
    else return date.toLocaleDateString('he-IL');
  };

  return (
    <Fragment>
      <td className="room-name" onClick={routeToRoom}>
        <Link to={`rooms/${room._id}`}>{room.name}</Link>
      </td>
      <td>{room.topic}</td>

      {/* <td>{room.limit}</td> */}
      {/* <td>
        {room.restrictions.length ? room.restrictions.join(', ') : 'none'}
      </td> */}
      <td>
        {room.msgs.length > 0 ? (
          <span>{isToday(room.msgs[room.msgs.length - 1].sentAt)}</span>
        ) : (
          <span>Nothing yet!</span>
        )}
      </td>
      <td>{room.type}</td>
      <td className="actions">
        <img src={edit} alt="edit-btn" onClick={editRoom} />
        <img
          onClick={toggleToLiked}
          className={user.likedRooms.includes(room._id) ? 'liked' : ''}
          src={add}
          alt="add-btn"
        />
        {room.owner._id === user._id && (
          <img
            onClick={removeRoomBtn}
            className="remove"
            src={removeIcon}
            alt="remove-btn"
          />
        )}
      </td>
    </Fragment>
  );
};
