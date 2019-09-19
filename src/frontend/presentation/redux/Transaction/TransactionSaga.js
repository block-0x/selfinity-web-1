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
import { TransactionUseCase, AppUseCase } from '@usecase';
import * as transactionActions from './TransactionReducer';

const appUseCase = new AppUseCase();
const transactionUseCase = new TransactionUseCase();

export const transactionWatches = [
    // takeEvery(LOCATION_CHANGE, labelUseCase.initCustomizeIndex),
    takeLatest(transactionActions.UPVOTE, transactionUseCase.upvote),
    takeLatest(transactionActions.DOWNVOTE, transactionUseCase.downvote),
    takeLatest(
        transactionActions.DELETE_UPVOTE,
        transactionUseCase.deleteUpvote
    ),
    takeLatest(
        transactionActions.DELETE_DOWNVOTE,
        transactionUseCase.deleteDownvote
    ),
    takeLatest(
        transactionActions.REQUEST_UPVOTE,
        transactionUseCase.requestUpvote
    ),
    takeLatest(
        transactionActions.REQUEST_DOWNVOTE,
        transactionUseCase.requestDownvote
    ),
    takeLatest(
        transactionActions.DELETE_REQUEST_UPVOTE,
        transactionUseCase.deleteRequestUpvote
    ),
    takeLatest(
        transactionActions.DELETE_REQUEST_DOWNVOTE,
        transactionUseCase.deleteRequestDownvote
    ),
    takeLatest(transactionActions.FOLLOW, transactionUseCase.follow),
    takeLatest(transactionActions.UNFOLLOW, transactionUseCase.unfollow),
    takeLatest(
        transactionActions.CREATE_REQUEST,
        transactionUseCase.createRequest
    ),
    takeLatest(
        transactionActions.UPDATE_REQUEST,
        transactionUseCase.updateRequest
    ),
    takeLatest(
        transactionActions.DELETE_REQUEST,
        transactionUseCase.deleteRequest
    ),
    takeLatest(
        transactionActions.REQUEST_ACCEPT,
        transactionUseCase.acceptRequest
    ),
    takeLatest(transactionActions.REQUEST_DENY, transactionUseCase.denyRequest),
    takeLatest(
        transactionActions.REQUESTS_ACCEPT,
        transactionUseCase.acceptRequests
    ),
    takeLatest(
        transactionActions.REQUESTS_DENY,
        transactionUseCase.denyRequests
    ),
    takeLatest(
        transactionActions.OPINION_ACCEPT,
        transactionUseCase.acceptOpinion
    ),
    takeLatest(
        transactionActions.OPINION_UNACCEPT,
        transactionUseCase.unacceptOpinion
    ),
];
