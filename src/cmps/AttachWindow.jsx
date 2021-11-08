import React from 'react';
import videoIcon from '../assets/imgs/film.png';
import imgIcon from '../assets/imgs/picture.png';
import audioIcon from '../assets/imgs/audio.png';
export const AttachWindow = () => {
  return (
    <div className="attach-window-container">
      <ul className="attachment-options-list">
        <li>
          <img src={videoIcon} alt="Video" />
        </li>
        <li>
          <img src={imgIcon} alt="icon" />
        </li>
        <li>
          <img src={audioIcon} alt="audio" />
        </li>
      </ul>
    </div>
  );
};
