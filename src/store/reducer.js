import { isAuthenticated, logout, removeUserData } from '../services/auth';

const initialState = {
    auth: isAuthenticated(),
    user: null,
    profileOwner: null,
    userChanged: false,
    posts: [],
    likedPosts: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SIGNIN':
            return {
                user: action.user,
                auth: true
            }
        case 'LOGOUT':
            logout();
            removeUserData();
            return {
                ...state,
                user: null,
                auth: false
            }
        case 'SAVE_USER':
            return {
                ...state,
                user: action.user
            }
        case 'SAVE_PROFILE_OWNER':
            return {
                ...state,
                profileOwner: action.profile
            }
        case 'SUBSCRIBE':
            return {
                ...state,
                user: action.user
            }
        case 'UNSUBSCRIBE':
            return {
                ...state,
                user: action.user
            }
        case 'USER_CHANGED':
            return {
                ...state,
                userChanged: true
            }
        //Load posts
        case 'POSTS_LOAD':
            console.log('POSTS_LOAD');
            return {
                ...state,
                posts: state.posts.concat(action.posts)
            }
        case 'POSTS_INIT':
                console.log('POSTS_INIT');
                return {
                    ...state,
                    posts: action.posts
                }
        case 'CLEAR_POSTS':
            return {
                ...state,
                posts: []
            }
        case 'POST_INCREMENT_LIKE':
            console.log('POST_INCREMENT_LIKE');
            const sourceIncrementPost = {};
            sourceIncrementPost[action.index] = action.post;
            return {
                ...state,
                user: action.user,
                posts: Object.assign([...state.posts], sourceIncrementPost)
            }
        case 'POST_DECREMENT_LIKE':
            console.log('POST_DECREMENT_LIKE');
            const sourceDecrementPost = {};
            sourceDecrementPost[action.index] = action.post;
            return {
                ...state,
                user: action.user,
                posts: Object.assign([...state.posts], sourceDecrementPost)
            }
        case 'USER_EDIT_PROFILE':
            return {
                ...state,
                userChanged: action.userChanged,
                user: action.user
            }
        default:
            break;
    }
    return state;
}

export default reducer;