import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import { HomeModels, FeedModels } from '@entity';

export default class UserRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async initShow({ id }) {
        const data = await super.apiCall('/api/v1/user', {
            id,
        });
        return (
            data && {
                user: data.user,
                ...data,
            }
        );
    }

    async getIndex({ user, offset, limit }) {
        const data = await super.apiCall('/api/v1/users/recommend', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            user: safe2json(user),
        });
        return HomeModels.build(data.users, offset || 0);
    }

    async getStatic({ offset, limit, locale, country }) {
        const data = await super.apiCall('/api/v1/users/static', {
            limit: limit || data_config.fetch_data_limit('S'),
            offset: Number(offset || 0),
            locale,
            country,
        });
        return HomeModels.build(data.users, offset || 0);
    }

    async getUser({ id }) {
        const data = await super.apiCall('/api/v1/user', {
            id,
        });
        return data && data.user;
    }

    async updateUser(user) {
        const data = await super.apiCall('/api/v1/user/update', {
            user,
        });
        return data;
    }

    async deleteUser(user) {
        const data = await super.apiCall('/api/v1/user/delete', {
            user,
        });
        return data;
    }

    async getContents({ id, offset, limit, isMyAccount = false }) {
        const data = await super.apiCall('/api/v1/user/contents', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
            isMyAccount,
        });

        return (
            data && {
                contents: data.contents,
                ...data,
            }
        );
    }

    async getComments({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/comments', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            contents: data.contents,
            ...data,
        };
    }

    async getWanteds({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/wanteds', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            contents: data.contents,
            ...data,
        };
    }

    async invite(user, invite_code) {
        const data = await super.apiCall('/api/v1/user/invite', {
            user,
            invite_code,
        });

        return data;
    }

    async getRequests({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/requests', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            requests: data.requests,
            ...data,
        };
    }

    async getSendRequests({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/requests/sent', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            requests: data.requests,
            ...data,
        };
    }

    async getAcceptedRequests({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/requests/accepted', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            requests: data.requests,
            ...data,
        };
    }

    async getUnAcceptedRequests({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/requests/unaccepted', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            requests: data.requests,
            ...data,
        };
    }

    async getHistories({ id, offset, limit }) {
        const data = await super.apiCall('/api/v1/user/histories', {
            user_id: id,
            offset: Number(offset || 0),
            limit: limit || data_config.fetch_data_limit('L'),
        });

        return {
            contents: data.contents,
            ...data,
        };
    }

    async syncNotificationId({ notification_id, current_user }) {
        const data = await super.apiCall('/api/v1/user/notification_id/sync', {
            notification_id,
            user: safe2json(current_user),
        });
        return data && data.user;
    }
}
