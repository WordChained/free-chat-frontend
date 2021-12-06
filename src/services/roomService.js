import { getLoggedinUser } from '../store/actions/userActions.js';

export const getEmptyRoom = () => {
    const room = {
        // _id: '',
        name: '',
        imgUrl: '',
        description: '',
        tags: [],
        createdAt: Date.now(),
        likedByUsers: [],
        msgs: [],
        limit: '',
        owner: getLoggedinUser(),
        type: '',
        topic: ''

    }
    return room
}
export const getEmptyPrivateRoom = () => {
    const privateRoom = {
        topics: [],
        createdAt: Date.now(),
        msgs: [],
        limit: '2',
        type: 'private'
    }
    return privateRoom
}