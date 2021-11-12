import { memo, useEffect, useState, useRef, Fragment } from 'react';
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

import defaultWP from '../assets/chat-backgrounds/default-background.jpg';

//user images
import maleUser from '../assets/imgs/tattoo-male.png';
import femaleUser from '../assets/imgs/tattoo-female.png';
import guestImg from '../assets/imgs/guest.png';

import { getPrivateMsgs, addPrivateMsg } from '../store/actions/chatActions';
import { getLoggedinUser, getUsers } from '../store/actions/userActions';
import { socketService } from '../services/socketService';

import { AlwaysScrollToBottom } from './AlwaysScrollToBottom';
// import { MsgEditOptions } from './MsgEditOptions';
import { ChatSettings } from './ChatSettings';
import { EmojiWindow } from './EmojiWindow';
import { AttachWindow } from './AttachWindow';
import { BackgroundPicker } from './BackgroundPicker';

export const PrivateChat = memo(({ topics }) => {
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const { currChatMsgs } = useSelector((state) => state.chatModule);
  const { loggedInUser, guestUser, users } = useSelector(
    (state) => state.userModule
  );
  const { currPrivateRoom } = useSelector((state) => state.roomModule);

  const [sent, setSent] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  const [currUser, setCurrUser] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [firstMsg, setFirstMsg] = useState('looking for a stranger...');
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
  const [isEmojiWindownOpen, setIsEmojiWindownOpen] = useState(false);
  const [isAttachWindowOpen, setIsAttachWindowOpen] = useState(false);
  const [isBackgroundPickerOpen, setIsBackgroundPickerOpen] = useState(false);

  const elInput = useRef();
  const addEmoji = (emoji) => {
    // console.log('value:', elInput.current.value);
    elInput.current.value = elInput.current.value + emoji;
  };

  const msgsContainer = useRef();
  useEffect(() => {
    let topicsToSocket = [...topics];
    topicsToSocket = topics.length
      ? topicsToSocket.map((topic) => topic.value)
      : [];
    socketService.emit('join-private-room', {
      uid: getLoggedinUser()._id,
      topics: topicsToSocket,
    });
    socketService.on('private-room-enter-msg', (enterMsg) => {
      console.log('enterMsg:', enterMsg);
      setFirstMsg(enterMsg);
    });
    if (!users) {
      dispatch(getUsers());
    }
    setCurrUser(getLoggedinUser());
    if (guestUser) {
      setDefaultImg(guestImg);
    } else if (loggedInUser) {
      setDefaultImg(loggedInUser.sex === 'male' ? maleUser : femaleUser);
    }

    dispatch(getPrivateMsgs(currPrivateRoom._id));
    setSent(true);
    socketService.on('private-room-add-msg', (msg) => {
      dispatch(addPrivateMsg(currPrivateRoom._id, msg.text, msg.uid, msg.name));
      // setTimeout(() => {
      //   dispatch(getPrivateMsgs(currPrivateRoom._id));
      // }, 100);
    });
    return () => {
      dispatch(getPrivateMsgs(null));
      // socketService.off('room addMsg');
    };

    //eslint-disable-next-line
  }, []);

  const getSenderInfo = (type, msg) => {
    const sender = users.find((u) => {
      return u._id === msg.uid;
    });
    if (sender) {
      return sender[type];
    }
  };

  const onSubmit = (data) => {
    if (!data['msg-input']) return;
    // console.log('currUser is the sender...', currUser);
    // console.log('msg-input:', data['msg-input']);
    const nameToAttatch = currUser.sex === 'guest' ? 'fullName' : 'userName';
    const newMsg = {
      text: data['msg-input'],
      uid: currUser._id,
      name: currUser[nameToAttatch],
    };
    socketService.emit('private-room-msg', newMsg);
    reset();
  };

  const lookForNewChat = () => {
    let topicsToSocket = [...topics];
    topicsToSocket = topics.length
      ? topicsToSocket.map((topic) => topic.value)
      : [];
    socketService.emit('leave-private-room', {
      uid: getLoggedinUser()._id,
      topics: topicsToSocket,
    });
    socketService.emit('join-private-room', {
      uid: getLoggedinUser()._id,
      topics: topicsToSocket,
    });
    setFirstMsg('looking for a stranger...');
  };

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

  if (!currUser || !users)
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  return (
    <Fragment>
      <div className="chat-container">
        {currChatMsgs && (
          <div
            className="msgs-container"
            onClick={() => toggleCorrectWindow('clear')}
            ref={msgsContainer}
            style={{ backgroundImage: `url(${defaultWP})` }}
          >
            <p className="start-of-chat">{firstMsg}</p>
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
                <div
                  key={msg.id}
                  name="single-msg-txt"
                  className={
                    currUser && currUser._id === msg.uid ? 'sender' : ''
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
                </div>
              </div>
            ))}
            <AlwaysScrollToBottom />
          </div>
        )}
        <div className="typing-line">
          <button className="new-stranger-btn" onClick={lookForNewChat}>
            New Stranger
          </button>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
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
          {isChatSettingsOpen && (
            <ChatSettings
              backgroundPicker={setIsBackgroundPickerOpen}
              clear={toggleCorrectWindow}
            />
          )}
          {isEmojiWindownOpen && <EmojiWindow addEmoji={addEmoji} />}
          {isAttachWindowOpen && <AttachWindow />}
        </div>
      </div>
      {isBackgroundPickerOpen && (
        <BackgroundPicker
          backgroundPicker={setIsBackgroundPickerOpen}
          room={currPrivateRoom}
        />
      )}
    </Fragment>
  );
});
