import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import {
    HomeModel,
    HomeModels,
    ShowModel,
    RelateModel,
    ContentShowModel,
} from '@entity';

// Action constants
export const SET_SHOW = 'user/SET_SHOW';
export const UPDATE_USER = 'user/UPDATE_USER';
export const SYNC_USER = 'user/SYNC_USER';
export const DELETE_USER = 'user/DELETE_USER';
export const SET_USER_CONTENT = 'user/SET_USER_CONTENT';
export const SET_USER_COMMENT = 'user/SET_USER_COMMENT';
export const SET_USER_REQUEST = 'user/SET_USER_REQUEST';
export const SET_USER_SEND_REQUEST = 'user/SET_USER_SEND_REQUEST';
export const SET_USER_ACCEPTED_REQUEST = 'user/SET_USER_ACCEPTED_REQUEST';
export const SET_USER_UNACCEPTED_REQUEST = 'user/SET_USER_UNACCEPTED_REQUEST';
export const SET_USER_HISTORY = 'user/SET_USER_HISTORY';
export const SET_USER_WANTED = 'user/SET_USER_WANTED';
export const ADD_USER_CONTENT = 'user/ADD_USER_CONTENT';
export const ADD_USER_COMMENT = 'user/ADD_USER_COMMENT';
export const ADD_USER_REQUEST = 'user/ADD_USER_REQUEST';
export const ADD_USER_SEND_REQUEST = 'user/ADD_USER_SEND_REQUEST';
export const ADD_USER_ACCEPTED_REQUEST = 'user/ADD_USER_ACCEPTED_REQUEST';
export const ADD_USER_UNACCEPTED_REQUEST = 'user/ADD_USER_UNACCEPTED_REQUEST';
export const ADD_USER_HISTORY = 'user/ADD_USER_HISTORY';
export const ADD_USER_WANTED = 'user/ADD_USER_WANTED';
export const GET_MORE_USER_CONTENT = 'user/GET_MORE_USER_CONTENT';
export const GET_MORE_USER_COMMENT = 'user/GET_MORE_USER_COMMENT';
export const GET_MORE_USER_REQUEST = 'user/GET_MORE_USER_REQUEST';
export const GET_MORE_USER_SEND_REQUEST = 'user/GET_MORE_USER_SEND_REQUEST';
export const GET_MORE_USER_ACCEPTED_REQUEST =
    'user/GET_MORE_USER_ACCEPTED_REQUEST';
export const GET_MORE_USER_UNACCEPTED_REQUEST =
    'user/GET_MORE_USER_UNACCEPTED_REQUEST';
export const GET_MORE_USER_HISTORY = 'user/GET_MORE_USER_HISTORY';
export const GET_MORE_USER_WANTED = 'user/GET_MORE_USER_WANTED';
export const SET_CACHES = 'user/SET_CACHES';
export const RESET_CACHES = 'user/SET_CACHES';
export const SET_DELETES = 'user/SET_DELETES';
export const RESET_DELETES = 'user/SET_DELETES';
export const GET_MORE_HOME = 'user/GET_MORE_HOME';
export const GET_MORE_COMMENT = 'user/GET_MORE_COMMENT';
export const SET_HOME = 'user/SET_HOME';
export const ADD_HOME = 'user/ADD_HOME';
export const INVITE = 'user/INVITE';

