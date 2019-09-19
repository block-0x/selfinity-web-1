import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { TransactionDataStore } from '@datastore';
import { ApiError } from '@extension/Error';
import {
    apiAcceptionOpinionValidates,
    apiDenyOpinionValidates,
} from '@validations/content';

const transactionDataStore = new TransactionDataStore();

export default class TransactionHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleUpvoteRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .upvote(user, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            upvote: result.toJSON(result),
        };
    }

    async handleDownvoteRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .downvote(user, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            downvote: result.toJSON(result),
        };
    }

    async handleDeleteUpvoteRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .delete_upvote(user, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            // upvote: result.toJSON(result),
        };
    }

    async handleDeleteDownvoteRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .delete_downvote(user, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            // downvote: result.toJSON(result),
        };
    }

    async handleRequestUpvoteRequest(router, ctx, next) {
        const { user, request } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .request_upvote(user, request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            upvote: result.toJSON(result),
        };
    }

    async handleRequestDownvoteRequest(router, ctx, next) {
        const { user, request } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .request_downvote(user, request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            downvote: result.toJSON(result),
        };
    }

    async handleDeleteRequestUpvoteRequest(router, ctx, next) {
        const { user, request } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .delete_request_upvote(user, request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            // upvote: result.toJSON(result),
        };
    }

    async handleDeleteRequestDownvoteRequest(router, ctx, next) {
        const { user, request } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .delete_request_downvote(user, request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            // downvote: result.toJSON(result),
        };
    }

    async handleFollowRequest(router, ctx, next) {
        const { user, target_user } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!target_user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const result = await transactionDataStore
            .follow(user, target_user)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleUnFollowRequest(router, ctx, next) {
        const { user, target_user } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!target_user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const result = await transactionDataStore
            .unfollow(user, target_user)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleAcceptContentForRequestingRequest(router, ctx, next) {
        const { user, request, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .acceptContentForRequest(user, request, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleDenyContentForRequestingRequest(router, ctx, next) {
        const { user, request, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .denyContentForRequest(user, request, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleAcceptContentForRequestingsRequest(router, ctx, next) {
        const { user, requests, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!requests)
            throw new ApiError({
                error: new Error('Requests is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Requests' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .acceptContentForRequests(user, requests, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleDenyContentForRequestingsRequest(router, ctx, next) {
        const { user, requests, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!requests)
            throw new ApiError({
                error: new Error('Requests is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Requests' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .denyContentForRequests(user, requests, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleRequestingRequest(router, ctx, next) {
        const { request } = router.request.body;

        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore.request(request).catch(e => {
            throw e;
        });

        router.body = {
            success: true,
        };
    }

    async handleUpdateRequestingRequest(router, ctx, next) {
        const { request } = router.request.body;

        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .update_request(request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleUnRequestingRequest(router, ctx, next) {
        const { request } = router.request.body;

        if (!request)
            throw new ApiError({
                error: new Error('Request is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Request' },
            });

        const result = await transactionDataStore
            .unrequest(request)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleCheckVoteCondtionRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await transactionDataStore
            .checkVoteCondtion(user, content)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            isUpVoted: result.isUpVoted,
            isDownVoted: result.isDownVoted,
        };
    }

    async handleAcceptionOpinionRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        await apiAcceptionOpinionValidates.isValid({ user, content });

        const result = await transactionDataStore.upvote(user, content, true);

        router.body = {
            success: true,
        };
    }

    async handleUnAcceptionOpinionRequest(router, ctx, next) {
        const { user, content } = router.request.body;

        await apiDenyOpinionValidates.isValid({ user, content });

        const result = await transactionDataStore.delete_upvote(
            user,
            content,
            true
        );

        router.body = {
            success: true,
        };
    }
}
