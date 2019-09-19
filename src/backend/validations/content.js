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

export const apiCheckContentTitle = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content.title) return false;
        return (
            `${content.title}`.length > data_config.title_min_limit &&
            `${content.title}`.length < data_config.title_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('title is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.title',
                min: data_config.title_min_limit,
                max: data_config.title_max_limit,
            },
        });
    },
});

export const apiCheckContentBody = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content.body) return false;
        return (
            ''.cleaning_tag(`${content.body}`).length >
            data_config.body_min_limit /*&&
            ''.cleaning_tag(`${content.body}`).length <
                data_config.body_max_limit*/
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('body is not correct format'),
            tt_key: 'errors.not_exists',
            tt_params: {
                content: 'g.body',
                // min: data_config.body_min_limit,
                // max: data_config.body_max_limit,
            },
        });
    },
});

export const apiCheckLabelTitle = new ValidationEntity({
    validate: async arg => {
        const { label } = arg;
        if (!label.title) return false;
        return (
            label.title.length > data_config.label_title_min_limit &&
            label.title.length < data_config.label_title_max_limit
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('label title is not correct format'),
            tt_key: 'errors.is_text_min_max_limit',
            tt_params: {
                data: 'g.label',
                min: data_config.label_title_min_limit,
                max: data_config.label_title_max_limit,
            },
        });
    },
});

export const apiCheckPayoutedContent = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        return (
            content.last_payout_score <=
                models.Content.build().last_payout_score &&
            content.last_payout_pure_score <=
                models.Content.build().last_payout_pure_score
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`cannot_destroy_payouted`),
            tt_key: 'errors.cannot_destroy_payouted',
        });
    },
});

export const apiCheckAnswerAuth = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        const Requests = content.Requests;
        if (!(Requests instanceof Array)) return true;
        if (Requests.length == 0) return true;
        const requests = await Promise.all(
            Requests.map(val =>
                models.Request.findOne({
                    where: {
                        id: val.id,
                    },
                    attributes: ['votered_id'],
                })
            )
        );
        return (
            requests.filter(
                request =>
                    request.VoteredId == content.UserId ||
                    request.votered_id == content.UserId
            ).length == requests.length
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('cannot_answer_without_auth'),
            tt_key: 'errors.cannot_answer_without_auth',
        });
    },
});

export const apiCheckAnswered = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content) return false;
        const Requests = content.Requests;
        if (!(Requests instanceof Array)) return true;
        if (Requests.length == 0) return true;
        if (!!content.id) return true; //MEMO: this pattern is edit of content.
        const requests = await Promise.all(
            Requests.map(val =>
                models.Request.findOne({
                    where: {
                        id: val.id,
                    },
                    attributes: ['isAnswered', 'content_id', 'id'],
                })
            )
        );
        return (
            requests.filter(
                request =>
                    !request.ContentId &&
                    !request.content_id &&
                    !request.isAnswered
            ).length == requests.length
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('answered'),
            tt_key: 'errors.answered',
        });
    },
});

export const apiCheckContributor = new ValidationEntity({
    validate: async arg => {
        const { content, user } = arg;
        if (!content || !user) return false;
        const parent = await models.Content.findOne({
            where: {
                id: content.ParentId,
            },
            attributes: ['user_id'],
        });
        if (!parent) return false;
        return parent.user_id == user.id;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('cannot_better_vote'),
            tt_key: 'errors.cannot_better_vote',
        });
    },
});

export const apiCheckCheering = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content) return false;
        return !content.isCheering;
    },
    error: arg => {
        throw new ApiError({
            error: new Error('cannot_better_vote_cheer'),
            tt_key: 'errors.cannot_better_vote_cheer',
        });
    },
});

export const apiCheckYourOwnOpinion = new ValidationEntity({
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

export const apiCheckGoodOpinionLimit = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content) return false;
        const children = await models.Content.findAll({
            where: {
                parent_id: content.ParentId,
                isBetterOpinion: true,
            },
            raw: true,
        });
        return children.length < data_config.good_opinion_max_limit;
    },
    error: arg => {
        throw new ApiError({
            error: new Error(`good_opinion_limit`),
            tt_key: 'errors.good_opinion_limit',
            tt_params: {
                limit: data_config.good_opinion_max_limit,
            },
        });
    },
});

export const apiCheckAssignContent = new ValidationEntity({
    validate: async arg => {
        const { content } = arg;
        if (!content) return false;
        return Number.prototype.castBool(content.isAssign);
    },
    error: arg => {
        throw new ApiError({
            error: e,
            tt_key: 'errors.invalid_response_from_server',
        });
    },
});

export const apiCreateContentValidates = new ValidationEntities({
    items: [
        apiCheckContentTitle,
        apiCheckContentBody,
        apiCheckAnswerAuth,
        apiCheckAnswered,
        apiCheckUserIsVerfied,
    ],
});

export const apiDestroyContentValidates = new ValidationEntities({
    items: [apiCheckPayoutedContent],
});

export const apiCreateLabelValidates = new ValidationEntities({
    items: [apiCheckLabelTitle],
});

export const apiAcceptionOpinionValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('content'),
        apiCheckContributor,
        // apiCheckCheering,
        apiCheckYourOwnOpinion,
        // apiCheckGoodOpinionLimit,
    ],
});

export const apiDenyOpinionValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('content'),
        apiCheckContributor,
        // apiCheckCheering,
        apiCheckYourOwnOpinion,
    ],
});
