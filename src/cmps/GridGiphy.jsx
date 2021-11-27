import React, { useState } from 'react';
import { Grid } from '@giphy/react-components';
import ResizeObserver from 'react-resize-observer';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useForm } from 'react-hook-form';

export const GridGiphy = ({ onGifClick }) => {
  const { register, handleSubmit } = useForm();
  const giphyFetch = new GiphyFetch('kUFnkefTbfpvs1fMZU6131V9TbrKVHT9');
  const [query, setQuery] = useState('');
  const fetchGifs = (offset) => giphyFetch.trending({ offset, limit: 10 });
  const fetchGifsByQuery = (offset) =>
    giphyFetch.search(query, { offset, limit: 10 });
  const [width, setWidth] = useState(window.innerWidth);
  const onSubmit = (data) => {
    setQuery(data['gif-search']);
  };
  return (
    <>
      <h3>GIF Search</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('gif-search')}
          type="text"
          placeholder="Search For GIFs"
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
      {query && (
        <>
          <h5>Search Results:</h5>
          <Grid
            onGifClick={onGifClick}
            fetchGifs={fetchGifsByQuery}
            width={width}
            columns={3}
            gutter={6}
          />
        </>
      )}
      {!query && (
        <>
          <h5>Trending:</h5>
          <Grid
            onGifClick={onGifClick}
            fetchGifs={fetchGifs}
            width={width}
            columns={3}
            gutter={6}
          />
        </>
      )}
      <ResizeObserver
        onResize={({ width }) => {
          setWidth(width);
        }}
      />
    </>
  );
};
