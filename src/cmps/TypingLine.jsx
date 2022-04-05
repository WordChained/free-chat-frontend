import React from 'react';
import { useForm } from 'react-hook-form';
export const TypingLine = () => {
  return (
    <div className={`typing-line ${moreOptions ? 'more' : ''}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea
          placeholder={
            width > 500 ? 'Ctrl + Enter to add a line...' : 'Send a message...'
          }
          {...register('msg-input')}
          id='msg-input'
          type='text'
          spellCheck='true'
          autoComplete='off'
          ref={elInput}
          className={isEmpty ? '' : 'allowed'}
          onKeyUp={checkIsEmpty}
          onKeyDown={checkIsEmpty}
        />
        <button type='submit' className={isEmpty ? '' : 'allowed'}>
          <img className={isEmpty ? '' : 'allowed'} src={send} alt='send' />
        </button>
      </form>
      {width < 500 && (
        <button className='more'>
          <img
            className='more-icon'
            onClick={() => setMoreOptions(!moreOptions)}
            src={more}
            alt='more'
          />
        </button>
      )}
      <div className={`chat-btns ${moreOptions ? 'more' : ''}`}>
        <span> | </span>
        <img
          src={cogwheel}
          alt='settings'
          onClick={() => toggleCorrectWindow('settings')}
          className={`settings-icon ${isChatSettingsOpen ? 'open' : ''}`}
        />
        <img
          src={attachment}
          alt='attachment'
          onClick={() => toggleCorrectWindow('attach')}
          className={`attach-icon ${isAttachWindowOpen ? 'open' : ''}`}
        />
        <img
          src={isEmojiWindownOpen ? thinking : smiley}
          alt='smiley'
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
  );
};
