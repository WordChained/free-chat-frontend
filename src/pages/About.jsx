import React from 'react';
//techs:
import reactIcon from '../assets/technoligies/react.png';
import reduxIcon from '../assets/technoligies/redux.png';
import html5Icon from '../assets/technoligies/html5.png';
import css3Icon from '../assets/technoligies/css3.png';
import mongoIcon from '../assets/technoligies/mongo.png';
import nodetIcon from '../assets/technoligies/node.png';
import sasstIcon from '../assets/technoligies/sass.png';
export const About = () => {
  return (
    <div className="about-page">
      <h2>About Free-Chat</h2>
      <p>Hello and welcome to my Free-Chat app!</p>
      <p>
        Remember to be respectful to the other users and keep everything as
        civil as possible. This app was created to showcase a few of my
        abilities.
      </p>
      <p>
        You can either chat with random people by topics (like Omegle), go
        topic-less or go to the chat rooms. if you have an idea for a room, feel
        free to add one!
      </p>
      <p>These are some of the technologies i used:</p>
      <div className="icons">
        <img src={reactIcon} alt="react" />
        <img src={reduxIcon} alt="redux" />
        <img src={html5Icon} alt="html5" />
        <img src={css3Icon} alt="css3" />
        <img src={mongoIcon} alt="mongoDB" />
        <img src={nodetIcon} alt="node.js" />
        <img src={sasstIcon} alt="sass" />
      </div>
    </div>
  );
};
