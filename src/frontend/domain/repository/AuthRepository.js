import RepositoryImpl from '@repository/RepositoryImpl';

import Cookies from 'js-cookie';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import models from '@network/client_models';
import * as detection from '@network/detection';
import safe2json from '@extension/safe2json';

export default class AuthRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async initAuth({ username, email }) {
        const data = await super.apiCall('/api/v1/initialize_auth', {
            identity: {
                email: email,
                username: username,
            },
        });

        return {
            identity: data.identity,
            user: data.user,
            account: data.account,
        };
    }

    async user_authenticate({ email, password, client_id }) {
        const data = await super.apiCall('/api/v1/authenticate', {
            email: email,
            password: password,
            client_id,
        });

        return data;
    }

    async syncUser(user) {
        const data = await super.apiCall('/api/v1/user/sync', {
            user: safe2json(user),
        });

        return data;
    }

    async twitter_authenticate(accessToken, client_id) {
        const data = await super.apiCall('/api/v1/identity', {
            accessToken,
            client_id,
        });
        return data && data.user;
    }

    async facebook_authenticate(accessToken, client_id) {
        const data = await super.apiCall('/api/v1/identity', {
            accessToken,
            client_id,
        });
        return data && data.user;
    }

    async instagram_authenticate(accessToken, client_id) {
        const data = await super.apiCall('/api/v1/identity', {
            accessToken,
            client_id,
        });
        return data && data.user;
    }
}
