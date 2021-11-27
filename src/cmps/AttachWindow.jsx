import React, { Fragment } from 'react';
// import videoIcon from '../assets/imgs/film.png';
import imgIcon from '../assets/imgs/picture.png';
// import audioIcon from '../assets/imgs/audio.png';
import gifIcon from '../assets/imgs/gif.png';

// import { ImageShare } from './ImageShare';
export const AttachWindow = ({ setImageShareState, setGifShareState }) => {
  const openImgModal = () => {
    setImageShareState(true);
    setGifShareState(false);
  };
  const openGifModal = () => {
    setImageShareState(false);
    setGifShareState(true);
  };
  return (
    <Fragment>
      <div className="attach-window-container">
        <ul className="attachment-options-list">
          {/* <li>
            <img src={videoIcon} alt="Video" />
          </li> */}
          <li>
            <img onClick={openImgModal} src={imgIcon} alt="icon" />
          </li>
          {/* <li>
            <img src={audioIcon} alt="audio" />
          </li> */}
          <li>
            <img onClick={openGifModal} src={gifIcon} alt="gif" />
          </li>
        </ul>
      </div>
    </Fragment>
  );
};
