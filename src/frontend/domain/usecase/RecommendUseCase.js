import ContentUseCase from '@usecase/ContentUseCase';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import { RecommendRepository } from '@repository';
import * as appActions from '@redux/App/AppReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as authActions from '@redux/Auth/AuthReducer';

const recommendRepository = new RecommendRepository();

export default class RecommendUseCase extends ContentUseCase {
    constructor() {
        super();
    }

    *initRecommend({ payload: { pathname } }) {
        const stateRecommend = yield select(state =>
            state.content.get('recommend_content')
        );
        const recommendContents = stateRecommend.toJS();
        if (recommendContents.length > 0) return;
        if (pathname == '/recommend') {
            yield put(appActions.fetchDataBegin());
            try {
                yield put(authActions.syncCurrentUser());
                const stateUser = yield select(state =>
                    state.auth.get('current_user')
                );
                if (!stateUser) return;
                const current_user = stateUser.toJS();
                yield put(appActions.fetchDataBegin());
                const data = yield recommendRepository.getRecommend({
                    user: current_user,
                });
                yield put(
                    contentActions.setRecommend({ contents: data.homeModels })
                );
            } catch (e) {
                yield put(appActions.addError({ error: e }));
            }
            yield put(appActions.fetchDataEnd());
        } else {
            return;
        }
    }
}
