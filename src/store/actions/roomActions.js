import { eventBusService } from '../../services/eventBusService.js';
import { httpService } from '../../services/httpService.js';
// import { socketService } from '../../services/socketService.js';
// import { getRandomIntInclusive } from '../../services/utilService.js';


export const query = (filterBy) => {
    return async dispatch => {
        const data = await httpService.get(`room`, { filterBy })
        dispatch({ type: 'GET_ROOMS', data })
    }

}
export const setCurrRoom = (room) => {
    return dispatch => {
        // socketService.emit('room updated', room)
        dispatch({ type: 'SET_CURR_ROOM', room })
    }
}
export const setCurrRoomById = (roomId) => {
    return async dispatch => {
        try {
            const room = roomId ? await httpService.get(`room/${roomId}`) : null
            // socketService.emit('room updated', room)
            dispatch({ type: 'SET_CURR_ROOM', room })
        } catch (err) {
            console.log('setCurrRoomById error:', err);
        }
    }
}
export const setCurrPrivateRoom = (room) => {
    return dispatch => {
        // socketService.emit('room updated', room)
        dispatch({ type: 'SET_CURR_PRIVATE_ROOM', room })
    }
}

export const getRoomById = (roomId) => {
    return async dispatch => {
        try {
            const room = await httpService.get(`room/${roomId}`)
            dispatch({ type: 'GET_ROOM', room })
        } catch (err) {
            console.log('getRoomById error:', err);
        }
    }
}

export const setFilterBy = (filterBy) => {
    return dispatch => {
        dispatch({ type: 'SET_FILTER', filterBy })
    }
}

export const setTags = (tags) => {
    return dispatch => {
        dispatch({ type: 'SET_TAGS', tags })
    }
}
// export const setNumOfUsers = (num) => {
//     return dispatch => {
//         dispatch({ type: 'SET_NUM_OF_USERS', num })
//     }
// }

export const remove = (roomId) => {
    return async dispatch => {
        try {
            await httpService.delete(`room/${roomId}`)
            eventBusService.emit('userMsg', { msg: `room with ID ${roomId} was removed!`, time: 3000 });
            dispatch({ type: 'REMOVE_ROOM', roomId })
        } catch (err) {
            console.log('Error on room service =>', err)
            throw err;
        }
    }

}
//add and update
export const save = (room) => {
    //both the try and the catch are working here for some reason
    if (!room._id) {
        //add
        console.log('add!');
        return async dispatch => {
            try {
                const newRoom = await httpService.post(`room/`, room)
                eventBusService.emit('userMsg', { msg: `The room ${newRoom.name} was added!` });
                dispatch({ type: 'ADD_ROOM', newRoom })
            } catch (err) {
                console.log('save (add) error:', err);
            }
        }
    }
    else {
        //update
        return async dispatch => {
            try {
                const updatedRoom = await httpService.put(`room/`, room)
                eventBusService.emit('userMsg', { msg: `The room ${updatedRoom.name} was updated!` });
                dispatch({ type: 'UPDATE_ROOM', updatedRoom })
            } catch (err) {
                console.log('save (update) error:', err);
            }
        }
    }
}


