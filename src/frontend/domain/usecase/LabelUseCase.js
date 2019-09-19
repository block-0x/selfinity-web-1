import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import {
    labelShowRoute,
    customizeRoute,
    trendRoute,
} from '@infrastructure/RouteInitialize';
import { LabelRepository } from '@repository';
import * as labelActions from '@redux/Label/LabelReducer';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { browserHistory } from 'react-router';
import data_config from '@constants/data_config';

const labelRepository = new LabelRepository();

export default class LabelUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *initDetail({ payload: { pathname } }) {
        if (!labelShowRoute.isValidPath(pathname)) return;
        try {
            yield put(appActions.fetchDataBegin());
            const id = labelShowRoute.params_value('id', pathname);
            const result = yield labelRepository.getDetail({
                id,
            });

            yield put(labelActions.setDetail({ detailModels: result }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreDetail({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (labelShowRoute.isValidPath(pathname)) {
            try {
                yield put(authActions.syncCurrentUser());

                const id = labelShowRoute.params_value('id', pathname);
                if (!id) return;

                const detailContentsLength = yield select(state =>
                    labelActions.getDetailLength(state)
                );

                const loading = yield select(state =>
                    state.app.get('more_loading')
                );
                if (loading || detailContentsLength == 0) return;
                yield put(appActions.fetchMoreDataBegin());
                const data = yield labelRepository.getDetail({
                    id,
                    offset: detailContentsLength,
                });
                yield put(labelActions.addDetail({ detailModels: result }));
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
        } else {
            return;
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *initCustomizeIndex({ payload: { pathname } }) {
        if (!customizeRoute.isValidPath(pathname)) return;
        try {
            yield put(authActions.syncCurrentUser());
            const stateIndex = yield select(state =>
                state.label.get('home_label')
            );
            if (!stateIndex) return;
            const indexContents = stateIndex.toJS();
            const stateUser = yield select(state =>
                state.auth.get('current_user')
            );
            if (!stateUser) return;
            const current_user = stateUser.toJS();
            yield put(appActions.fetchDataBegin());
            const data = yield labelRepository.getCustomizeIndex({
                user: current_user,
            });
            yield put(
                labelActions.setHomeLabel({ homeLabels: data.homeLabels })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *stock({ payload: { user, label } }) {
        if (!user || !label) return;
        try {
            const data = yield labelRepository.stock(user, label);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *unstock({ payload: { user, label } }) {
        if (!user || !label) return;
        try {
            const data = yield labelRepository.unstock(user, label);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *initTrend({ payload: { pathname } }) {
        if (!trendRoute.isValidPath(pathname)) return;
        try {
            yield put(appActions.fetchDataBegin());
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const stateIndex = yield select(state =>
                state.label.get('trend_label')
            );
            if (!stateIndex) return;
            const trends = stateIndex.toJS();
            if (trends.length > 0) return;
            const labels = !!current_user
                ? yield labelRepository.getTrend({
                      limit: data_config.trend_limit,
                      user: current_user,
                  })
                : yield labelRepository.getStaticTrend({
                      limit: data_config.trend_limit,
                      offset: 0,
                  });
            yield put(labelActions.setTrend({ labels }));
            yield put(labelActions.fetchTrendContent({ pathname }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *initTrendContent({ payload: { pathname } }) {
        if (!trendRoute.isValidPath(pathname)) return;
        try {
            yield put(appActions.fetchDataBegin());
            const id = trendRoute.params_value('id', pathname) || 1;
            const stateIndex = yield select(state =>
                state.label.get('trend_label')
            );
            if (!stateIndex) return;
            if (stateIndex.length == 0) return;
            const trends = stateIndex.toJS();
            if (!trends[Number(id) - 1]) return;
            yield put(labelActions.cleanTrendContent({ contents }));
            const contents = yield labelRepository.getTrendContent({
                label: trends[Number(id) - 1],
            });
            yield put(labelActions.setTrendContent({ contents }));
            yield put(
                labelActions.fetchShowRelate({ label: trends[Number(id) - 1] })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreTrendContent({ payload }) {
        const pathname = browserHistory.getCurrentLocation().pathname;
        if (!trendRoute.isValidPath(pathname)) return;
        try {
            const id = trendRoute.params_value('id', pathname) || 1;
            const stateIndex = yield select(state =>
                state.label.get('trend_label')
            );
            if (!stateIndex) return;
            if (stateIndex.length == 0) return;
            const trends = stateIndex.toJS();
            if (!trends[Number(id) - 1]) return;

            const stateContent = yield select(state =>
                state.label.get('trend_label')
            );
            if (!stateContent) return;
            const before = stateContent.toJS();
            if (before.length == 0) return;

            yield put(appActions.fetchMoreDataBegin());
            const loading = yield select(state =>
                state.app.get('more_loading')
            );
            if (loading || before.length == 0) return;
            const contents = yield labelRepository.getTrendContent({
                label: trends[Number(id) - 1],
                offset: before.length,
            });
            yield put(labelActions.addTrendContent({ contents }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchMoreDataEnd());
    }

    *fetchRelateLabel({ payload: { label } }) {
        if (!label) return;
        try {
            yield put(appActions.fetchDataBegin());
            const labels = yield labelRepository.getRelate({
                label,
            });
            yield put(labelActions.setShowRelate({ labels }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }
}
