import React, { useState } from 'react';
// import { IGif } from '@giphy/js-types';
// import { useAsync } from 'react-async-hook';
import { GridGiphy } from './GridGiphy';
import { Gif } from '@giphy/react-components';
export const GiphyComponent = ({ sendGif, setGifShareState }) => {
  const [modalGif, setModalGif] = useState();
  return (
    <div className="gif-cmp">
      <button className="close" onClick={() => setGifShareState(false)}>
        X
      </button>
      <GridGiphy
        onGifClick={(gif, e) => {
          console.log('gif', gif);
          e.preventDefault();
          setModalGif(gif);
        }}
      />
      {modalGif && (
        <div
          className="modal-gif"
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            width: '100%',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(0, 0, 0, .8)',
          }}
          onClick={(e) => {
            e.preventDefault();
            setModalGif(undefined);
          }}
        >
          <Gif gif={modalGif} width={300} />
          <button onClick={() => sendGif(modalGif)}>SEND!</button>
        </div>
      )}
    </div>
  );
};
