import React from 'react';
import { useSelector } from 'react-redux';
import { SearchForm } from '../cmps/SearchForm.jsx';
import logo from '../assets/logo/logo_transparent.png';
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
      <img className="main-header" src={logo} alt="" />
      <SearchForm />
    </section>
  );
};
