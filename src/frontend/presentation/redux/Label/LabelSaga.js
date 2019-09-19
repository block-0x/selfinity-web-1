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
import { LabelUseCase, AppUseCase } from '@usecase';
import * as labelActions from './LabelReducer';

const appUseCase = new AppUseCase();
const labelUseCase = new LabelUseCase();

export const labelWatches = [
    takeEvery(LOCATION_CHANGE, labelUseCase.initDetail),
    takeEvery(LOCATION_CHANGE, labelUseCase.initCustomizeIndex),
    takeLatest(labelActions.SET_DETAIL, appUseCase.setLabelDetailSideBarMenu),
    takeEvery(labelActions.GET_MORE_DETAIL, labelUseCase.getMoreDetail),
    takeLatest(labelActions.STOCK, labelUseCase.stock),
    takeLatest(labelActions.UNSTOCK, labelUseCase.unstock),
    takeEvery(LOCATION_CHANGE, labelUseCase.initTrend),
    takeEvery(LOCATION_CHANGE, labelUseCase.initTrendContent),
    takeEvery(
        labelActions.GET_MORE_TREND_CONTENT,
        labelUseCase.getMoreTrendContent
    ),
    takeEvery(labelActions.FETCH_TREND_CONTENT, labelUseCase.initTrendContent),
    takeEvery(labelActions.FETCH_SHOW_RELATE, labelUseCase.fetchRelateLabel),
];
