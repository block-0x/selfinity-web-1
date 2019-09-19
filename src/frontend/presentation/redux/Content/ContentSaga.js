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
import {
    ContentUseCase,
    AppUseCase,
    RecommendUseCase,
    RequestUseCase,
} from '@usecase';
import * as contentActions from './ContentReducer';

const contentUseCase = new ContentUseCase();
const appUseCase = new AppUseCase();
const recommendUseCase = new RecommendUseCase();
const requestUseCase = new RequestUseCase();

export const contentWatches = [
    takeEvery(LOCATION_CHANGE, contentUseCase.initIndex),
    takeEvery(LOCATION_CHANGE, contentUseCase.initHomeHottest),
    takeEvery(LOCATION_CHANGE, recommendUseCase.initRecommend),
    takeEvery(LOCATION_CHANGE, contentUseCase.initShow),
    takeEvery(LOCATION_CHANGE, contentUseCase.initFeed),
    takeEvery(LOCATION_CHANGE, contentUseCase.initNewest),
    takeEvery(LOCATION_CHANGE, contentUseCase.initPickup),
    takeEvery(LOCATION_CHANGE, contentUseCase.initPickupOpinion),
    takeEvery(contentActions.GET_MORE_HOME, contentUseCase.getMoreHome),
    takeEvery(contentActions.GET_MORE_COMMENT, contentUseCase.getMoreComment),
    takeEvery(contentActions.GET_MORE_FEED, contentUseCase.getMoreFeed),
    takeEvery(contentActions.GET_MORE_NEWEST, contentUseCase.getMoreNewest),
    takeLatest(contentActions.UPLOAD_IMAGE, contentUseCase.uploadImage),
    takeLatest(contentActions.CREATE_CONTENT, contentUseCase.createContent),
    takeLatest(contentActions.UPDATE_CONTENT, contentUseCase.updateContent),
    takeLatest(contentActions.DELETE_CONTENT, contentUseCase.deleteContent),
    takeLatest(contentActions.SYNC_CONTENT, contentUseCase.syncContent),
    takeLatest(contentActions.SET_HOME, appUseCase.setHomeSideBarMenu),
    takeLatest(
        contentActions.SET_RECOMMEND,
        appUseCase.setRecommendSideBarMenu
    ),
    takeLatest(contentActions.SET_SHOW, contentUseCase.createViewHistory),
    takeLatest(contentActions.SET_SHOW, requestUseCase.handleRequestAlert),
];
