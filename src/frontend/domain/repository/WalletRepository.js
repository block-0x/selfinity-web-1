import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';

export default class WalletRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async send(user, target_user, amount) {
        const data = await super.apiCall('/api/v1/wallet/send', {
            user: safe2json(user),
            target_user: safe2json(target_user),
            amount,
        });
        return data;
    }

    async transfer(user, amount) {
        const data = await super.apiCall('/api/v1/wallet/transfer', {
            user: safe2json(user),
            amount,
        });
        return data;
    }

    async claimReward(user) {
        const data = await super.apiCall('/api/v1/wallet/claim', {
            user: safe2json(user),
        });
        return data;
    }

    async bridgeToken(user, amount, toAddress) {
        const data = await super.apiCall('/api/v1/wallet/bridge', {
            user: safe2json(user),
            amount,
            toAddress,
        });
        return data;
    }

    async getPrivateKey(user) {
        const data = await super.apiCall('/api/v1/account/privatekey', {
            user: safe2json(user),
        });
        return data && data.privateKey;
    }
}
