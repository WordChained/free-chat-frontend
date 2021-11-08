import React, { useEffect, useState } from 'react';
import Picker from 'emoji-picker-react';
export const EmojiWindow = ({ addEmoji }) => {
  const [chosenEmoji, setChosenEmoji] = useState(null);
  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };
  useEffect(() => {
    if (!chosenEmoji) return;
    addEmoji(chosenEmoji.emoji);
  }, [chosenEmoji]);
  return (
    <div className="emoji-window-container">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};
