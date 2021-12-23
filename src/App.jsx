import './style/App.scss';
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//user actions
import {
  getLoggedinUser,
  persistLogin,
  setReady,
  getUsers,
} from './store/actions/userActions';

//pages
import { MainPage } from './pages/MainPage';
import { About } from './pages/About';
import { Rooms } from './pages/Rooms';
import { Room } from './pages/Room';
import { LandingPage } from './pages/LandingPage';
import { UserProfile } from './pages/UserProfile';
import { PrivateRoom } from './pages/PrivateRoom';

//cmps
import { AppFooter } from './cmps/AppFooter';
import { AppHeader } from './cmps/AppHeader';
import { UserMsg } from './cmps/UserMsg';

function App() {
  const dispatch = useDispatch();
  const { loggedInUser, ready, guestUser } = useSelector(
    (state) => state.userModule
  );

  useEffect(() => {
    dispatch(getUsers());
    const user = getLoggedinUser();
    if (user) {
      dispatch(persistLogin(user));
      dispatch(setReady(true));
    } else {
      dispatch(setReady(true));
    }
    //eslint-disable-next-line
  }, []);

  const PrivateRoute = ({ children }) => {
    return getLoggedinUser() ? children : <Navigate to="/:landingPage" />;
  };

  const NoneUsers = ({ children }) => {
    return !getLoggedinUser() ? children : <Navigate to="/" />;
  };

  const RegisteredUserRoute = (children) => {
    return loggedInUser ? children : <Navigate to="/:landingPage" />;
  };

  if (!ready)
    return (
      <div className="lds-ripple">
        <div></div>
        <div></div>
      </div>
    );
  else
    return (
      <Router>
        {(loggedInUser || guestUser) && <AppHeader />}
        <main className="App">
          <UserMsg />
          <div className="background-image"></div>
          <Routes>
            {/* <PrivateRoute path="/rooms/:id" element={<Room/>} /> */}
            <Route
              path="/rooms/:id"
              element={
                <PrivateRoute>
                  <Room />
                </PrivateRoute>
              }
            />
            <Route
              path="/myProfile/:id"
              element={
                <RegisteredUserRoute>
                  <UserProfile />
                </RegisteredUserRoute>
              }
            />
            <Route
              path="/rooms"
              element={
                <PrivateRoute>
                  <Rooms />
                </PrivateRoute>
              }
            />
            <Route
              path="/about"
              element={
                <PrivateRoute>
                  <About />
                </PrivateRoute>
              }
            />

            <Route
              path="/free-chat"
              element={
                <PrivateRoute>
                  <PrivateRoom />
                </PrivateRoute>
              }
            />
            <Route
              path="/:landingPage"
              element={
                <NoneUsers>
                  <LandingPage />
                </NoneUsers>
              }
            />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />

            {/* <Route path="*"/> */}
            {/* this is a not-found page */}
          </Routes>
        </main>
        {(loggedInUser || guestUser) && <AppFooter />}
      </Router>
    );
}

export default App;
