import React from 'react';
import { useState, useLayoutEffect, Fragment } from 'react';
import {
  Link,
  NavLink,
  useNavigate,
  // useParams,
  // useLocation,
  // useRouteMatch,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Signup } from './Signup';
import { Login } from './Login';
import { UserDropdown } from '../cmps/UserDropdown';

import { logout } from '../store/actions/userActions';
import { useDispatch } from 'react-redux';

//icons &imgs:
import logo from '../assets/logo/simple-logo.png';

export const AppHeader = () => {
  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }
  const { loggedInUser, guestUser } = useSelector((state) => state.userModule);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [openNav, setOpenNav] = useState(false);

  const [width, height] = useWindowSize();

  // function ShowWindowDimensions(props) {
  //   const [width, height] = useWindowSize();
  //   return <span>Window size: {width} x {height}</span>;
  // }

  const closeLogin = () => setShowLogin(false);
  const closeSignup = () => setShowSignup(false);

  const onLoginLink = () => {
    setShowLogin(true);
    setShowSignup(false);
  };
  const onSignupLink = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  // const params = useParams();
  // console.log(params);

  const onLogout = () => {
    dispatch(logout());
    navigate('/:landing-page');
  };
  return (
    <Fragment>
      <section className="app-header">
        <nav className="main-nav">
          <Link to="/">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          {width > 700 && <span> | </span>}
          {width < 600 && (
            <div
              id="nav-icon3"
              className={`${openNav ? 'open' : ''}`}
              onClick={() => setOpenNav(!openNav)}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
          <div className={`nav-btns ${openNav ? 'open' : 'close'}`}>
            <NavLink
              className="home-link"
              activeClassName="active-nav"
              exact
              to="/"
              onClick={() => setOpenNav(false)}
            >
              Home
            </NavLink>
            {width > 700 && <span> | </span>}
            <NavLink
              className="about-link"
              activeClassName="active-nav"
              exact
              to="/about"
              onClick={() => setOpenNav(false)}
            >
              About
            </NavLink>
            {width > 700 && <span> | </span>}
            <NavLink
              className="Rooms-link"
              activeClassName="active-nav"
              exact
              to="/rooms"
              onClick={() => setOpenNav(false)}
            >
              Rooms
            </NavLink>
            <div
              className={`user-links ${guestUser ? 'guest' : ''} ${
                openNav ? 'open' : ''
              }`}
            >
              {(loggedInUser || guestUser) && (
                <UserDropdown
                  user={loggedInUser ? loggedInUser : guestUser}
                  logout={onLogout}
                />
              )}
              <div className="reg-btns">
                {!loggedInUser && (
                  <span onClick={() => setShowLogin(true)}>Login</span>
                )}
                {!loggedInUser && width > 600 && '|'}
                {!loggedInUser && (
                  <span onClick={() => setShowSignup(true)}>Signup</span>
                )}
              </div>
            </div>
          </div>
          {showSignup && (
            <Signup close={closeSignup} onLoginLink={onLoginLink} />
          )}
          {showLogin && (
            <Login close={closeLogin} onSignupLink={onSignupLink} />
          )}
        </nav>
      </section>
      <div
        className={`${openNav ? 'screen-cover' : ''}`}
        onClick={() => setOpenNav(false)}
      ></div>
    </Fragment>
  );
};
