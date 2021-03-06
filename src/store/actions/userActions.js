import { eventBusService } from '../../services/eventBusService'
import { httpService } from '../../services/httpService'
import { makeId } from '../../services/utilService'

// const STORAGE_KEY_LOGGEDIN_USER = 'loggedInUser'
// var gWatchedUser = null;

// window.userService = userService

export const getUsers = () => {
    return async dispatch => {
        try {
            const users = await httpService.get(`user`)
            dispatch({ type: 'GET_USERS', users })
        } catch (err) {
            console.log('getUsers error:', err);
        }
    }
}

export const getUserById = (userId) => {
    return async dispatch => {
        try {
            const user = await httpService.get(`user/${userId}`)
            console.log('user in getUserById:', user);
            // gWatchedUser = user;
            dispatch({ type: 'GET_USER', user })
            _saveLocalUser(user)
        } catch (err) {
            console.log('getUserById error:', err);
        }
    }
}

// export const remove = (userId) => {
//     return storageService.remove('user', userId)
// }
export const changeUserRoomsType = (viewType) => {
    return dispatch => {
        dispatch({ type: 'CHANGE_VIEW_TYPE', viewType })
    }
}

export const update = (user) => {
    return async dispatch => {
        try {
            // console.log('user to update:', user);
            const updatedUser = await httpService.put(`user/${user._id}`, user)
            // console.log('updatedUser:', updatedUser);
            // Handle case in which admin updates other user's details
            if (getLoggedinUser()._id === updatedUser._id) _saveLocalUser(updatedUser)
            dispatch({ type: 'UPDATE_USER', user: updatedUser })
        } catch (err) {
            console.log('error in update:', err);
        }
    }
}

export const login = (userCred, isGuest = false) => {
    return async dispatch => {
        if (isGuest) {
            const _id = makeId(7)
            const user = {
                _id,
                userName: `guest`,
                fullName: `guest${_id}`,
                createdAt: Date.now(),
                imgUrl: '',
                likedRooms: [],
                birthday: Date.now(),
                sex: 'guest'
            }
            _saveLocalUser(user)
            dispatch({ type: 'LOGIN_GUEST', user })
            dispatch({ type: 'GET_USERS' })
            eventBusService.emit('userMsg', { msg: 'Welcome, guest!' });
        }
        else {
            try {
                //trying a get req
                const user = await httpService.post('auth/login', userCred)
                if (user) _saveLocalUser(user)
                dispatch({ type: 'LOGIN', user })
                dispatch({ type: 'GET_USERS' })
                eventBusService.emit('userMsg', { msg: `Welcome, ${user.userName}!` });

            } catch (err) {
                console.log('login error:', err);
                if (err.reponse && err.response.status === 401) {
                    eventBusService.emit('userMsg', (
                        {
                            msg: `Sorry, either the details you entered are wrong, or you need to signup!`,
                            time: 4000
                        }
                    )
                    )
                };
                dispatch({ type: 'LOGIN_ERROR', isWrong: true })
            }
        }
    }
}

export const signup = (userCred) => {
    const newUserCred = { ...userCred, imgUrl: '', likedRooms: [], cretedAt: Date.now() }
    return async dispatch => {
        try {
            const user = await httpService.post('auth/signup', newUserCred)
            _saveLocalUser(user)
            dispatch({ type: 'SIGNUP', user })
        } catch (err) {
            console.log('signup error:', err);
            dispatch({ type: 'LOGIN_ERROR', isWrong: true })
        }
    }
}

export const logout = () => {
    sessionStorage.clear()
    return dispatch => {
        dispatch({ type: 'LOGOUT' })
    }
}

const _saveLocalUser = (user) => {
    sessionStorage.setItem('loggedInUser', JSON.stringify(user))
    return user
}

export const getLoggedinUser = () => {
    return JSON.parse(sessionStorage.getItem('loggedInUser') || 'null')
}

export const persistLogin = (user) => {
    return async dispatch => {
        if (user.sex === 'guest') {
            dispatch({ type: 'LOGIN_GUEST', user })
            dispatch({ type: 'GET_USERS' })
        }
        else {
            console.log('loggin in as user in persistent login');
            try {
                const userId = await httpService.get('user', user._Id)
                if (userId) {
                    dispatch({ type: 'LOGIN', user })
                    dispatch({ type: 'GET_USERS' })
                }
            } catch (err) {
                console.log('persistLogin error:', err);
                console.log('user does not exist (persistLogin)');
            }
        }
    }
}
export const setReady = (isReady) => {
    return dispatch => {
        dispatch({ type: 'SET_READY', isReady })
    }
}
// This IIFE functions for Dev purposes
// It allows testing of real time updates (such as sockets) by listening to storage events
// (async () => {
//     // var user = getLoggedinUser()
//     // Dev Helper: Listens to when localStorage changes in OTHER browser

//     // Here we are listening to changes for the watched user (coming from other browsers)
//     window.addEventListener('storage', async () => {
//         if (!gWatchedUser) return;
//         const freshUsers = await storageService.query('user')
//         const watchedUser = freshUsers.find(u => u._id === gWatchedUser._id)
//         if (!watchedUser) return;
//         gWatchedUser = watchedUser
//     })
// })();

// This is relevant when backend is connected
// (async () => {
//     //TODO: How does this work?

//     const user = getLoggedinUser()
//     if (user) socketService.emit('set-user-socket', user._id)
// })();
