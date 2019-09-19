import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import TransactionRepository from '@repository/TransactionRepository';
import * as transactionActions from '@redux/Transaction/TransactionReducer';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import * as contentActions from '@redux/Content/ContentReducer';
import * as userActions from '@redux/User/UserReducer';
import * as requestActions from '@redux/Request/RequestReducer';

const transactionRepository = new TransactionRepository();

export default class TransactionUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *upvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.upvote(user, content);
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *downvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.downvote(user, content);
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *deleteUpvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.deleteUpvote(
                user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *deleteDownvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.deleteDownvote(
                user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *requestUpvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.requestUpvote(
                user,
                content
            );
            yield put(requestActions.syncRequest({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *requestDownvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.requestDownvote(
                user,
                content
            );
            yield put(requestActions.syncRequest({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *deleteRequestUpvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.deleteRequestUpvote(
                user,
                content
            );
            yield put(requestActions.syncRequest({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *deleteRequestDownvote({ payload: { user, content } }) {
        if (!user || !content) return;
        try {
            const data = yield transactionRepository.deleteRequestDownvote(
                user,
                content
            );
            yield put(requestActions.syncRequest({ id: content.id }));
            yield put(userActions.syncUser({ id: user.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *follow({ payload: { user, target_user } }) {
        if (!user || !target_user) return;
        try {
            const data = yield transactionRepository.follow(user, target_user);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *unfollow({ payload: { user, target_user } }) {
        if (!user || !target_user) return;
        try {
            const data = yield transactionRepository.unfollow(
                user,
                target_user
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *createRequest({ payload: { request } }) {
        yield put(appActions.screenLoadingBegin());
        try {
            const data = yield transactionRepository.createRequest(request);
            yield put(contentActions.hideNew());
            yield put(contentActions.resetNew());
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *updateRequest({ payload: { request } }) {
        yield put(appActions.screenLoadingBegin());
        try {
            const data = yield transactionRepository.updateRequest(request);
            yield put(contentActions.hideNew());
            yield put(contentActions.resetNew());
            yield put(requestActions.syncRequest({ id: request.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *deleteRequest({ payload: { request } }) {
        try {
            const data = yield transactionRepository.deleteRequest(request);
            yield put(requestActions.syncRequest({ id: request.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *acceptRequest({ payload: { request, content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !request || !content) return;
            const data = yield transactionRepository.acceptRequest(
                request,
                current_user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(requestActions.syncRequest({ id: request.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *denyRequest({ payload: { request, content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !request || !content) return;
            const data = yield transactionRepository.denyRequest(
                request,
                current_user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
            yield put(requestActions.syncRequest({ id: request.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *acceptRequests({ payload: { requests, content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !requests || !content) return;
            const data = yield transactionRepository.acceptRequests(
                requests,
                current_user,
                content
            );
            yield Promise.all(
                requests.map(val =>
                    put(requestActions.syncRequest({ id: val.id }))
                )
            );
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *denyRequests({ payload: { requests, content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !requests || !content) return;
            const data = yield transactionRepository.denyRequests(
                requests,
                current_user,
                content
            );
            yield Promise.all(
                requests.map(val =>
                    put(requestActions.syncRequest({ id: val.id }))
                )
            );
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *acceptOpinion({ payload: { content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !content) return;
            const data = yield transactionRepository.acceptOpinion(
                current_user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *unacceptOpinion({ payload: { content } }) {
        try {
            yield put(authActions.syncCurrentUser());
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user || !content) return;
            const data = yield transactionRepository.unacceptOpinion(
                current_user,
                content
            );
            yield put(contentActions.syncContent({ id: content.id }));
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    async checkVoteCondition({ payload: { user, content } }) {
        try {
            if (!user || !content) return;
            const data = await transactionRepository.checkVoteCondition(
                user,
                content
            );
            return data;
        } catch (e) {
            await put(appActions.addError({ error: e }));
        }
    }
}
