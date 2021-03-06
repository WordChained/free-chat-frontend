import React, { useState, useEffect } from 'react';

// icons
import star from '../assets/imgs/star.png';
import like from '../assets/imgs/like.png';
import removeIcon from '../assets/imgs/trash.png';
// import editIcon from '../assets/imgs/edit.png';

import { useDispatch, useSelector } from 'react-redux';
import {
  starMsg,
  unStarMsg,
  likeMsg,
  unLikeMsg,
  removeMsg,
  // editMsg,
} from '../store/actions/chatActions';
import { eventBusService } from '../services/eventBusService';
export const MsgEditOptions = ({ msg, currUser, isLiked, isStarred, room }) => {
  const dispatch = useDispatch();
  const { currRoom } = useSelector((state) => state.roomModule);
  // const { currChatMsgs } = useSelector((state) => state.chatModule);

  const [justLiked, setJustLike] = useState(null);
  const [justStarred, setJustStarred] = useState(null);

  useEffect(() => {
    msg.star.includes(currUser._id)
      ? setJustStarred(true)
      : setJustStarred(false);
    msg.likes.includes(currUser._id) ? setJustLike(true) : setJustLike(false);
    //eslint-disable-next-line
  }, [msg.star, msg.likes]);

  const starMessage = () => {
    if (currUser.sex === 'guest') {
      eventBusService.emit('userMsg', {
        msg: 'Only registered users can like and star messages',
      });
      return;
    }
    if (msg.star.includes(currUser._id)) {
      eventBusService.emit('userMsg', { msg: 'Message was un-starred!' });
      dispatch(unStarMsg(room._id, msg.uid, msg.id, currRoom));
      // setJustStarred(false);
    } else {
      eventBusService.emit('userMsg', { msg: 'Message was starred!' });
      dispatch(starMsg(room._id, msg.uid, msg.id, currRoom));
      // setJustStarred(true);
    }
  };
  const likeMessage = () => {
    if (currUser.sex === 'guest') {
      eventBusService.emit('userMsg', {
        msg: 'Only registered users can like and star messages',
      });
      return;
    }
    if (msg.likes.includes(currUser._id)) {
      eventBusService.emit('userMsg', { msg: 'Message was un-liked!' });
      dispatch(unLikeMsg(room._id, msg.uid, msg.id, currRoom));
      // setJustLike(false);
    } else {
      eventBusService.emit('userMsg', { msg: 'Message was liked!' });
      dispatch(likeMsg(room._id, msg.uid, msg.id, currRoom));
      // setJustLike(true);
    }
  };
  // const onEditMsg = (msgId) => {
  //   dispatch(editMsg(msgId, currRoom._id));
  // };
  const onRemoveMsg = (msgId) => {
    if (
      !window.confirm(
        'Are you sure you want to perma-delete this awesome message?'
      )
    )
      return;
    console.log('onRemoveMsg, msgId:', msgId);
    eventBusService.emit('userMsg', { msg: 'Message was removed' });
    dispatch(removeMsg(msgId, currRoom._id));
  };

  return (
    <div className="msg-edit-options">
      <img
        onClick={starMessage}
        className={justStarred ? 'starred' : ''}
        src={star}
        alt="star"
      />
      <img
        onClick={likeMessage}
        className={justLiked ? 'liked' : ''}
        src={like}
        alt="like"
      />
      {currUser && currUser._id === msg.uid && (
        <div className="user-edit-options">
          {/* <img
          //will implement later
            onClick={() => onEditMsg(msg.id)}
            className="edit user-option"
            src={editIcon}
            alt="Edit"
          /> */}
          <img
            onClick={() => onRemoveMsg(msg.id)}
            className="delete user-option"
            src={removeIcon}
            alt="X"
          />
        </div>
      )}
    </div>
  );
};
