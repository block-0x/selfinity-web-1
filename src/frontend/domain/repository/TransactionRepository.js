import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';

export default class TransactionRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async upvote(user, content) {
        const data = await super.apiCall('/api/v1/content/upvote', {
            content: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async downvote(user, content) {
        const data = await super.apiCall('/api/v1/content/downvote', {
            content: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async deleteUpvote(user, content) {
        const data = await super.apiCall('/api/v1/content/unupvote', {
            content: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async deleteDownvote(user, content) {
        const data = await super.apiCall('/api/v1/content/undownvote', {
            content: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async requestUpvote(user, content) {
        const data = await super.apiCall('/api/v1/request/upvote', {
            request: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async requestDownvote(user, content) {
        const data = await super.apiCall('/api/v1/request/downvote', {
            request: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async deleteRequestUpvote(user, content) {
        const data = await super.apiCall('/api/v1/request/unupvote', {
            request: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async deleteRequestDownvote(user, content) {
        const data = await super.apiCall('/api/v1/request/undownvote', {
            request: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async follow(user, target_user) {
        const data = await super.apiCall('/api/v1/follow', {
            target_user: safe2json(target_user),
            user: safe2json(user),
        });
        return data;
    }

    async unfollow(user, target_user) {
        const data = await super.apiCall('/api/v1/unfollow', {
            target_user: safe2json(target_user),
            user: safe2json(user),
        });
        return data;
    }

    async checkVoteCondition(user, content) {
        const data = await super.apiCall('/api/v1/is_vote', {
            content: safe2json(content),
            user: safe2json(user),
        });
        return data;
    }

    async createRequest(request) {
        const data = await super.apiCall('/api/v1/request/create', {
            request: safe2json(request),
        });

        return data;
    }

    async updateRequest(request) {
        const data = await super.apiCall('/api/v1/request/update', {
            request: safe2json(request),
        });

        return data;
    }

    async deleteRequest(request) {
        const data = await super.apiCall('/api/v1/request/delete', {
            request: safe2json(request),
        });

        return data;
    }

    async denyRequest(request, user, content) {
        const data = await super.apiCall('/api/v1/request/deny', {
            request: safe2json(request),
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }

    async acceptRequests(requests, user, content) {
        const data = await super.apiCall('/api/v1/requests/accept', {
            requests: requests.map(request => safe2json(request)),
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }

    async acceptRequest(request, user, content) {
        const data = await super.apiCall('/api/v1/request/accept', {
            request: safe2json(request),
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }

    async denyRequests(requests, user, content) {
        const data = await super.apiCall('/api/v1/requests/deny', {
            requests: requests.map(request => safe2json(request)),
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }

    async acceptOpinion(user, content) {
        const data = await super.apiCall('/api/v1/content/accept', {
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }

    async unacceptOpinion(user, content) {
        const data = await super.apiCall('/api/v1/content/unaccept', {
            user: safe2json(user),
            content: safe2json(content),
        });

        return data;
    }
}
