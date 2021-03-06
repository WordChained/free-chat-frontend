import {
  memo,
  useEffect,
  useState,
  useRef,
  Fragment,
  useLayoutEffect,
} from 'react';
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
import more from '../assets/imgs/more.png';
import downArrow from '../assets/imgs/down-arrow.png';

//user images
import maleUser from '../assets/imgs/tattoo-male.png';
import femaleUser from '../assets/imgs/tattoo-female.png';
import guestImg from '../assets/imgs/guest.png';

import defaultWP from '../assets/chat-backgrounds/default-background.jpg';

import { getMsgs, addMsg } from '../store/actions/chatActions';
import { getLoggedinUser, getUsers } from '../store/actions/userActions';
import { socketService } from '../services/socketService';

// cmps
import { AlwaysScrollToBottom } from './AlwaysScrollToBottom';
import { MsgEditOptions } from './MsgEditOptions';
import { ChatSettings } from './ChatSettings';
import { EmojiWindow } from './EmojiWindow';
import { AttachWindow } from './AttachWindow';
import { BackgroundPicker } from './BackgroundPicker';
import { makeIdWithLetters } from '../services/utilService';
import { ImageShare } from './ImageShare';
import { GiphyComponent } from './GiphyComponent';
// import { SingleMsg } from './SingleMsg';
// import { TypingLine } from './TypingLine';

export const Chat = memo(() => {
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }
  const [width, height] = useWindowSize();

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const { currChatMsgs } = useSelector((state) => state.chatModule);
  const { loggedInUser, guestUser, users } = useSelector(
    (state) => state.userModule
  );
  const { currRoom } = useSelector((state) => state.roomModule);

  const [sent, setSent] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  // const [currUser, setCurrUser] = useState(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [isChatSettingsOpen, setIsChatSettingsOpen] = useState(false);
  const [isEmojiWindownOpen, setIsEmojiWindownOpen] = useState(false);
  const [isAttachWindowOpen, setIsAttachWindowOpen] = useState(false);
  const [isBackgroundPickerOpen, setIsBackgroundPickerOpen] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [imageShareState, setImageShareState] = useState(false);
  const [gifShareState, setGifShareState] = useState(false);

  const [currMsgToEdit, setCurrMsgToEdit] = useState({
    edit: false,
    msgId: null,
  });

  const currUser = getLoggedinUser();

  useEffect(() => {
    // socketService.emit('room topic', currRoom._id);
    console.log('times Chat is rendered');
    if (!users) {
      dispatch(getUsers());
    }
    // setCurrUser(getLoggedinUser());
    if (guestUser) {
      setDefaultImg(guestImg);
    } else if (loggedInUser) {
      setDefaultImg(loggedInUser.sex === 'male' ? maleUser : femaleUser);
    }

    dispatch(getMsgs(currRoom._id));
    setSent(true);
    socketService.on('room addMsg', (msg) => {
      console.log('times this happens');
      if (msg.uid === getLoggedinUser()._id)
        dispatch(
          addMsg(
            currRoom._id,
            msg.text,
            msg.uid,
            msg.name,
            msg.isEdit,
            msg.star,
            msg.likes,
            msg.ticket
          )
        );
      else {
        dispatch(getMsgs(currRoom._id));
      }
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
  const addImg = (imgUrl) => {
    // elInput.current.value = imgUrl;
    const data = { 'msg-input': imgUrl };
    onSubmit(data);
  };
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
  const sendGif = (gif) => {
    const data = { 'msg-input': gif.images.original.url };
    onSubmit(data);
    setGifShareState(false);
  };

  const msgsContainer = useRef();
  // const onChangeBackgroundImg = (image) => {
  //   console.log(msgsContainer.current);
  // };
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
      if (ev.keyCode === enter) ev.preventDefault();
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
    const nameToAttatch = currUser.sex === 'guest' ? 'fullName' : 'userName';
    const newMsg = {
      text: data['msg-input'],
      uid: currUser._id,
      name: currUser[nameToAttatch],
      isEdit: false,
      star: [],
      likes: [],
      ticket: makeIdWithLetters(10),
    };
    elInput.current.value = '';
    socketService.emit('room newMsg', newMsg);
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
            style={{
              backgroundImage: `url(${
                currRoom.wallPaper ? currRoom.wallPaper : defaultWP
              })`,
            }}
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
                    if (loading) return <div>????</div>;
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
                {currMsgToEdit.edit && currMsgToEdit.msgId === msg.id && (
                  <MsgEditOptions
                    msg={msg}
                    currUser={currUser}
                    isLiked={isLikedByCurrUser(msg.id)}
                    isStarred={isStarredByCurrUser(msg.id)}
                    room={currRoom}
                  />
                )}
                {/* <SingleMsg
                  msg={msg}
                  currUser={currUser}
                  changeEditState={changeEditState}
                  currMsgToEdit={currMsgToEdit}
                  sent={sent}
                /> */}
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
                    <span className={`msg-status-marks ${sent ? 'sent' : ''}`}>
                      ??????
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
        {/* <div className="go-down">
          <img src={downArrow} alt="down-arrow" />
        </div> */}
        {/* <TypingLine/> */}
        <div className={`typing-line ${moreOptions ? 'more' : ''}`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              placeholder={
                width > 500
                  ? 'Ctrl + Enter to add a line...'
                  : 'Send a message...'
              }
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
          {width < 500 && (
            <button className="more">
              <img
                className="more-icon"
                onClick={() => setMoreOptions(!moreOptions)}
                src={more}
                alt="more"
              />
            </button>
          )}
          <div className={`chat-btns ${moreOptions ? 'more' : ''}`}>
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
          {isAttachWindowOpen && (
            <AttachWindow
              setImageShareState={setImageShareState}
              setGifShareState={setGifShareState}
            />
          )}
        </div>
      </div>
      {isBackgroundPickerOpen && (
        <BackgroundPicker
          backgroundPicker={setIsBackgroundPickerOpen}
          room={currRoom}
        />
      )}
      {imageShareState && (
        <ImageShare setImageShareState={setImageShareState} addImg={addImg} />
      )}
      {gifShareState && (
        <GiphyComponent sendGif={sendGif} setGifShareState={setGifShareState} />
      )}
    </Fragment>
  );
});
