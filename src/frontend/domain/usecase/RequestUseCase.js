import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import {
    requestShowRoute,
    contentShowRoute,
} from '@infrastructure/RouteInitialize';
import RequestRepository from '@repository/RequestRepository';
import * as requestActions from '@redux/Request/RequestReducer';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as appActions from '@redux/App/AppReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import { browserHistory } from 'react-router';

const requestRepository = new RequestRepository();

export default class RequestUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *initDetail({ payload: { pathname } }) {
        if (!requestShowRoute.isValidPath(pathname)) return;
        try {
            const id = requestShowRoute.params_value('id', pathname);
            yield put(appActions.fetchDataBegin());
            const result = yield requestRepository
                .initDetail({
                    id,
                })
                .catch(e => {
                    throw new Error(e);
                });

            yield put(requestActions.setDetail({ detailModels: result }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.fetchDataEnd());
    }

    *syncRequest({ payload: { id } }) {
        const request = yield requestRepository
            .getRequest({
                id,
            })
            .catch(async e => {
                await put(appActions.addError({ error: e }));
            });

        yield put(
            !!request
                ? requestActions.setCaches({ requests: [request] })
                : requestActions.setDeletes({
                      requests: [models.Request.build({ id })],
                  })
        );
    }

    *handleRequestAlert({ payload: { content } }) {
        yield put(requestActions.hideAcceptAlert());
        if (
            !contentShowRoute.isValidPath(
                browserHistory.getCurrentLocation().pathname
            )
        )
            return;
        try {
            yield put(authActions.syncCurrentUser());
            const map_content = yield select(state =>
                state.content.get('show_content')
            );
            if (!map_content) return;
            const show_content = map_content.toJS();
            const map_user = yield select(state =>
                state.auth.get('current_user')
            );
            if (!map_user) return;
            const current_user = map_user.toJS();
            if (
                show_content.Requests.filter(
                    val =>
                        val.VoterId == current_user.id &&
                        (!val.isResolved || val.isResolved == 0)
                ).length > 0
            ) {
                yield put(requestActions.showAcceptAlert());
            }
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }
}
