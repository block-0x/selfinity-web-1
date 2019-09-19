import { fromJS, Map, List } from 'immutable';
import { DetailModel, DetailModels } from '@entity';
import models from '@network/client_models';
import { Enum, defineEnum } from '@extension/Enum';

// Action constants
export const SET_DETAIL = 'request/SET_DETAIL';
export const SHOW_ACCEPT_ALERT = 'request/SHOW_ACCEPT_ALERT';
export const HIDE_ACCEPT_ALERT = 'request/HIDE_ACCEPT_ALERT';
export const SET_CACHES = 'request/SET_CACHES';
export const RESET_CACHES = 'request/SET_CACHES';
export const SET_DELETES = 'request/SET_DELETES';
export const RESET_DELETES = 'request/SET_DELETES';
export const SYNC_REQUEST = 'request/SYNC_REQUEST';

const defaultState = fromJS({
    detail_content: Map({}),
    show_accept_alert: false,
    home_request: List([]),
    home_request_history: List([]),
    home_request_relate: List([]),
    show_customize_edit_modal: false,
    caches: List([]),
    deletes: List([]),
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;
    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.merge({
                caches: List([]),
                deletes: List([]),
            });

        case SET_CACHES: {
            const contents = action.payload.requests;
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
            const contents = action.payload.requests;
            if (!(contents instanceof Array)) return;
            if (contents.length == 0) return;
            let before = state.get('deletes') || List([]);
            before = before.filter(val => !contents.find(x => x.id == val.id));
            return state.set('deletes', List(contents.map(val => Map(val))));
        }

        case RESET_DELETES: {
            return state.set('deletes', List([]));
        }

        case SET_DETAIL: {
            if (!action.payload.detailModels) return state;
            return state.set(
                'detail_content',
                Map({
                    key: action.payload.detailModels.key,
                    content: action.payload.detailModels.content,
                    items: List(
                        action.payload.detailModels.items.map(item => {
                            return Map(item);
                        })
                    ),
                })
            );
        }
        case SHOW_ACCEPT_ALERT: {
            return state.merge({
                show_accept_alert: true,
            });
        }
        case HIDE_ACCEPT_ALERT: {
            return state.merge({
                show_accept_alert: false,
            });
        }

        default:
            return state;
    }
}

// Action creators

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

export const setDetail = payload => ({
    type: SET_DETAIL,
    payload,
});

export const syncRequest = payload => ({
    type: SYNC_REQUEST,
    payload,
});

export const showAcceptAlert = payload => ({
    type: SHOW_ACCEPT_ALERT,
    payload,
});

export const hideAcceptAlert = payload => ({
    type: HIDE_ACCEPT_ALERT,
    payload,
});

export const getDetail = state => {
    const val_map = state.request.get('detail_content');
    if (!val_map) return;
    const val = val_map.toJS();
    if (!Object.keys(val).length) return;
    return new DetailModels({
        key: val.key,
        content: val.content,
        items: val.items.map(item => {
            return new DetailModel(item);
        }),
    });
};

export const getSolvingRequests = state => {
    const val_map = state.content.get('show_content');
    if (!val_map) return;
    const val = val_map.toJS();
    const user_map = state.auth.get('current_user');
    if (!user_map) return;
    const current_user = user_map.toJS();
    if (!val.Requests || !val.Requests instanceof Array) return;
    if (val.Requests.length == 0) return;
    return val.Requests.filter(req => !!req).filter(
        req => req.VoterId == current_user.id && !req.isResolved
    );
};

export const isAllowReply = (state, request) => {
    const val = state.auth.get('current_user');
    if (!val) return false;
    const current_user = val_map.toJS();
    return;
    request.VoteredId == current_user.id &&
        !request.isResolved &&
        !request.isAnswered &&
        request.allowAnswer;
};

export const getCache = (id, state) => {
    if (!id) return;
    const val = state.request.get('caches');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const getDelete = (id, state) => {
    if (!id) return;
    const val = state.request.get('deletes');
    let contents = val.toJS();
    if (!(contents instanceof Array)) return;
    if (contents.length == 0) return;
    return contents.find(x => x.id == id);
};

export const bind = (request, state) => {
    if (!request) return;
    if (!request.id) return request;
    if (getDelete(request.id, state)) return null;
    return getCache(request.id, state) || request;
};
