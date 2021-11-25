import React, { Fragment, useState } from 'react';
import videoIcon from '../assets/imgs/film.png';
import imgIcon from '../assets/imgs/picture.png';
import audioIcon from '../assets/imgs/audio.png';
import gifIcon from '../assets/imgs/gif.png';

import { ImageShare } from './ImageShare';
export const AttachWindow = ({ setImageShareState }) => {
  return (
    <Fragment>
      <div className="attach-window-container">
        <ul className="attachment-options-list">
          <li>
            <img src={videoIcon} alt="Video" />
          </li>
          <li>
            <img
              onClick={() => setImageShareState(true)}
              src={imgIcon}
              alt="icon"
            />
          </li>
          <li>
            <img src={audioIcon} alt="audio" />
          </li>
          <li>
            <img src={gifIcon} alt="gif" />
          </li>
        </ul>
      </div>
    </Fragment>
  );
};
