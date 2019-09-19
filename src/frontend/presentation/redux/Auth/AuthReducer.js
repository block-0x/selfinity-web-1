import { fromJS, Map } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import { browserHistory } from 'react-router';
import {
    loginRoute,
    confirmForPrivateKeyRoute,
    confirmForDeleteRoute,
} from '@infrastructure/RouteInitialize';
import safe2json from '@extension/safe2json';

// Action constants
export const INIT_AUTH = 'auth/INIT_AUTH';
export const SHOW_LOGIN = 'auth/SHOW_LOGIN';
export const HIDE_LOGIN = 'auth/HIDE_LOGIN';
export const SHOW_PHONE_CONFIRM = 'auth/SHOW_PHONE_CONFIRM';
export const HIDE_PHONE_CONFIRM = 'auth/HIDE_PHONE_CONFIRM';
export const SHOW_CONFIRM_LOGIN_FOR_PRIVATEKEY =
    'auth/SHOW_CONFIRM_LOGIN_FOR_PRIVATEKEY';
export const HIDE_CONFIRM_LOGIN_FOR_PRIVATEKEY =
    'auth/HIDE_CONFIRM_LOGIN_FOR_PRIVATEKEY';
export const SHOW_CONFIRM_LOGIN_FOR_DELETE =
    'auth/SHOW_CONFIRM_LOGIN_FOR_DELETE';
export const HIDE_CONFIRM_LOGIN_FOR_DELETE =
    'auth/HIDE_CONFIRM_LOGIN_FOR_DELETE';
export const SAVE_LOGIN_CONFIRM = 'auth/SAVE_LOGIN_CONFIRM';
export const LOGIN = 'auth/LOGIN';
export const CONFIRM_LOGIN_FOR_PRIVATE_KEY =
    'auth/CONFIRM_LOGIN_FOR_PRIVATE_KEY';
export const CONFIRM_LOGIN_FOR_DELETE = 'auth/CONFIRM_LOGIN_FOR_DELETE';
export const CLOSE_LOGIN = 'auth/CLOSE_LOGIN';
export const LOGIN_ERROR = 'auth/LOGIN_ERROR';
export const LOGOUT = 'auth/LOGOUT';
export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';
export const SYNC_CURRENT_USER = 'auth/SYNC_CURRENT_USER';
export const SYNC_CURRENT_USER_END = 'auth/SYNC_CURRENT_USER_END';
export const SYNC_CURRENT_USER_FORCE = 'auth/SYNC_CURRENT_USER_FORCE';

const defaultState = fromJS({
    current_user: null,
    show_login_modal: false,
    show_phone_confirm_modal: false,
    maybeLoggedIn: false,
    synced: false,
    show_confirm_login_for_private_key_modal: false,
    show_confirm_login_for_delete_modal: false,
});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;

    switch (action.type) {
        case '@@router/LOCATION_CHANGE':
            return state.merge({
                show_confirm_login_for_private_key_modal: confirmForPrivateKeyRoute.isValidPath(
                    action.payload.pathname
                ),
                show_confirm_login_for_delete_modal: confirmForDeleteRoute.isValidPath(
                    action.payload.pathname
                ),
            });
        case INIT_AUTH:
            return state;

        case SHOW_LOGIN: {
            return state.merge({
                show_login_modal: true,
            });
        }

        case HIDE_LOGIN:
            return state.merge({
                show_login_modal: false,
            });

        case SHOW_PHONE_CONFIRM: {
            return state.merge({
                show_phone_confirm_modal: true,
            });
        }

        case HIDE_PHONE_CONFIRM:
            return state.merge({
                show_phone_confirm_modal: false,
            });

        case SHOW_CONFIRM_LOGIN_FOR_PRIVATEKEY: {
            return state.merge({
                show_confirm_login_for_private_key_modal: true,
            });
        }

        case HIDE_CONFIRM_LOGIN_FOR_PRIVATEKEY: {
            return state.merge({
                show_confirm_login_for_private_key_modal: false,
            });
        }

        case SHOW_CONFIRM_LOGIN_FOR_DELETE: {
            return state.merge({
                show_confirm_login_for_delete_modal: true,
            });
        }

        case HIDE_CONFIRM_LOGIN_FOR_DELETE: {
            return state.merge({
                show_confirm_login_for_delete_modal: false,
            });
        }

        case SAVE_LOGIN_CONFIRM:
            return state.set('saveLoginConfirm', payload);

        case LOGIN:
            return state;

        case CLOSE_LOGIN:
            return state.merge({
                login_error: undefined,
                show_login_modal: false,
                loginBroadcastOperation: undefined,
                loginDefault: undefined,
            });

        case LOGIN_ERROR:
            return state.merge({
                login_error: payload.error,
                logged_out: undefined,
            });

        case LOGOUT:
            return defaultState.merge({
                logged_out: true,
                current_user: null,
            });

        case SET_CURRENT_USER:
            if (!payload.user) return state;
            const user = payload.user;
            return state.merge({
                current_user: Map(safe2json(user)),
            });

        case SYNC_CURRENT_USER_END:
            return state.merge({
                synced: true,
            });

        default:
            return state;
    }
}

export const initAuth = payload => ({
    type: INIT_AUTH,
    payload,
});

export const showLogin = payload => ({
    type: SHOW_LOGIN,
    payload,
});

export const hideLogin = payload => ({
    type: HIDE_LOGIN,
    payload,
});

export const showPhoneConfirm = payload => ({
    type: SHOW_PHONE_CONFIRM,
    payload,
});

export const hidePhoneConfirm = payload => ({
    type: HIDE_PHONE_CONFIRM,
    payload,
});

export const showConfirmLoginForPrivateKeyModal = payload => ({
    type: SHOW_CONFIRM_LOGIN_FOR_PRIVATEKEY,
    payload,
});

export const hideConfirmLoginForPrivateKeyModal = payload => ({
    type: HIDE_CONFIRM_LOGIN_FOR_PRIVATEKEY,
    payload,
});

export const showConfirmLoginForDeleteModal = payload => ({
    type: SHOW_CONFIRM_LOGIN_FOR_DELETE,
    payload,
});

export const hideConfirmLoginForDeleteModal = payload => ({
    type: HIDE_CONFIRM_LOGIN_FOR_DELETE,
    payload,
});

export const saveLoginConfirm = payload => ({
    type: SAVE_LOGIN_CONFIRM,
    payload,
});

export const saveLogin = payload => ({
    type: SAVE_LOGIN,
    payload,
});

export const login = payload => ({
    type: LOGIN,
    payload,
});

export const confirmLoginForPrivateKey = payload => ({
    type: CONFIRM_LOGIN_FOR_PRIVATE_KEY,
    payload,
});

export const confirmLoginForDelete = payload => ({
    type: CONFIRM_LOGIN_FOR_DELETE,
    payload,
});

export const setCurrentUser = payload => ({
    type: SET_CURRENT_USER,
    payload,
});

export const syncCurrentUser = payload => ({
    type: SYNC_CURRENT_USER,
    payload,
});

export const syncCurrentUserForce = payload => ({
    type: SYNC_CURRENT_USER_FORCE,
    payload,
});

export const syncCurrentUserEnd = payload => ({
    type: SYNC_CURRENT_USER_END,
    payload,
});

export const closeLogin = payload => ({
    type: CLOSE_LOGIN,
    payload,
});

export const loginError = payload => ({
    type: LOGIN_ERROR,
    payload,
});

export const logout = payload => ({
    type: LOGOUT,
    payload,
});

export const getCurrentUser = state => {
    const val = state.auth.get('current_user');
    return !!val ? val.toJS() : null;
};
