import React, { useSelector } from 'react';
import edit from '../assets/imgs/edit.png';
import like2 from '../assets/imgs/like2.png';

export const SingleMsg = ({
  msg,
  currUser,
  changeEditState,
  currMsgToEdit,
  sent,
}) => {
  const { users } = useSelector((state) => state.userModule);
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const linkify = (text) => {
    return text.replace(urlRegex, (url) => {
      return `<a href=${url} target="_blank">${url}</a>`;
    });
  };
  const picturfy = (text) => {
    return text.replace(urlRegex, (url) => {
      return `<img src="${url}"/>`;
    });
  };
  function checkIfImg(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

  const getSenderInfo = (type, msg) => {
    const sender = users.find((u) => {
      return u._id === msg.uid;
    });
    if (sender) {
      return sender[type];
    }
  };

  return (
    <div
      key={msg.id}
      name="single-msg-txt"
      className={
        currUser && currUser._id === msg.uid
          ? 'sender'
          : currMsgToEdit.edit
          ? 'edit'
          : ''
      }
      style={
        msg.star.includes(currUser._id)
          ? { boxShadow: 'gold 0 0 5px' }
          : { boxShadow: 'none' }
      }
    >
      <span className="sender-name">
        {getSenderInfo('userName', msg)
          ? getSenderInfo('userName', msg)
          : msg.name}
      </span>
      <span
        dangerouslySetInnerHTML={{
          __html: checkIfImg(msg.text)
            ? `<img src=${msg.text} />`
            : msg.text.includes('images.unsplash') ||
              msg.text.includes('giphy.com/media')
            ? picturfy(msg.text)
            : linkify(msg.text).trim(),
        }}
      ></span>
      <span className="sent-at">
        {new Date(msg.sentAt).toLocaleTimeString('he-IL', {
          hour: '2-digit',
          minute: '2-digit',
        })}{' '}
        <span className={`msg-status-marks ${sent ? 'sent' : ''}`}>✔✔</span>
      </span>
      <img
        className="edit-btn"
        src={edit}
        alt="edit"
        onClick={() => changeEditState(msg.id, msg.uid)}
      />
      {msg.likes.length ? (
        <div className="like-count">
          <span>{msg.likes.length}</span>
          <img src={like2} alt="heart" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
