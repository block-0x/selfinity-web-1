import models from '@models';
import validator from 'validator';
import { UserDataStore, ContentDataStore, RequestDataStore } from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP, ACTION_TYPE } from '@entity';
import querystring from 'querystring';
import User from '@models/user';
import safe2json from '@extension/safe2json';
import { apiSyncUserValidates } from '@validations/user';
import WalletDataStore from '@datastore/WalletDataStore';
import data_config from '@constants/data_config';

const walletDataStore = new WalletDataStore();
const userDataStore = new UserDataStore();
const contentDataStore = new ContentDataStore();
const requestDataStore = new RequestDataStore();

export default class UserHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleGetUserContentsRequest(router, ctx, next) {
        const { user_id, limit, offset, isMyAccount } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });
        // if (!limit) throw new Error('cant get request limit');

        const contents = await contentDataStore
            .getUserContents({
                user_id,
                offset,
                limit,
                isMyAccount,
                isRequestWanted: false,
                isOpinionWanted: false,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents: contents,
        };
    }

    async handleGetUserHistoriesRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const contents = await contentDataStore
            .getUserHistoryContents({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents: contents,
        };
    }

    async handleGetUserWantedsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const contents = await contentDataStore
            .getUserWanteds({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents: contents,
        };
    }

    async handleGetUserCommentsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const contents = await contentDataStore
            .getUserComments({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents: contents,
        };
    }

    async handleGetUserRequestsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const requests = await requestDataStore
            .getUserRequests({
                user_id,
                offset,
                limit,
                isPrivate: false,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            requests: requests,
        };
    }

    async handleGetUserSendRequestsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const requests = await requestDataStore
            .getUserSendRequests({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            requests: requests,
        };
    }

    async handleGetUserUnSolvedRequestsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const requests = await requestDataStore
            .getUserUnSolvedRequests({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            requests: requests,
        };
    }

    async handleGetUserSolvedRequestsRequest(router, ctx, next) {
        const { user_id, limit, offset } = router.request.body;

        if (!user_id)
            throw new ApiError({
                error: new Error('User id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User id' },
            });

        const requests = await requestDataStore
            .getUserSolvedRequests({
                user_id,
                offset,
                limit,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            requests: requests,
        };
    }

    async handleSetUserInterest(router, ctx, next) {
        const { user, action, content } = router.request.body;

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
        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!action)
            throw new ApiError({
                error: new Error('Action is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Action' },
            });

        if (!contentDataStore.checkAction(action))
            throw new ApiError({
                error: new Error('action is not correct'),
                tt_key: 'errors.action_is_not_correct',
                tt_params: { action },
            });

        const labelings = await models.Labeling.findAll({
            where: {
                content_id: Number(content.id),
            },
        }).catch(e => {});

        await labelings.forEach(labeling => {
            models.Interest.create({
                label_id: labeling.LabelId,
                user_id: user.id,
                action: action,
                // score: user.score,
            });
        });

        return {
            success: true,
        };
    }

    async handleGetUserRequest(router, ctx, next) {
        const { id } = router.request.body;

        if (!id)
            throw new ApiError({
                error: new Error('Id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Id' },
            });

        const data = await userDataStore
            .findOneUser({
                id,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            user: data instanceof User ? data.toJSON(data) : data,
        };
    }

    async handleSyncUserRequest(router, ctx, next) {
        const { user } = router.request.body;

        await apiSyncUserValidates
            .isValid({
                user,
            })
            .catch(e => {
                router.body = {
                    success: true,
                    exist: false,
                };
                return;
            });

        let synced_user = await models.User.findOne({
            where: {
                id: Number(user.id),
                username: user.username,
            },
        }).catch(e => {
            router.body = {
                success: true,
                exist: false,
            };
            return;
        });

        if (!synced_user) {
            router.body = {
                success: true,
                exist: false,
            };
            return;
        }

        const balance = await walletDataStore.getTokenBalanceOf(
            synced_user.eth_address
        );

        synced_user = await synced_user
            .update({
                token_balance: balance.toFixed(data_config.min_decimal_range),
            })
            .catch(e => {
                router.body = {
                    success: true,
                    exist: false,
                };
                return;
            });

        router.body = {
            success: true,
            user: safe2json(synced_user),
            exist: !!safe2json(synced_user),
        };
    }

    async handleUpdateUserRequest(router, ctx, next) {
        const { user } = router.request.body;

        await apiSyncUserValidates
            .isValid({
                user,
            })
            .catch(e => {
                throw e;
            });

        const result = await userDataStore.updateUser({ user }).catch(e => {
            throw e;
        });

        router.body = {
            success: true,
        };
    }

    async handleDeleteUserRequest(router, ctx, next) {
        const { user } = router.request.body;

        await apiSyncUserValidates
            .isValid({
                user,
            })
            .catch(e => {
                throw e;
            });

        const result = await userDataStore.deleteUser({ user }).catch(e => {
            throw new Error(e);
        });

        router.body = {
            success: true,
        };
    }

    async handleInviteUserRequest(router, ctx, next) {
        const { user, invite_code } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const result = await userDataStore
            .invite({
                user,
                invite_code,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            invite: safe2json(result),
        };
    }

    async handleSyncNotificationIdRequest(router, ctx, next) {
        const { notification_id, user } = router.request.body;

        if (!notification_id || notification_id == '') return;

        await apiSyncUserValidates
            .isValid({
                user,
            })
            .catch(e => {
                router.body = {
                    success: true,
                    exist: false,
                };
                return;
            });

        let synced_user = await models.User.findOne({
            where: {
                id: Number(user.id),
                username: user.username,
            },
        }).catch(e => {
            router.body = {
                success: true,
                exist: false,
            };
            return;
        });

        if (!synced_user) {
            router.body = {
                success: true,
                exist: false,
            };
            return;
        }

        synced_user = await synced_user
            .update({
                notification_id,
            })
            .catch(e => {
                router.body = {
                    success: true,
                    exist: false,
                };
                return;
            });

        router.body = {
            success: true,
            user: safe2json(synced_user),
            exist: !!safe2json(synced_user),
        };
    }
}
