import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { login } from '../store/actions/userActions';

import closedEye from '../assets/imgs/closed-eye.png';
import openEye from '../assets/imgs/open-eye.png';

export const Login = ({ close, onSignupLink }) => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const { loggedInUser, wrongCreds } = useSelector((state) => state.userModule);

  const onSubmit = (data) => {
    const validation = /^[^<>%$]*$/;
    if (!validation.test(data.password) || !validation.test(data.userName)) {
      setError("Don't use the following charaters: ^,<,>,%,$");
      return;
    }
    const userName = data.userName.trim();
    const password = data.password.trim();

    navigate('/', { replace: true });
    dispatch(login({ userName, password }));
    // close();
  };
  useEffect(() => {
    if (loggedInUser !== null) {
      setError('');
      close();
    }
    //eslint-disable-next-line
  }, [loggedInUser]);

  const [error, setError] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (wrongCreds) {
      setError('Wrong Password or Email');
    }
  }, [wrongCreds]);

  const toggleShowPassword = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    setShow(!show);
  };
  return (
    <section className={params.landingPage ? '' : 'screen-cover'}>
      <div className='login-container'>
        {!params.landingPage && (
          <button onClick={close} className='close'>
            X
          </button>
        )}
        <h3>Login</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className={wrongCreds ? 'wrong' : ''}
            {...register('userName')}
            type='text'
            name='userName'
            placeholder='Enter your userName'
            required
          />
          <div className='passwords-container'>
            <input
              className={wrongCreds ? 'password-input wrong' : 'password-input'}
              {...register('password')}
              type={show ? 'text' : 'password'}
              name='password'
              required
              placeholder='Enter your password'
            />
            <button
              className='show-password-btn'
              onClick={(ev) => toggleShowPassword(ev)}
            >
              <img
                className='show-password'
                src={show ? openEye : closedEye}
                alt='closedEye'
              />
            </button>
          </div>
          <input className='log-btn' type='submit' value='Get chatting!' />
        </form>
        {/* <button>Google</button> */}
        {error && <span className='error-msg'>*{error}</span>}
        <p>
          not a member yet?{' '}
          <span className='link signup-link' onClick={onSignupLink}>
            signup!
          </span>
        </p>
      </div>
    </section>
  );
};
