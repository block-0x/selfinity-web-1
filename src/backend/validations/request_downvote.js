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
import { apiCheckPayoutedDownvote } from '@validations/downvote';

export const apiCheckRequestDownvote = new ValidationEntity({
    validate: async arg => {
        const { user, request } = arg;
        if (!user || !request) return false;
        return request.VoterId != user.id;
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot vote your own contents and requests`),
            tt_key: 'errors.cannot_vote_own',
        });
    },
});

export const apiCheckRequestDownvoteLimit = new ValidationEntity({
    validate: async arg => {
        const { user, request } = arg;
        const downvotes = await models.RequestDownVote.findAll({
            where: {
                VotedId: request.id,
            },
            attributes: ['voted_id', 'id'],
        });
        return downvotes.length <= data_config.vote_max_limit;
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`is_limit_vote`),
            tt_key: 'errors.is_limit_vote',
            tt_params: {
                limit: data_config.vote_max_limit,
            },
        });
    },
});

export const apiCheckIsNotVoteredDownvote = new ValidationEntity({
    validate: async arg => {
        const { user, request } = arg;
        if (!user || !request) return false;
        return user.id != request.VoteredId;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('votered_cant_vote'),
            tt_key: 'errors.votered_cant_vote',
        });
    },
});

export const apiRequestDownvoteValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('request'),
        apiCheckRequestDownvote,
        apiCheckIsNotVoteredDownvote,
        // apiCheckRequestDownvoteLimit,
    ],
});

export const apiRequestUnDownvoteValidates = new ValidationEntities({
    items: [
        // apiCheckRequestDownvote,
        apiCheckPayoutedDownvote,
    ],
});
