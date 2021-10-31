import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import edit from '../assets/imgs/edit-large.png';
import removeIcon from '../assets/imgs/remove.png';
import add from '../assets/imgs/add.png';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrRoom, remove } from '../store/actions/roomActions';
export const RoomPreview = ({ room, user, exit, getRoomId }) => {
  const editRoom = () => {
    exit(true);
    getRoomId(room._id);
  };
  const dispatch = useDispatch();
  const history = useHistory();

  const routeToRoom = (room) => {
    dispatch(setCurrRoom(room));
    history.push(`/rooms/${room._id}`);
  };

  const removeRoomBtn = () => {
    const wantToRemove = window.confirm(
      `Are you sure you want to remove the room ${room.name} and all it's content?`
    );
    if (wantToRemove) {
      dispatch(remove(room._id));
    }
  };
  return (
    <Fragment>
      <td className="room-name" onClick={() => routeToRoom(room)}>
        <Link to={`rooms/${room._id}`}>{room.name}</Link>
      </td>
      <td>{room.topic}</td>
      <td>{room.type}</td>
      <td>{room.limit}</td>
      <td>
        {room.restrictions.length ? room.restrictions.join(', ') : 'none'}
      </td>
      <td>
        <span>some date</span>
      </td>
      <td className="actions">
        <img src={edit} alt="edit-btn" onClick={editRoom} />
        <img src={add} alt="add-btn" />
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
