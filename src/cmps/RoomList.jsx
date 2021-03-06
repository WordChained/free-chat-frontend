import React, { useState } from 'react';
import { RoomPreview } from './RoomPreview';
import { RoomBlockPreview } from './RoomBlockPreview';
import { getLoggedinUser } from '../store/actions/userActions';
import { CreateRoom } from './CreateRoom';

export const RoomList = ({ rooms, viewType }) => {
  const [showRoomEdit, setShowRoomEdit] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  const getRoomId = (roomId) => {
    const room = rooms.find((room) => room._id === roomId);
    setRoomToEdit(room);
  };

  return (
    <div className={`rooms-list ${viewType}`}>
      {viewType === 'table' && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>topic</th>
              {/* <th>Limit</th> */}
              {/* <th>Restrictions</th> */}
              <th>last Message</th>
              <th>type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              return (
                <tr key={room._id}>
                  <RoomPreview
                    room={room}
                    user={getLoggedinUser()}
                    exit={setShowRoomEdit}
                    getRoomId={getRoomId}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {viewType === 'blocks' && (
        <div className='blocks-list'>
          {rooms.map((room) => {
            return (
              <RoomBlockPreview
                key={room._id}
                room={room}
                user={getLoggedinUser()}
                exit={setShowRoomEdit}
                getRoomId={getRoomId}
              />
            );
          })}
        </div>
      )}
      {showRoomEdit && (
        <CreateRoom
          exit={setShowRoomEdit}
          user={getLoggedinUser()}
          room={roomToEdit}
        />
      )}
    </div>
  );
};
