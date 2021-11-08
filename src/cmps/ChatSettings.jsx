import React from 'react';

export const ChatSettings = ({ backgroundPicker, clear }) => {
  const openBackgroundPicker = () => {
    clear('clear');
    backgroundPicker(true);
  };
  return (
    <div className="chat-settings-container">
      <ul className="settings-list">
        <li onClick={openBackgroundPicker}>Change background</li>
        {/* <li>Change text color</li> */}
        {/* <li>some other option</li> */}
      </ul>
    </div>
  );
};
