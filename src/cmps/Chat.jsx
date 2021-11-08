import { memo, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  // Color,
  Palette,
} from 'color-thief-react';

//buttons imgs:
import cogwheel from '../assets/imgs/setting.png';
import attachment from '../assets/imgs/attachment.png';
import smiley from '../assets/imgs/smiley.png';
import thinking from '../assets/imgs/thinking.png';
import send from '../assets/imgs/send.png';
import edit from '../assets/imgs/edit.png';
import like2 from '../assets/imgs/like2.png';

//user images
import maleUser from '../assets/imgs/tattoo-male.png';
import femaleUser from '../assets/imgs/tattoo-female.png';
import guestImg from '../assets/imgs/guest.png';

import { getMsgs, addMsg } from '../store/actions/chatActions';
import { getLoggedinUser, getUsers } from '../store/actions/userActions';
import { socketService } from '../services/socketService';

// cmps
import { AlwaysScrollToBottom } from './AlwaysScrollToBottom';
import { MsgEditOptions } from './MsgEditOptions';
import { ChatSettings } from './ChatSettings';
import { EmojiWindow } from './EmojiWindow';
import { AttachWindow } from './AttachWindow';

export const Chat = memo(() => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { currChatMsgs } = useSelector((state) => state.chatModule);
  const { loggedInUser, guestUser, users } = useSelector(
    (state) => state.userModule
  );
  const { currRoom } = useSelector((state) => state.roomModule);

  const [sent, setSent] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  const [currUser, setCurrUser] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
  const [isEmojiWindownOpen, setIsEmojiWindownOpen] = useState(false);
  const [isAttachWindowOpen, setIsAttachWindowOpen] = useState(false);
  const [currMsgToEdit, setCurrMsgToEdit] = useState({
    edit: false,
    msgId: null,
  });

  useEffect(() => {
    // socketService.emit('room topic', currRoom._id);
    if (!users) {
      dispatch(getUsers());
    }
    setCurrUser(getLoggedinUser());
    if (guestUser) {
      setDefaultImg(guestImg);
    } else if (loggedInUser) {
      setDefaultImg(loggedInUser.sex === 'male' ? maleUser : femaleUser);
    }

    dispatch(getMsgs(currRoom._id));
    setSent(true);
    socketService.on('room addMsg', (msg) => {
      dispatch(
        addMsg(
          currRoom._id,
          msg.text,
          msg.uid,
          msg.name,
          msg.isEdit,
          msg.star,
          msg.likes
        )
      );
      setTimeout(() => {
        dispatch(getMsgs(currRoom._id));
      }, 100);
    });
    return () => {
      dispatch(getMsgs(null));
      socketService.off('room addMsg');
    };

    //eslint-disable-next-line
  }, []);

  const elInput = useRef();
  const addEmoji = (emoji) => {
    // console.log('value:', elInput.current.value);
    elInput.current.value = elInput.current.value + emoji;
  };

  const toggleCorrectWindow = (name) => {
    switch (name) {
      case 'clear':
        setIsAttachWindowOpen(false);
        setIsChatSettingsOpen(false);
        setIsEmojiWindownOpen(false);
        break;
      case 'attach':
        if (isAttachWindowOpen) {
          setIsAttachWindowOpen(false);
          return;
        }
        setIsAttachWindowOpen(true);
        setIsChatSettingsOpen(false);
        setIsEmojiWindownOpen(false);
        break;
      case 'emoji':
        if (isEmojiWindownOpen) {
          setIsEmojiWindownOpen(false);
          return;
        }
        setIsAttachWindowOpen(false);
        setIsChatSettingsOpen(false);
        setIsEmojiWindownOpen(true);
        break;
      case 'settings':
        if (isChatSettingsOpen) {
          setIsChatSettingsOpen(false);
          return;
        }
        setIsAttachWindowOpen(false);
        setIsChatSettingsOpen(true);
        setIsEmojiWindownOpen(false);
        break;
    }
  };

  // this makes text area use enter to submit and Ctrl+Enter to go down a line
  const keyMap = {};
  const checkIsEmpty = (ev) => {
    const control = 17;
    const enter = 13;
    let data = { 'msg-input': ev.target.value };
    if (ev.target.value === '') {
      setIsEmpty(true);
    } else {
      setIsEmpty(false);
    }
    if (ev.target.value === '') return;
    keyMap[ev.keyCode] = ev.type === 'keydown';
    if (keyMap[control] && keyMap[enter]) {
      console.log('both!');
      ev.target.value = ev.target.value + '\n';
    } else if (keyMap[enter]) {
      ev.preventDefault();
      console.log('just enter');
      handleSubmit(onSubmit(data));
    }
  };

  const isLikedByCurrUser = (msgId) => {
    const msg = currRoom.msgs.find((msg) => msg.id === msgId);
    if (msg) {
      if (msg && msg.likes.includes(currUser._id)) {
        return true;
      } else {
        return false;
      }
    }
  };
  const isStarredByCurrUser = (msgId) => {
    const msg = currRoom.msgs.find((msg) => msg.id === msgId);
    if (msg) {
      if (msg && msg.star.includes(currUser._id)) {
        return true;
      } else {
        return false;
      }
    }
  };
  const getSenderInfo = (type, msg) => {
    const sender = users.find((u) => {
      return u._id === msg.uid;
    });
    if (sender) {
      return sender[type];
    }
  };
  const changeEditState = (msgId, uid) => {
    if (currMsgToEdit.edit === true && currMsgToEdit.msgId === msgId) {
      setCurrMsgToEdit({ edit: false, msgId: null });
    } else {
      setCurrMsgToEdit({ edit: true, msgId });
    }
  };

  const onSubmit = (data) => {
    console.log('data', data);
    if (!data['msg-input']) return;
    // console.log('currUser is the sender...', currUser);
    // console.log('msg-input:', data['msg-input']);
    const nameToAttatch = currUser.sex === 'guest' ? 'fullName' : 'userName';
    const newMsg = {
      text: data['msg-input'],
      uid: currUser._id,
      name: currUser[nameToAttatch],
      isEdit: false,
      star: [],
      likes: [],
    };
    socketService.emit('room newMsg', newMsg);
    reset();
  };

  if (!currUser || !users)
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  return (
    <div className="chat-container">
      {currChatMsgs && (
        <div
          className="msgs-container"
          onClick={() => toggleCorrectWindow('clear')}
        >
          <p className="start-of-chat">This is the beggining of the chat!</p>

          {currChatMsgs.map((msg) => (
            <div
              key={msg.id}
              className={`single-msg ${
                currUser && currUser._id === msg.uid ? 'sender' : ''
              }`}
            >
              <Palette
                src={
                  currUser && getSenderInfo('imgUrl', msg)
                    ? getSenderInfo('imgUrl', msg)
                    : msg.name.includes('guest')
                    ? guestImg
                    : defaultImg
                }
                crossOrigin="anonymous"
                format="hex"
                colorCount={4}
              >
                {({ data, loading }) => {
                  if (loading) return <div>🕒</div>;
                  return (
                    <img
                      style={{
                        backgroundColor: data[data.length / 2],
                      }}
                      className="user-img"
                      src={
                        currUser && getSenderInfo('imgUrl', msg)
                          ? getSenderInfo('imgUrl', msg)
                          : msg.name.includes('guest')
                          ? guestImg
                          : defaultImg
                      }
                      alt="userImg"
                    />
                  );
                }}
              </Palette>
              {/* {isLikedByCurrUser(msg.id)}
              {isStarredByCurrUser(msg.id)} */}
              {currMsgToEdit.edit && currMsgToEdit.msgId === msg.id && (
                <MsgEditOptions
                  msg={msg}
                  currUser={currUser}
                  isLiked={isLikedByCurrUser(msg.id)}
                  isStarred={isStarredByCurrUser(msg.id)}
                  room={currRoom}
                />
              )}
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
                {msg.text}
                <span className="sent-at">
                  {new Date(msg.sentAt).toLocaleTimeString('he-IL', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  <span className={`msg-status-marks ${sent ? 'sent' : ''}`}>
                    ✔✔
                  </span>
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
            </div>
          ))}
          <AlwaysScrollToBottom msgs={currChatMsgs.length} />
        </div>
      )}
      <div className="typing-line">
        <form onSubmit={handleSubmit(onSubmit)}>
          <textarea
            placeholder="Ctrl + Enter to add a line..."
            {...register('msg-input')}
            id="msg-input"
            type="text"
            spellCheck="true"
            autoComplete="off"
            ref={elInput}
            className={isEmpty ? '' : 'allowed'}
            onKeyUp={checkIsEmpty}
            onKeyDown={checkIsEmpty}
          />
          <button type="submit" className={isEmpty ? '' : 'allowed'}>
            <img className={isEmpty ? '' : 'allowed'} src={send} alt="send" />
          </button>
        </form>
        <div className="chat-btns">
          <span> | </span>
          <img
            src={cogwheel}
            alt="settings"
            onClick={() => toggleCorrectWindow('settings')}
            className={`settings-icon ${isChatSettingsOpen ? 'open' : ''}`}
          />
          <img
            src={attachment}
            alt="attachment"
            onClick={() => toggleCorrectWindow('attach')}
            className={`attach-icon ${isAttachWindowOpen ? 'open' : ''}`}
          />
          <img
            src={isEmojiWindownOpen ? thinking : smiley}
            alt="smiley"
            onClick={() => toggleCorrectWindow('emoji')}
          />
        </div>
        {isChatSettingsOpen && <ChatSettings />}
        {isEmojiWindownOpen && <EmojiWindow addEmoji={addEmoji} />}
        {isAttachWindowOpen && <AttachWindow />}
      </div>
    </div>
  );
});
