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
import { RequestUseCase, AppUseCase } from '@usecase';
import * as requestActions from './RequestReducer';

const appUseCase = new AppUseCase();
const requestUseCase = new RequestUseCase();

export const requestWatches = [
    takeEvery(LOCATION_CHANGE, requestUseCase.initDetail),
    takeLatest(requestActions.SYNC_REQUEST, requestUseCase.syncRequest),
    // takeLatest(requestActions.SET_DETAIL, appUseCase.setRequestDetailSideBarMenu),
];
