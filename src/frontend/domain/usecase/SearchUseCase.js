import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import SearchRepository from '@repository/SearchRepository';
import { browserHistory } from 'react-router';
import * as searchActions from '@redux/Search/SearchReducer';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import querystring from 'querystring';

const searchRepository = new SearchRepository();

export default class SearchUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *searchContent({ payload: { keyword } }) {
        if (keyword === '' || !keyword) return;
        const search_state = yield select(state => state.search);

        const prevKeyword = search_state.get('keyword');

        let search_content = search_state.get('search_content');
        search_content = search_content.toJS();

        if (prevKeyword == keyword && search_content.length > 0) return;
        yield put(appActions.fetchDataBegin());
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const data = yield searchRepository
                .searchContent({
                    keyword,
                    user: current_user,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.setResult({ contents: data }));
            yield put(searchActions.setKeyword({ keyword }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreSearchContent({ payload }) {
        const search_state = yield select(state => state.search);
        const keyword = search_state.get('keyword');
        if (keyword === '' || !keyword) return;
        let search_content = search_state.get('search_content');
        search_content = search_content.toJS();
        yield put(appActions.fetchDataBegin());
        try {
            const data = yield searchRepository
                .searchContent({
                    keyword,
                    offset: search_content[0].items[0].contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.addResult({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *searchUser({ payload: { keyword } }) {
        if (keyword === '' || !keyword) return;
        const search_state = yield select(state => state.search);

        const prevKeyword = search_state.get('user_keyword');

        let search_user = search_state.get('search_user');
        search_user = search_user.toJS();

        if (prevKeyword == keyword && search_user.length > 0) return;
        yield put(appActions.fetchDataBegin());
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const data = yield searchRepository
                .searchUser({
                    keyword,
                    user: current_user,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.setUserResult({ contents: data }));
            yield put(searchActions.setUserKeyword({ keyword }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreSearchUser({ payload }) {
        const search_state = yield select(state => state.search);
        const keyword = search_state.get('user_keyword');
        if (keyword === '' || !keyword) return;
        let search_user = search_state.get('search_user');
        search_user = search_user.toJS();
        yield put(appActions.fetchDataBegin());
        try {
            const data = yield searchRepository
                .searchUser({
                    keyword,
                    offset: search_user[0].items[0].contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.addUserResult({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *searchLabel({ payload: { keyword } }) {
        if (keyword === '' || !keyword) return;
        const search_state = yield select(state => state.search);

        const prevKeyword = search_state.get('label_keyword');

        let search_user = search_state.get('search_label');
        search_user = search_user.toJS();

        if (prevKeyword == keyword && search_user.length > 0) return;
        yield put(appActions.fetchDataBegin());
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            const data = yield searchRepository
                .searchLabel({
                    keyword,
                    user: current_user,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.setLabelResult({ contents: data }));
            yield put(searchActions.setLabelKeyword({ keyword }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *getMoreSearchLabel({ payload }) {
        const search_state = yield select(state => state.search);
        const keyword = search_state.get('label_keyword');
        if (keyword === '' || !keyword) return;
        let search_user = search_state.get('search_label');
        search_user = search_user.toJS();
        yield put(appActions.fetchDataBegin());
        try {
            const data = yield searchRepository
                .searchLabel({
                    keyword,
                    offset: search_user[0].items[0].contents.length,
                })
                .catch(e => {
                    throw new Error(e);
                });
            if (!data) return;
            yield put(searchActions.addLabelResult({ contents: data }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }
}
