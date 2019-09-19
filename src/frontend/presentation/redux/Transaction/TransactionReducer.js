import { fromJS, Map, List } from 'immutable';
import { DEFAULT_LANGUAGE } from '@infrastructure/client_config';
import { DetailModel, DetailModels } from '@entity';
import models from '@network/client_models';
import { Enum, defineEnum } from '@extension/Enum';
import { TransactionUseCase } from '@usecase';

const transactionUseCase = new TransactionUseCase();

// Action constants
export const UPVOTE = 'transaction/UPVOTE';
export const DOWNVOTE = 'transaction/DOWNVOTE';
export const DELETE_UPVOTE = 'transaction/DELETE_UPVOTE';
export const DELETE_DOWNVOTE = 'transaction/DELETE_DOWNVOTE';
export const REQUEST_UPVOTE = 'transaction/REQUEST_UPVOTE';
export const REQUEST_DOWNVOTE = 'transaction/REQUEST_DOWNVOTE';
export const DELETE_REQUEST_UPVOTE = 'transaction/DELETE_REQUEST_UPVOTE';
export const DELETE_REQUEST_DOWNVOTE = 'transaction/DELETE_REQUEST_DOWNVOTE';
export const FOLLOW = 'transaction/FOLLOW';
export const UNFOLLOW = 'transaction/UNFOLLOW';
export const CREATE_REQUEST = 'transaction/CREATE_REQUEST';
export const UPDATE_REQUEST = 'transaction/UPDATE_REQUEST';
export const DELETE_REQUEST = 'transaction/DELETE_REQUEST';
export const REQUEST_ACCEPT = 'transaction/REQUEST_ACCEPT';
export const REQUEST_DENY = 'transaction/REQUEST_DENY';
export const OPINION_ACCEPT = 'transaction/OPINION_ACCEPT';
export const OPINION_UNACCEPT = 'transaction/OPINION_UNACCEPT';
export const REQUESTS_ACCEPT = 'transaction/REQUESTS_ACCEPT';
export const REQUESTS_DENY = 'transaction/REQUESTS_DENY';

const defaultState = fromJS({});

export default function reducer(state = defaultState, action) {
    const payload = action.payload;
    switch (action.type) {
        case UPVOTE: {
            return state;
        }

        case DOWNVOTE: {
            return state;
        }

        case DELETE_UPVOTE: {
            return state;
        }

        case DELETE_DOWNVOTE: {
            return state;
        }

        case FOLLOW: {
            return state;
        }

        case UNFOLLOW: {
            return state;
        }

        default:
            return state;
    }
}

// Action creators

export const follow = payload => ({
    type: FOLLOW,
    payload,
});

export const unfollow = payload => ({
    type: UNFOLLOW,
    payload,
});

export const upvote = payload => ({
    type: UPVOTE,
    payload,
});

export const downvote = payload => ({
    type: DOWNVOTE,
    payload,
});

export const deleteUpvote = payload => ({
    type: DELETE_UPVOTE,
    payload,
});

export const deleteDownvote = payload => ({
    type: DELETE_DOWNVOTE,
    payload,
});

export const requestUpvote = payload => ({
    type: REQUEST_UPVOTE,
    payload,
});

export const requestDownvote = payload => ({
    type: REQUEST_DOWNVOTE,
    payload,
});

export const deleteRequestUpvote = payload => ({
    type: DELETE_REQUEST_UPVOTE,
    payload,
});

export const deleteRequestDownvote = payload => ({
    type: DELETE_REQUEST_DOWNVOTE,
    payload,
});

export const createRequest = payload => ({
    type: CREATE_REQUEST,
    payload,
});

export const updateRequest = payload => ({
    type: UPDATE_REQUEST,
    payload,
});

export const deleteRequest = payload => ({
    type: DELETE_REQUEST,
    payload,
});

export const acceptRequest = payload => ({
    type: REQUEST_ACCEPT,
    payload,
});

export const denyRequest = payload => ({
    type: REQUEST_DENY,
    payload,
});

export const acceptOpinion = payload => ({
    type: OPINION_ACCEPT,
    payload,
});

export const unacceptOpinion = payload => ({
    type: OPINION_UNACCEPT,
    payload,
});

export const acceptRequests = payload => ({
    type: REQUESTS_ACCEPT,
    payload,
});

export const denyRequests = payload => ({
    type: REQUESTS_DENY,
    payload,
});

export const isVote = (user, content) => {
    transactionUseCase
        .checkVoteCondition({
            payload: { user, content },
        })
        .then(results => {
            return {
                isUpVoted: results.isUpVoted,
                isDownVoted: results.isDownVoted,
            };
        })
        .catch(e => {
            return {
                isUpVoted: false,
                isDownVoted: false,
            };
        });
};
