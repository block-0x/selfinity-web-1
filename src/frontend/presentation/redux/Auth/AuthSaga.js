import { fromJS, Set, List } from 'immutable';
import {
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { loginRoute } from '@infrastructure/RouteInitialize';
import { translate } from '@infrastructure/Translator';
import DMCAUserList from '@constants/DMCAUserList';
import * as authActions from './AuthReducer';
import AuthUseCase from '@usecase/AuthUseCase';
import { LOCATION_CHANGE } from 'react-router-redux';

const authUseCase = new AuthUseCase();

export const authWatches = [
    /*takeLatest(
        'auth/lookupPreviousOwnerAuthority',
        authUseCase.lookupPreviousOwnerAuthority
    ),*/
    takeEvery(LOCATION_CHANGE, authUseCase.checkClientId),
    takeEvery(LOCATION_CHANGE, authUseCase.twitterConfirmLoginForPrivateKey),
    takeEvery(LOCATION_CHANGE, authUseCase.facebookConfirmLoginForPrivateKey),
    takeEvery(LOCATION_CHANGE, authUseCase.instagramConfirmLoginForPrivateKey),
    takeEvery(LOCATION_CHANGE, authUseCase.twitterConfirmLoginForDelete),
    takeEvery(LOCATION_CHANGE, authUseCase.facebookConfirmLoginForDelete),
    takeEvery(LOCATION_CHANGE, authUseCase.instagramConfirmLoginForDelete),
    takeEvery(LOCATION_CHANGE, authUseCase.twitterLogin),
    takeEvery(LOCATION_CHANGE, authUseCase.facebookLogin),
    takeEvery(LOCATION_CHANGE, authUseCase.instagramLogin),
    takeLatest(authActions.INIT_AUTH, authUseCase.initAuth),
    takeLatest(authActions.LOGIN, authUseCase.login),
    takeLatest(authActions.SHOW_LOGIN, authUseCase.showLogin),
    takeLatest(authActions.SET_CURRENT_USER, authUseCase.setCurrentUser),
    takeLatest(authActions.SYNC_CURRENT_USER, authUseCase.syncCurrentUser),
    takeLatest(
        authActions.SYNC_CURRENT_USER_FORCE,
        authUseCase.syncCurrentUserForce
    ),
    takeLatest(authActions.LOGOUT, authUseCase.logout),
    takeLatest(
        authActions.CONFIRM_LOGIN_FOR_PRIVATE_KEY,
        authUseCase.confirmLoginForPrivateKey
    ),
    takeLatest(
        authActions.CONFIRM_LOGIN_FOR_DELETE,
        authUseCase.confirmLoginForDelete
    ),
    takeLatest(authActions.SHOW_PHONE_CONFIRM, authUseCase.showPhoneConfirm),
];
