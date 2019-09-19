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

export const apiCheckUpvote = new ValidationEntity({
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

export const apiCheckUpvoteLimit = new ValidationEntity({
    validate: async arg => {
        const { user, content } = arg;
        const upvotes = await models.UpVote.findAll({
            where: {
                VotedId: content.id,
            },
            attributes: ['voted_id', 'id'],
        });
        return upvotes.length <= data_config.vote_max_limit;
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

export const apiCheckPayoutedUpvote = new ValidationEntity({
    validate: async arg => {
        const { upvote } = arg;
        if (!upvote) return true;
        return (
            upvote.last_payout_score <=
                models.UpVote.build().last_payout_score &&
            upvote.last_payout_pure_score <=
                models.UpVote.build().last_payout_pure_score
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_destroy_payouted`),
            tt_key: 'errors.cannot_destroy_payouted',
        });
    },
});

export const apiCheckIsNotAuthorUpvote = new ValidationEntity({
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

export const apiUpvoteValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('content'),
        apiCheckUpvote,
        apiCheckIsNotAuthorUpvote,
        // apiCheckUpvoteLimit,
    ],
});

export const apiUnUpvoteValidates = new ValidationEntities({
    items: [
        // apiCheckUpvote,
        apiCheckPayoutedUpvote,
    ],
});
