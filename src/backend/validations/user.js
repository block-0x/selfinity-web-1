import { ClientError, ApiError } from '@extension/Error';
import { ValidationEntity, ValidationEntities } from '@entity/ValidationEntity';
import models from '@models';
import badDomains from '@constants/bad-domains';
import data_config from '@constants/data_config';
import validator from 'validator';
import { ACTION_TYPE } from '@entity';
import {
    apiUnwrapData,
    apiCheckEmailFormat,
    apiCheckEmailIsBadDomain,
} from '@validations';
import invite_config from '@constants/invite_config';

export const apiCheckUserIsValid = new ValidationEntity({
    validate: async arg => {
        const { user } = arg;
        if (!user.id || !user.username) return false;
        const base = await models.User.findOne({
            where: {
                id: user.id,
                username: user.username,
            },
        });
        return !!base && base.id == user.id && base.username == user.username;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('user is not correct format'),
            tt_key: 'errors.is_not_correct',
            tt_params: { data: 'user' },
        });
    },
});

export const apiCheckNickname = new ValidationEntity({
    validate: async arg => {
        const { nickname } = arg;
        if (!nickname) return false;
        return (
            `${nickname}`.length > data_config.nickname_min_limit &&
            `${nickname}`.length < data_config.nickname_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('nickname is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.nickname',
                min: data_config.nickname_min_limit,
                max: data_config.nickname_max_limit,
            },
        });
    },
});

export const apiCheckDetail = new ValidationEntity({
    validate: async arg => {
        const { detail } = arg;
        if (!detail) return false;
        return (
            `${detail}`.length > data_config.detail_min_limit &&
            `${detail}`.length < data_config.detail_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('detail is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.detail_user',
                min: data_config.detail_min_limit,
                max: data_config.detail_max_limit,
            },
        });
    },
});

export const apiCheckInviteCode = new ValidationEntity({
    validate: async arg => {
        const { invite_code, user } = arg;
        if (!invite_code || !user) return false;
        const current_user = await models.User.findOne({
            where: {
                id: user.id,
                username: user.username,
            },
        });

        if (!current_user) return false;

        const target_user = await models.User.findOne({
            where: {
                invite_code,
            },
        });

        if (!target_user) return false;

        const invites = await models.Invite.findAll({
            where: {
                invite_code,
            },
        });

        return invites.length <= invite_config.invite_max_limit;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('is_not_correct'),
            tt_key: 'errors.is_not_correct',
            tt_params: {
                data: 'g.invite_code',
            },
        });
    },
});

export const apiCheckInvitedLimit = new ValidationEntity({
    validate: async arg => {
        const { invite_code, user } = arg;
        if (!invite_code || !user) return false;
        const invites = await models.Invite.findAll({
            where: {
                invited_id: user.id,
            },
        });
        return invites.length < invite_config.invited_max_limit;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('invite_limit'),
            tt_key: 'errors.invite_limit',
            tt_params: {
                limit: invite_config.invited_max_limit,
            },
        });
    },
});

export const apiCheckOwnInviteCode = new ValidationEntity({
    validate: async arg => {
        const { invite_code, user } = arg;
        if (!invite_code || !user) return false;
        const u = await models.User.findOne({
            where: {
                invite_code,
            },
        });

        return !u;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('is_not_correct'),
            tt_key: 'errors.is_not_correct',
            tt_params: {
                data: 'g.invite_code',
            },
        });
    },
});

export const apiCheckInviteDate = new ValidationEntity({
    validate: async arg => {
        const { user } = arg;
        if (!user) return false;
        const current_user = await models.User.findOne({
            where: {
                id: user.id,
                username: user.username,
            },
        });
        return !new Date().isDayAgo(
            current_user.createdAt,
            invite_config.invite_date_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('invite_date'),
            tt_key: 'errors.invite_date',
            tt_params: {
                limit: invite_config.invite_date_max_limit,
            },
        });
    },
});

export const apiSyncUserValidates = new ValidationEntities({
    items: [apiUnwrapData('user'), apiCheckUserIsValid],
});

export const apiUpdateUserValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('nickname'),
        apiUnwrapData('detail'),
        apiCheckNickname,
        apiCheckUserIsValid,
        apiCheckDetail,
    ],
});

export const apiInviteUserValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('invite_code'),
        apiCheckUserIsValid,
        apiCheckInviteCode,
        apiCheckInvitedLimit,
        apiCheckOwnInviteCode,
        apiCheckInviteDate,
    ],
});
