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
    apiCheckUserIsVerfied,
} from '@validations';
import { Decimal } from 'decimal.js';

export const apiCheckRequestBody = new ValidationEntity({
    validate: async arg => {
        const { request } = arg;
        if (!request.body) return false;
        return (
            ''.cleaning_tag(`${request.body}`).length >
            data_config.request_body_min_limit /*&&
            ''.cleaning_tag(`${request.body}`).length <
                data_config.request_body_max_limit*/
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('body is not correct format'),
            tt_key: 'errors.not_exists',
            tt_params: {
                content: 'g.body',
                // min: data_config.request_body_min_limit,
                // max: data_config.request_body_max_limit,
            },
        });
    },
});

export const apiCheckUserExists = new ValidationEntity({
    validate: async arg => {
        const { request } = arg;
        if (!request.VoteredId) return false;
        const user = await models.User.findOne({
            where: {
                id: request.VoteredId,
            },
        });
        return !!user;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('user is not exists'),
            tt_key: 'errors.not_exists',
            tt_params: { content: 'g.user' },
        });
    },
});

export const apiCheckPayoutedRequest = new ValidationEntity({
    validate: async arg => {
        const { request } = arg;
        return (
            request.last_payout_score <=
                models.Request.build().last_payout_score &&
            request.last_payout_pure_score <=
                models.Request.build().last_payout_pure_score &&
            request.hasPendingSuccessfulBid
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_reaccept_payouted`),
            tt_key: 'errors.cannot_reaccept_payouted',
        });
    },
});

export const apiCheckAssignRequest = new ValidationEntity({
    validate: async arg => {
        const { request } = arg;
        if (!request) return false;
        return (
            Number.prototype.castBool(request.isAssign) && !!request.AssignId
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_reaccept_payouted`),
            tt_key: 'errors.invalid_response_from_server',
        });
    },
});

export const apiCheckBidAmountRequest = new ValidationEntity({
    validate: async arg => {
        const { request } = arg;
        if (!request) return false;
        if (!request.VoterId) return false;
        const user = await models.User.findOne({
            where: {
                id: request.voter_id,
            },
        });
        return new Decimal(request.bid_amount || 0).lessThanOrEqualTo(
            new Decimal(user.token_balance || 0)
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_reaccept_payouted`),
            tt_key: 'errors.over_bid',
        });
    },
});

export const apiCreateRequestValidates = new ValidationEntities({
    items: [
        apiCheckRequestBody,
        apiCheckUserExists,
        apiCheckUserIsVerfied,
        apiCheckBidAmountRequest,
    ],
});

export const apiDestroyRequestValidates = new ValidationEntities({
    items: [apiUnwrapData('request'), apiCheckPayoutedRequest],
});

export const apiSolvingValidates = new ValidationEntities({
    //FIXME
    items: [apiUnwrapData('request') /*apiCheckPayoutedRequest*/],
});

export const apiCreateAssignValidates = new ValidationEntities({
    items: [apiCheckRequestBody, apiCheckUserExists, apiCheckUserIsVerfied],
});
