import React from 'react';
import bg1 from '../assets/chat-backgrounds/default-background.jpg';
import bg2 from '../assets/chat-backgrounds/1288076.jpg';
import bg3 from '../assets/chat-backgrounds/1288078.jpg';
import bg4 from '../assets/chat-backgrounds/1288080.jpg';
import bg5 from '../assets/chat-backgrounds/1288082.jpg';
import bg6 from '../assets/chat-backgrounds/1288084.jpg';
import bg7 from '../assets/chat-backgrounds/1288086.jpg';
import bg8 from '../assets/chat-backgrounds/1288089.jpg';
import bg9 from '../assets/chat-backgrounds/1288091.jpg';

import { useDispatch } from 'react-redux';
import { save } from '../store/actions/roomActions';
export const BackgroundPicker = ({ backgroundPicker, room }) => {
  const dispatch = useDispatch();
  const backgroundImages = [
    { name: 'default', src: bg1 },
    { name: 'stars', src: bg2 },
    { name: 'signs', src: bg3 },
    { name: 'social-media', src: bg4 },
    { name: 'quotes', src: bg5 },
    { name: 'social-media2', src: bg6 },
    { name: 'glass', src: bg7 },
    { name: 'neon', src: bg8 },
    { name: 'rocks', src: bg9 },
  ];

  const changeBackground = (bg) => {
    room.wallPaper = bg;
    console.log('room with wp', room);
    dispatch(save(room));
    backgroundPicker(false);
  };
  return (
    <div className="background-picker-container">
      <button onClick={() => backgroundPicker(false)}>X</button>
      <div className="background-picker-list">
        {backgroundImages.map((bg) => {
          console.log(bg);
          return (
            <img
              onClick={() => changeBackground(bg.src)}
              key={bg.name}
              src={bg.src}
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
};
