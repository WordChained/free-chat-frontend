import React from 'react';

// import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
// import makeAnimated from 'react-select/animated';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { socketService } from '../services/socketService';
import { useDispatch } from 'react-redux';
import { setCurrPrivateRoom } from '../store/actions/roomActions';
import { getEmptyPrivateRoom } from '../services/roomService';
// import { getLoggedinUser } from '../store/actions/userActions';
export const SearchForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const options = [
    { value: 'music', label: 'Music' },
    { value: 'food', label: 'Food' },
    { value: 'video games', label: 'Video Games' },
    { value: 'code', label: 'Code' },
    { value: 'love', label: 'Love' },
    { value: 'art', label: 'Art' },
  ];
  const [showTopics, setShowTopics] = useState(false);
  const [topics, setTopics] = useState([]);

  const handleChange = (newValue, actionMeta) => {
    // console.log('new value:', newValue);
    // console.log(`action: ${actionMeta.action}`);
    setTopics([...newValue]);
  };

  const search = (ev) => {
    ev.preventDefault();
    //if its topics and there are no topics, dont search
    if (showTopics && !topics.length) {
      console.log('Please pick at least one topic');
      alert('Please pick at least one topic');
      //need to add user message here
      return;
    }
    // console.log('topics:', topics);
    const privateRoom = getEmptyPrivateRoom();
    privateRoom.topics = topics;
    dispatch(setCurrPrivateRoom(privateRoom));
    // storageService.store('topics', topics);

    //making a simple topics array
    // let topicsToSocket = [...topics];
    // topicsToSocket = topics.length
    //   ? topicsToSocket.map((topic) => topic.value)
    //   : [];

    sessionStorage.setItem('topics', JSON.stringify(topics));
    // socketService.emit('join-private-room', {
    //   uid: getLoggedinUser()._id,
    //   topics: topicsToSocket,
    // });
    navigate('/free-chat');
  };

  return (
    <div className="search-form">
      <form onSubmit={search}>
        <div className="radio-btns">
          <div>
            <input
              name="chat-type"
              id="free-search"
              type="radio"
              value="free-search"
              onChange={() => setShowTopics(false)}
              checked={!showTopics}
            />
            <label htmlFor="free-search">
              <span className={!showTopics ? 'checked' : ''}>Free Search</span>
            </label>
          </div>
          <div>
            <input
              name="chat-type"
              id="topics"
              type="radio"
              value="topics"
              onChange={() => setShowTopics(true)}
            />
            <label htmlFor="topics">
              <span className={showTopics ? 'checked' : ''}>
                Search people by topics
              </span>
            </label>
          </div>
        </div>

        {showTopics && (
          <CreatableSelect
            id="select-topic"
            className="select-Private-topics"
            isMulti
            options={options}
            onChange={handleChange}
            placeholder="Select a topic or add your own.."
            // components={animatedComponents}
          />
        )}
        <button type="submit">Search for a chat</button>
      </form>
    </div>
  );
};