const defaultState = fromJS({
    show_user: Map(),
    user_content: List(),
    user_comment: List(),
    user_request: List(),
    user_send_request: List(),
    user_accepted_request: List(),
    user_unaccepted_request: List(),
    user_wanted: List(),
    user_history: List(),
    caches: List([]),
    deletes: List([]),
    home_content: List(),
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;

    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.merge({
                caches: List([]),
                deletes: List([]),
            });

        case SET_SHOW: {
            return state.set('show_user', Map(action.payload.user));
        }

        case SET_CACHES: {
            const contents = action.payload.users;
            if (!(contents instanceof Array)) return;
            if (contents.length == 0) return;
            let before = state.get('caches') || List([]);
            before = before.filter(val => !contents.find(x => x.id == val.id));
            return state.set('caches', List(contents.map(val => Map(val))));
        }

        case RESET_CACHES: {
            return state.set('caches', List([]));
        }

        case SET_DELETES: {
            const contents = action.payload.users;
            if (!(contents instanceof Array)) return;
            if (contents.length == 0) return;
            let before = state.get('deletes') || List([]);
            before = before.filter(val => !contents.find(x => x.id == val.id));
            return state.set('deletes', List(contents.map(val => Map(val))));
        }

        case RESET_DELETES: {
            return state.set('deletes', List([]));
        }

        case SET_USER_CONTENT: {
            if (!payload.contents) return state;
            return state.set(
                'user_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_COMMENT: {
            if (!payload.contents) return state;
            return state.set(
                'user_comment',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_REQUEST: {
            if (!payload.requests) return state;
            return state.set(
                'user_request',
                List(
                    action.payload.requests.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_SEND_REQUEST: {
            if (!payload.requests) return state;
            return state.set(
                'user_send_request',
                List(
                    action.payload.requests.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_ACCEPTED_REQUEST: {
            if (!payload.requests) return state;
            return state.set(
                'user_accepted_request',
                List(
                    action.payload.requests.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_UNACCEPTED_REQUEST: {
            if (!payload.requests) return state;
            return state.set(
                'user_unaccepted_request',
                List(
                    action.payload.requests.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_HISTORY: {
            if (!payload.contents) return state;
            return state.set(
                'user_history',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case SET_USER_WANTED: {
            if (!payload.contents) return state;
            return state.set(
                'user_wanted',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case ADD_USER_CONTENT: {
            if (!payload.contents) return state;
            let before = state.get('user_content');
            return state.set(
                'user_content',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_COMMENT: {
            if (!payload.contents) return state;
            let before = state.get('user_comment');
            return state.set(
                'user_comment',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_REQUEST: {
            if (!payload.requests) return state;
            let before = state.get('user_request');
            return state.set(
                'user_request',
                before.concat(
                    List(
                        action.payload.requests.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_SEND_REQUEST: {
            if (!payload.requests) return state;
            let before = state.get('user_send_request');
            return state.set(
                'user_send_request',
                before.concat(
                    List(
                        action.payload.requests.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_ACCEPTED_REQUEST: {
            if (!payload.requests) return state;
            let before = state.get('user_accepted_request');
            return state.set(
                'user_accepted_request',
                before.concat(
                    List(
                        action.payload.requests.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_UNACCEPTED_REQUEST: {
            if (!payload.requests) return state;
            let before = state.get('user_unaccepted_request');
            return state.set(
                'user_unaccepted_request',
                before.concat(
                    List(
                        action.payload.requests.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_HISTORY: {
            if (!payload.contents) return state;
            let before = state.get('user_history');
            return state.set(
                'user_history',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case ADD_USER_WANTED: {
            if (!payload.contents) return state;
            let before = state.get('user_wanted');
            return state.set(
                'user_wanted',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        case SET_HOME: {
            if (!action.payload.contents) return;
            if (action.payload.contents.length == 0) return;
            return state.set(
                'home_content',
                List(
                    action.payload.contents.map(val => {
                        return Map(val);
                    })
                )
            );
        }

        case ADD_HOME: {
            if (!action.payload.contents) return;
            if (action.payload.contents.length == 0) return;
            let before = state.get('home_content');
            return state.set(
                'home_content',
                before.concat(
                    List(
                        action.payload.contents.map(val => {
                            return Map(val);
                        })
                    )
                )
            );
        }

        default:
            return state;
    }
}

export const invite = payload => ({
    type: INVITE,
    payload,
});

export const setCaches = payload => ({
    type: SET_CACHES,
    payload,
});

export const resetCaches = payload => ({
    type: RESET_CACHES,
    payload,
});

export const setDeletes = payload => ({
    type: SET_DELETES,
    payload,
});

export const resetDeletes = payload => ({
    type: RESET_DELETES,
    payload,
});

export const syncUser = payload => ({
    type: SYNC_USER,
    payload,
});

export const updateUser = payload => ({
    type: UPDATE_USER,
    payload,
});

export const deleteUser = payload => ({
    type: DELETE_USER,
    payload,
});

export const setUserContent = payload => ({
    type: SET_USER_CONTENT,
    payload,
});

export const setUserComment = payload => ({
    type: SET_USER_COMMENT,
    payload,
});

export const setUserRequest = payload => ({
    type: SET_USER_REQUEST,
    payload,
});

export const setUserSendRequest = payload => ({
    type: SET_USER_SEND_REQUEST,
    payload,
});

export const setUserAcceptedRequest = payload => ({
    type: SET_USER_ACCEPTED_REQUEST,
    payload,
});

export const setUserUnAcceptedRequest = payload => ({
    type: SET_USER_UNACCEPTED_REQUEST,
    payload,
});

export const setUserHistory = payload => ({
    type: SET_USER_HISTORY,
    payload,
});

export const setUserWanted = payload => ({
    type: SET_USER_WANTED,
    payload,
});

export const addUserContent = payload => ({
    type: ADD_USER_CONTENT,
    payload,
});

export const addUserComment = payload => ({
    type: ADD_USER_COMMENT,
    payload,
});

export const addUserRequest = payload => ({
    type: ADD_USER_REQUEST,
    payload,
});

export const addUserSendRequest = payload => ({
    type: ADD_USER_SEND_REQUEST,
    payload,
});

export const addUserAcceptedRequest = payload => ({
    type: ADD_USER_ACCEPTED_REQUEST,
    payload,
});

export const addUserUnAcceptedRequest = payload => ({
    type: ADD_USER_UNACCEPTED_REQUEST,
    payload,
});

export const addUserHistory = payload => ({
    type: ADD_USER_HISTORY,
    payload,
});

export const addUserWanted = payload => ({
    type: ADD_USER_WANTED,
    payload,
});

export const getMoreUserContent = payload => ({
    type: GET_MORE_USER_CONTENT,
    payload,
});

export const getMoreUserComment = payload => ({
    type: GET_MORE_USER_COMMENT,
    payload,
});

export const getMoreUserRequest = payload => ({
    type: GET_MORE_USER_REQUEST,
    payload,
});

export const getMoreUserSendRequest = payload => ({
    type: GET_MORE_USER_SEND_REQUEST,
    payload,
});

export const getMoreUserAcceptedRequest = payload => ({
    type: GET_MORE_USER_ACCEPTED_REQUEST,
    payload,
});

export const getMoreUserUnAcceptedRequest = payload => ({
    type: GET_MORE_USER_UNACCEPTED_REQUEST,
    payload,
});

export const getMoreUserHistory = payload => ({
    type: GET_MORE_USER_HISTORY,
    payload,
});

export const getMoreUserWanted = payload => ({
    type: GET_MORE_USER_Wanted,
    payload,
});

export const setShow = payload => ({
    type: SET_SHOW,
    payload,
});

export const setHome = payload => ({
    type: SET_HOME,
    payload,
});

export const addHome = payload => ({
    type: ADD_HOME,
    payload,
});

export const getMoreHome = payload => ({
    type: GET_MORE_HOME,
    payload,
});

export const getDelete = (id, state) => {
    if (!id) return;
    const val = state.user.get('deletes');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const getCache = (id, state) => {
    if (!id) return;
    const val = state.user.get('caches');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const bind = (user, state) => {
    if (!user) return;
    if (!user.id) return user;
    if (getDelete(user.id, state)) return null;
    return getCache(user.id, state) || user;
};

export const getShowUser = state => {
    let val = state.user.get('show_user');
    const user = !!val ? val.toJS() : null;
    return bind(user, state);
};

export const isFollow = (state, user) => {
    let val = state.auth.get('current_user');
    if (!val) return false;
    val = val.toJS();
    if (!user) return false;
    if (!user.Followers) return false;
    if (!(user.Followers.length > 0)) return false;
    return user.Followers.filter(follower => follower.id == val.id).length > 0;
};

export const isMyAccount = (state, user) => {
    let val = state.auth.get('current_user');
    if (!val) return false;
    val = val.toJS();
    if (!user) return false;
    return !!user && !!val ? val.id == user.id : false;
};

export const getUserContent = state => {
    const val = state.user.get('user_content');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserContentLength = state => {
    const val = state.user.get('user_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    return home_models.length;
};

export const getUserWanted = state => {
    const val = state.user.get('user_wanted');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserComment = state => {
    const val = state.user.get('user_comment');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserHistory = state => {
    const val = state.user.get('user_history');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserRequest = state => {
    const val = state.user.get('user_request');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserSendRequest = state => {
    const val = state.user.get('user_send_request');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserAcceptedRequest = state => {
    const val = state.user.get('user_accepted_request');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getUserUnAcceptedRequest = state => {
    const val = state.user.get('user_unaccepted_request');
    if (!val) return [];
    const contents = val.toJS();
    return new HomeModel({
        contents: contents.filter(item => !!item),
    });
};

export const getHomeContent = state => {
    const val = state.user.get('home_content');
    const home_models = val.toJS();
    return home_models.map(home_model => {
        home_model.items = home_model.items.filter(item => !!item).map(item => {
            return new HomeModel(item);
        });
        return new HomeModels(home_model);
    });
};

export const getHomeContentLength = state => {
    const val = state.user.get('home_content');
    if (!val) return 0;
    let home_models = val.toJS();
    if (!home_models) return 0;
    return home_models.length;
};
