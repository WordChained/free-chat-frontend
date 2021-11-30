import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImg } from '../services/img-upload-service';
import { unsplashService } from '../services/unsplash-service';
export const ImageShare = ({ setImageShareState, addImg }) => {
  const { register, handleSubmit } = useForm();

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imageToSend, setImageToSend] = useState('');
  const [waitingForUpload, setWaitingForUpload] = useState(false);
  const [unsplashResults, setUnsplashResults] = useState([]);
  const [query, setQuery] = useState('');

  const img = new Image();
  img.onload = () => {
    setImgLoaded(true);
  };

  const addUnsplashImg = async () => {
    const { results } = await unsplashService.fetchResults(query);
    const imageArray = [];
    results.map((res) => {
      imageArray.push({
        id: res.id,
        url: res.urls.thumb,
      });
    });
    setUnsplashResults(imageArray);
  };

  const handleImg = async (ev) => {
    console.log('ev.target.files[0]:', ev.target.files[0]);
    if (!ev.target.files[0]) return;
    const file = ev.target.files[0];
    const fileType = file['type'];
    if (!fileType.includes('image')) return;
    try {
      setImgLoaded(false);
      const savedImg = await uploadImg(file);
      setWaitingForUpload(true);
      console.log(savedImg.url);
      setImageToSend(savedImg.url);
      //   setImgLoaded(true);
    } catch (err) {
      console.log('Error on handle img =>', err);
    }
  };
  useEffect(() => {
    console.log('addingunsplash');
    addUnsplashImg(query);
    return () => {};
    //eslint-disable-next-line
  }, [query]);

  useEffect(() => {
    img.src = imageToSend;
    //eslint-disable-next-line
  }, [imageToSend]);

  const onSubmit = (data) => {
    setQuery(data['query']);
  };

  const setUnsplashImg = async (img) => {
    console.log('img:', img);
    setWaitingForUpload(true);
    setImgLoaded(false);
    setImageToSend(img.url);
    // setImgLoaded(true);
  };
  const sendImg = () => {
    if (!imageToSend || !imgLoaded) return;
    addImg(imageToSend);
    setImageShareState(false);
  };

  return (
    <div className="image-share-window">
      <button className="close" onClick={() => setImageShareState(false)}>
        X
      </button>
      <h4>Add an Image</h4>
      <form className="upload-form">
        <label htmlFor="upload">Upload your own</label>
        <input
          className="upload-input"
          //   {...register('image')}
          type="file"
          name="upload"
          id="upload"
          onChange={(ev) => handleImg(ev)}
          //   placeholder="Upload your own"
        />
      </form>
      <form className="unsplash-form" onSubmit={handleSubmit(onSubmit)}>
        {/* <label htmlFor="search-unsplash">Search the Web: </label> */}
        <input
          type="text"
          name="search-unsplash"
          placeholder="Search the Web"
          {...register('query')}
        />
        <button type="submit">GO!</button>
      </form>
      <div className="unsplash-list">
        {unsplashResults.map((res) => {
          return (
            <div className="container" key={res.id}>
              <img onClick={() => setUnsplashImg(res)} src={res.url} alt="" />
            </div>
          );
        })}
      </div>
      {waitingForUpload && (
        <div className="upload-preview">
          {imgLoaded ? (
            <div className="img-container">
              <img src={imageToSend} alt="preview" />
            </div>
          ) : (
            <div class="lds-ring preview-loader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
          <button className="send-btn" onClick={sendImg}>
            SEND!
          </button>
        </div>
      )}
      {/* //need to close window, send as msg and make msg know how to read this */}
    </div>
  );
};
