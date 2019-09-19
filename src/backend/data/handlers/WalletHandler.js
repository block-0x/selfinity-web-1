import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { WalletDataStore } from '@datastore';
import { ApiError } from '@extension/Error';

const walletDataStore = new WalletDataStore();

export default class WalletHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleClaimRewardRequest(router, ctx, next) {
        const { user } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const result = await walletDataStore.claimReward({ user }).catch(e => {
            throw e;
        });

        router.body = {
            success: true,
        };
    }

    async handleBridgeTokenRequest(router, ctx, next) {
        const { user, amount, toAddress } = router.request.body;
        const result = await walletDataStore.bridgeToken({
            user,
            amount,
            toAddress,
        });

        router.body = {
            success: true,
        };
    }

    async handleSendTokenRequest(router, ctx, next) {
        const { user, target_user, amount } = router.request.body;

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
        if (!amount)
            throw new ApiError({
                error: new Error('Amount is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Amount' },
            });

        const result = await walletDataStore
            .sendToken(user.eth_address, target_user.eth_address, amount)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleTransferTokenRequest(router, ctx, next) {
        const { user, amount } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!amount)
            throw new ApiError({
                error: new Error('Amount is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Amount' },
            });

        const result = await walletDataStore
            .transferToken(user.eth_address, amount)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleShowPrivateKeyRequest(router, ctx, next) {
        const { user } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const privateKey = await walletDataStore
            .getPrivateKeyFromUser(user)
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            privateKey,
        };
    }
}
