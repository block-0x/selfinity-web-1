import { fromJS, Set, List } from 'immutable';
import {
    call,
    put,
    select,
    fork,
    takeLatest,
    takeEvery,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { translate } from '@infrastructure/Translator';
import DMCAUserList from '@constants/DMCAUserList';
import * as userActions from './UserReducer';
import AuthUseCase from '@usecase/AuthUseCase';
import AppUseCase from '@usecase/AppUseCase';
import UserUseCase from '@usecase/UserUseCase';

const authUseCase = new AuthUseCase();
const appUseCase = new AppUseCase();
const userUseCase = new UserUseCase();

export const userWatches = [
    takeEvery(LOCATION_CHANGE, userUseCase.initIndex),
    takeEvery(LOCATION_CHANGE, userUseCase.initShow),
    takeEvery(LOCATION_CHANGE, userUseCase.initContents),
    takeEvery(LOCATION_CHANGE, userUseCase.initComments),
    takeEvery(LOCATION_CHANGE, userUseCase.initRequests),
    takeEvery(LOCATION_CHANGE, userUseCase.initSendRequests),
    takeEvery(LOCATION_CHANGE, userUseCase.initAcceptedRequests),
    takeEvery(LOCATION_CHANGE, userUseCase.initUnAcceptedRequests),
    takeEvery(LOCATION_CHANGE, userUseCase.initHistories),
    takeEvery(LOCATION_CHANGE, userUseCase.initWanteds),
    takeEvery(userActions.GET_MORE_USER_CONTENT, userUseCase.getMoreContents),
    takeEvery(userActions.GET_MORE_USER_COMMENT, userUseCase.getMoreComments),
    takeEvery(userActions.GET_MORE_USER_REQUEST, userUseCase.getMoreRequests),
    takeEvery(userActions.GET_MORE_USER_HISTORY, userUseCase.getMoreHistories),
    takeEvery(userActions.GET_MORE_USER_HISTORY, userUseCase.getMoreWanteds),
    takeEvery(
        userActions.GET_MORE_USER_SEND_REQUEST,
        userUseCase.getMoreSendRequests
    ),
    takeEvery(
        userActions.GET_MORE_USER_ACCEPTED_REQUEST,
        userUseCase.getMoreAcceptedRequests
    ),
    takeLatest(userActions.INVITE, userUseCase.invite),
    takeEvery(
        userActions.GET_MORE_USER_UNACCEPTED_REQUEST,
        userUseCase.getMoreUnAcceptedRequests
    ),
    takeLatest(userActions.UPDATE_USER, userUseCase.updateUser),
    takeLatest(userActions.DELETE_USER, userUseCase.deleteUser),
    takeLatest(userActions.SYNC_USER, userUseCase.syncUser),
    takeEvery(userActions.GET_MORE_HOME, userUseCase.getMoreHome),
    takeLatest(userActions.SET_HOME, appUseCase.setUsersRecommendSideBarMenu),

    // takeLatest(userActions.SET_SHOW, userUseCase.setUserSideBarMenu),
    /*takeLatest(
        'auth/lookupPreviousOwnerAuthority',
        authUseCase.lookupPreviousOwnerAuthority
    ),*/
    // takeLatest(authActions.INIT_AUTH, authUseCase.initAuth),
    // takeLatest(authActions.LOGIN, authUseCase.login),
    // takeLatest(authActions.SET_CURRENT_USER, authUseCase.setCurrentUser),
    // takeLatest(authActions.LOGOUT, authUseCase.logout),
    //takeLatest(authActions.LOGIN_ERROR, AuthUseCase.loginError),
];
