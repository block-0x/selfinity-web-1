import UseCaseImpl from '@usecase/UseCaseImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import { WalletRepository } from '@repository';
import * as authActions from '@redux/Auth/AuthReducer';
import * as appActions from '@redux/App/AppReducer';
import * as walletActions from '@redux/Wallet/WalletReducer';

const walletRepository = new WalletRepository();

export default class WalletUseCase extends UseCaseImpl {
    constructor() {
        super();
    }

    *send({ payload: { user, target_user, amount } }) {
        if (!user || !target_user || !amount) return;
        try {
            yield walletRepository.send(user, target_user, amount);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *transfer({ payload: { user, amount } }) {
        if (!user || !amount) return;
        try {
            yield walletRepository.transfer(user, amount);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *claimReward({ payload: { user } }) {
        if (!user) return;
        try {
            yield put(appActions.screenLoadingBegin());
            yield walletRepository.claimReward(user);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *bridgeToken({ payload: { toAddress, amount } }) {
        const user = yield select(state => authActions.getCurrentUser(state));
        if (!user) return;
        try {
            yield put(appActions.screenLoadingBegin());

            yield walletRepository.bridgeToken(user, amount, toAddress);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }

    *syncReward({ payload }) {
        try {
            const current_user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            if (!current_user) return;
            yield walletRepository.claimReward(current_user);
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
    }

    *showPrivateKey({ payload }) {
        try {
            const user = yield select(state =>
                authActions.getCurrentUser(state)
            );
            yield put(appActions.screenLoadingBegin());
            const privateKey = yield walletRepository.getPrivateKey(user);
            yield put(
                walletActions.setPrivateKey({
                    privateKey,
                })
            );
        } catch (e) {
            yield put(appActions.addError({ error: e }));
        }
        yield put(appActions.screenLoadingEnd());
    }
}
