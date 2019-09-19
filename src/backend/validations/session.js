import { ClientError, ApiError } from '@extension/Error';
import { ValidationEntity, ValidationEntities } from '@entity/ValidationEntity';
import badDomains from '@constants/bad-domains';
import data_config from '@constants/data_config';
import validator from 'validator';
import { ACTION_TYPE } from '@entity';
import {
    apiUnwrapData,
    apiCheckEmailFormat,
    apiCheckEmailIsBadDomain,
    apiCheckPhoneNumberFormat,
    apiCheckHalfWidthAlphanumeric,
    apiCheckHalfWidthAlphanumericOrSimbol,
    apiCheckSpace,
} from '@validations';
import models from '@models';

export const apiCheckIdentityEmailUnique = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        if (!identity.email) return false;
        const result = await models.Identity.findOne({
            where: { email: identity.email },
            raw: true,
        });
        return !result;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('Email is already exists'),
            tt_key: 'errors.is_already_exists',
            tt_params: { data: arg.identity.email },
        });
    },
});

export const apiCheckIdentityFromSNS = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        if (!identity.username) return false;
        const result = await models.Identity.findOne({
            where: { username: identity.username },
            raw: true,
        });
        return (
            !result.twitter_id && !result.facebook_id && !result.instagram_id
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('not_change_password_with_oauth'),
            tt_key: 'errors.not_change_password_with_oauth',
        });
    },
});

export const apiCheckIdentityUsenameUnique = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        if (!identity.username) return false;
        const result = await models.Identity.findOne({
            where: { username: identity.username },
            raw: true,
        });
        return !result;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('User name is already exists'),
            tt_key: 'errors.is_already_exists',
            tt_params: { data: arg.identity.username },
        });
    },
});

export const apiCheckIdentityPhoneNumberUnique = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        if (!identity.phone_number || !identity.phone_code) return false;
        const result = await models.Identity.findOne({
            where: {
                phone_number: identity.phone_number,
                phone_code: identity.phone_code,
                username: {
                    $ne: identity.username,
                },
            },
            raw: true,
        });
        return !result;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('phone number is already exists'),
            tt_key: 'errors.is_already_exists',
            tt_params: { data: arg.identity.phone_number },
        });
    },
});

export const apiCheckPhoneNumberIsVerified = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        return identity.phone_number_is_verified;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('Phone number verified required'),
            tt_key: 'errors.is_required',
            tt_params: { data: 'g.register_phone' },
        });
    },
});

export const apiCheckPhoneNumberIsNotVerified = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        return !identity.phone_number_is_verified;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('phone verify is already done'),
            tt_key: 'errors.already_done',
            tt_params: { data: 'g.phone_verify' },
        });
    },
});

export const apiCheckEmailIsVerifiedFromUseName = new ValidationEntity({
    validate: async arg => {
        const { identity } = arg;
        const result = await models.Identity.findOne({
            where: { username: identity.username },
            raw: true,
        });
        return result.email_is_verified;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('Email verified required'),
            tt_key: 'errors.is_required',
            tt_params: { data: 'Email verify' },
        });
    },
});

export const apiCheckIdentityUserNameExists = new ValidationEntity({
    validate: async arg => {
        const { username } = arg;
        if (!username) return false;
        const result = await models.Identity.findOne({
            where: { username },
            raw: true,
        });
        return !!result;
    },
    error: arg => {
        throw new ApiError({
            error: new Error(
                `the user of having ${arg.username} is not exists`
            ),
            tt_key: 'errors.not_exists',
            tt_params: { content: arg.username },
        });
    },
});

export const apiCheckUsername = new ValidationEntity({
    validate: async arg => {
        const { username } = arg;
        if (!username) return false;
        return (
            `${username}`.length > data_config.username_min_limit &&
            `${username}`.length < data_config.username_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('username is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.username',
                min: data_config.username_min_limit,
                max: data_config.username_max_limit,
            },
        });
    },
});

export const apiCheckEmail = new ValidationEntity({
    validate: async arg => {
        const { email } = arg;
        if (!email) return false;
        return (
            `${email}`.length > data_config.email_min_limit &&
            `${email}`.length < data_config.email_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('email is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.username',
                min: data_config.email_min_limit,
                max: data_config.email_max_limit,
            },
        });
    },
});

export const apiSendConfirmEmailValidates = new ValidationEntities({
    items: [
        apiUnwrapData('email'),
        apiUnwrapData('username'),
        apiCheckHalfWidthAlphanumeric('username'),
        apiCheckSpace('username'),
        apiCheckEmail,
        apiCheckUsername,
        apiCheckIdentityEmailUnique,
        apiCheckIdentityUsenameUnique,
        apiCheckEmailFormat,
        apiCheckEmailIsBadDomain,
    ],
});

export const apiReSendConfirmEmailValidates = new ValidationEntities({
    items: [
        apiUnwrapData('email'),
        apiUnwrapData('username'),
        apiCheckHalfWidthAlphanumeric('username'),
        apiCheckSpace('username'),
        apiCheckEmail,
        apiCheckUsername,
        apiCheckEmailFormat,
        apiCheckEmailIsBadDomain,
        apiCheckIdentityUserNameExists,
    ],
});

export const apiResetPasswordEmailValidates = new ValidationEntities({
    items: [
        apiCheckIdentityFromSNS,
        apiUnwrapData('email'),
        apiUnwrapData('username'),
        // apiCheckHalfWidthAlphanumeric('username'),
        apiCheckSpace('username'),
        apiCheckEmail,
        apiCheckUsername,
        apiCheckEmailFormat,
        apiCheckEmailIsBadDomain,
        apiCheckIdentityUserNameExists,
    ],
});

export const apiSendConfirmCodeValidates = new ValidationEntities({
    items: [
        apiUnwrapData('phone_number'),
        apiUnwrapData('username'),
        apiUnwrapData('phone_code'),
        apiCheckPhoneNumberFormat,
        apiCheckIdentityPhoneNumberUnique,
        apiCheckEmailIsVerifiedFromUseName,
        apiCheckPhoneNumberIsNotVerified,
        apiCheckIdentityUserNameExists,
    ],
});

export const apiReSendConfirmCodeValidates = new ValidationEntities({
    items: [
        apiUnwrapData('phone_number'),
        apiUnwrapData('username'),
        apiUnwrapData('phone_code'),
        apiCheckPhoneNumberFormat,
        apiCheckEmailIsVerifiedFromUseName,
        apiCheckPhoneNumberIsNotVerified,
        apiCheckIdentityUserNameExists,
    ],
});
