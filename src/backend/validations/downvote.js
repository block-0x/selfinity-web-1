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

export const apiCheckDownvote = new ValidationEntity({
    validate: async arg => {
        const { user, content } = arg;
        if (!user || !content) return false;
        return content.UserId != user.id;
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot vote your own contents and requests`),
            tt_key: 'errors.cannot_vote_own',
        });
    },
});

export const apiCheckPayoutedDownvote = new ValidationEntity({
    validate: async arg => {
        const { downvote } = arg;
        if (!downvote) return true;
        return (
            downvote.last_payout_score <=
                models.DownVote.build().last_payout_score &&
            downvote.last_payout_pure_score <=
                models.DownVote.build().last_payout_pure_score
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_destroy_payouted`),
            tt_key: 'errors.cannot_destroy_payouted',
        });
    },
});

export const apiCheckDownvoteLimit = new ValidationEntity({
    validate: async arg => {
        const { user, content } = arg;
        const downvotes = await models.DownVote.findAll({
            where: {
                VotedId: content.id,
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

export const apiCheckIsNotAuthorDownvote = new ValidationEntity({
    validate: async arg => {
        const { user, content } = arg;
        if (!user || !content) return false;
        const parent = await models.Content.findOne({
            where: {
                id: content.ParentId,
            },
            attributes: ['user_id'],
        });
        if (!parent) return true;
        return user.id != parent.user_id;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('should_better_vote'),
            tt_key: 'errors.should_better_vote',
        });
    },
});

export const apiDownvoteValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('content'),
        apiCheckDownvote,
        apiCheckIsNotAuthorDownvote,
        // apiCheckDownvoteLimit,
    ],
});

export const apiUnDownvoteValidates = new ValidationEntities({
    items: [
        // apiCheckDownvote,
        apiCheckPayoutedDownvote,
    ],
});
