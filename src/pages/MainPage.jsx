import React from 'react';
import { useSelector } from 'react-redux';
import { SearchForm } from '../cmps/SearchForm.jsx';
export const MainPage = () => {
  const { ready, loggedInUser, guestUser } = useSelector(
    (state) => state.userModule
  );

  if (!ready && (!loggedInUser || !guestUser)) {
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  }
  return (
    <section className="main-page">
      <h1 className="main-header">Free Chat</h1>
      <SearchForm />
    </section>
  );
};
