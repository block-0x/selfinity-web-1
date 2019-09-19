import DataStoreImpl from '@datastore/DataStoreImpl';
import ContentDataStore from '@datastore/ContentDataStore';
import RequestDataStore from '@datastore/RequestDataStore';
import UserDataStore from '@datastore/UserDataStore';
import Cookie from 'js-cookie';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import * as Web3net from '@network/web3';
import { Decimal } from 'decimal.js';
import models from '@models';
import Content from '@models/content';
import Request from '@models/request';
import {
    default_author_reward_ratio,
    default_voter_reward_ratio,
    least_user_score,
    least_vote_score,
    threshold_rate,
    threshold_number,
} from '@constants/reward_config';
import reward_config from '@constants/reward_config';
import { ACTION_TYPE } from '@entity';
import { ApiError } from '@extension/Error';
import data_config from '@constants/data_config';
import vector from '@extension/vector';
import {
    apiCreateRequestValidates,
    apiDestroyRequestValidates,
    apiSolvingValidates,
} from '@validations/request';
import { apiAcceptionOpinionValidates } from '@validations/content';
import { apiUpvoteValidates, apiUnUpvoteValidates } from '@validations/upvote';
import {
    apiDownvoteValidates,
    apiUnDownvoteValidates,
} from '@validations/downvote';
import {
    apiRequestUpvoteValidates,
    apiRequestUnUpvoteValidates,
} from '@validations/request_upvote';
import {
    apiRequestDownvoteValidates,
    apiRequestUnDownvoteValidates,
} from '@validations/request_downvote';
import Contracter from '@network/web3';
import WalletDataStore from '@datastore/WalletDataStore';
import NotificationDataStore from '@datastore/NotificationDataStore';

//TODO: set total supply method in RxToken
const test_total_supply = 250000000;
const contentDataStore = new ContentDataStore();
const requestDataStore = new RequestDataStore();
const userDataStore = new UserDataStore();
const walletDataStore = new WalletDataStore();
const contracter = new Contracter();
const notificationDataStore = new NotificationDataStore();

export default class TransactionDataStore extends DataStoreImpl {
    constructor() {
        super();
        this.least_user_score = least_user_score;
        this.least_vote_score = least_vote_score;
        this.default_author_reward_ratio = default_author_reward_ratio;
        this.default_voter_reward_ratio = default_voter_reward_ratio;
    }

    async user_score(user) {
        const balance = await contracter.getTokenBalanceOf(user.eth_address),
            allBalance = await contracter.totalSupply(),
            pre_base_score = balance / allBalance;

        return pre_base_score >= this.least_user_score
            ? pre_base_score
            : this.least_user_score;
    }

    // async pure_user_score(user) {}

    valid_upvote_score() {
        return true;
    }

    valid_downvote_score() {
        //nothing
        return true;
    }

    valid_request_upvote_score() {
        return true;
    }

    valid_request_downvote_score() {
        //nothing
        return true;
    }

    async cheerings_score(content) {
        if (!content) return new Decimal(0);
        const contents = await models.Content.findAll({
            where: {
                parent_id: Number(content.id),
                isCheering: true,
            },
            attributes: ['author_score'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        if (contents.length == 0) return new Decimal(0);
        return (
            [].sumDecimal(contents.map(val => new Decimal(val.author_score))) ||
            new Decimal(0)
        );
    }

    async cheerings_pure_score(content) {
        if (!content) return new Decimal(0);
        const contents = await models.Content.findAll({
            where: {
                parent_id: Number(content.id),
                isCheering: true,
            },
            attributes: ['author_pure_score'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        if (contents.length == 0) return new Decimal(0);
        return (
            [].sumDecimal(
                contents.map(val => new Decimal(val.author_pure_score))
            ) || new Decimal(0)
        );
    }

    async weight_content(content) {
        const to = content.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );

        const contents = await models.Content.findAll({
            where: {
                user_id: Number(content.UserId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        //MEMO: Good opinion should not down contributer score!
        // if (contents.filter(val => val.isBetterOpinion).length > 0)
        //     return new Decimal(threshold_rate);

        const compressing =
            contents.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(contents.length + 1));
    }

    async weight_request(content) {
        const to = content.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );

        const contents = await models.Request.findAll({
            where: {
                voter_id: Number(content.VoterId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const compressing =
            contents.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(contents.length + 1));
    }

    async weight_upvote(upvote) {
        const to = upvote.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );
        const votes = await models.UpVote.findAll({
            where: {
                voter_id: Number(upvote.VoterId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (votes.filter(val => val.isBetterOpinion).length > 0)
            return new Decimal(threshold_rate);

        const compressing = votes.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(votes.length + 1));
    }

    async weight_downvote(downvote) {
        const to = downvote.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );
        const votes = await models.DownVote.findAll({
            where: {
                voter_id: Number(downvote.VoterId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const compressing = votes.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(votes.length + 1));
    }

    async weight_request_upvote(upvote) {
        const to = upvote.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );
        const votes = await models.RequestUpVote.findAll({
            where: {
                voter_id: Number(upvote.VoterId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const compressing = votes.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(votes.length + 1));
    }

    async weight_request_downvote(downvote) {
        const to = downvote.createAt || new Date();
        const from = new Date(
            to.getFullYear(),
            to.getMonth(),
            to.getDate() - 1
        );
        const votes = await models.RequestDownVote.findAll({
            where: {
                voter_id: Number(downvote.VoterId),
                created_at: {
                    $between: [from, to],
                },
            },
            attributes: ['id'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const compressing = votes.length + 1 > reward_config.threshold_number;
        return compressing
            ? new Decimal(threshold_rate)
            : new Decimal(1).dividedBy(new Decimal(votes.length + 1));
    }

    async upvote_score(upvote, user_score) {
        if (!this.valid_upvote_score()) return new Decimal(0);
        const { numerator, denominator } = await this.number_of_upvote(
            upvote
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        const vote_rate = new Decimal(numerator).dividedBy(
            new Decimal(denominator)
        );
        const weight = await this.weight_upvote(upvote);
        const vote_credit = new Decimal(1).minus(vote_rate);
        const pre_vote_score = new Decimal(user_score)
            .times(vote_credit)
            .times(weight);
        return pre_vote_score.greaterThanOrEqualTo(
            new Decimal(this.least_vote_score)
        )
            ? pre_vote_score
            : new Decimal(this.least_vote_score);
    }

    async opinion_acception_score(upvote, user_score) {
        if (!this.valid_upvote_score()) return new Decimal(0);
        const pre_vote_score = new Decimal(user_score).times(
            new Decimal(reward_config.better_opinion_rate)
        );
        return pre_vote_score.greaterThanOrEqualTo(
            new Decimal(this.least_vote_score)
        )
            ? pre_vote_score
            : new Decimal(this.least_vote_score);
    }

    async opinion_acception_pure_score(upvote, user_pure_score) {
        return await this.opinion_acception_score(upvote, user_pure_score);
    }

    async downvote_score(downvote, user_score) {
        if (!this.valid_downvote_score()) return new Decimal(0);
        const { numerator, denominator } = await this.number_of_downvote(
            downvote
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        const vote_rate = new Decimal(numerator).dividedBy(
            new Decimal(denominator)
        );
        const weight = await this.weight_downvote(downvote);
        const vote_credit = new Decimal(1).minus(vote_rate);
        const pre_vote_score = new Decimal(user_score)
            .times(vote_credit)
            .times(weight);
        return pre_vote_score.greaterThanOrEqualTo(
            new Decimal(this.least_vote_score)
        )
            ? pre_vote_score
            : new Decimal(this.least_vote_score);
    }

    async upvote_pure_score(upvote, user_pure_score) {
        return await this.upvote_score(upvote, user_pure_score);
    }

    async downvote_pure_score(downvote, user_pure_score) {
        return await this.downvote_score(downvote, user_pure_score);
    }

    async request_upvote_score(upvote, user_score) {
        if (!this.valid_request_upvote_score()) return new Decimal(0);
        const { numerator, denominator } = await this.number_of_request_upvote(
            upvote
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        const vote_rate = new Decimal(numerator).dividedBy(
            new Decimal(denominator)
        );
        const weight = await this.weight_request_upvote(upvote);
        const vote_credit = new Decimal(1).minus(vote_rate);
        const pre_vote_score = new Decimal(user_score)
            .times(vote_credit)
            .times(weight);
        return pre_vote_score.greaterThanOrEqualTo(
            new Decimal(this.least_vote_score)
        )
            ? pre_vote_score
            : new Decimal(this.least_vote_score);
    }

    async request_downvote_score(downvote, user_score) {
        if (!this.valid_request_downvote_score()) return new Decimal(0);
        const {
            numerator,
            denominator,
        } = await this.number_of_request_downvote(downvote).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        const vote_rate = new Decimal(numerator).dividedBy(
            new Decimal(denominator)
        );
        const weight = await this.weight_request_downvote(downvote);
        const vote_credit = new Decimal(1).minus(vote_rate);
        const pre_vote_score = new Decimal(user_score)
            .times(vote_credit)
            .times(weight);
        return pre_vote_score.greaterThanOrEqualTo(
            new Decimal(this.least_vote_score)
        )
            ? pre_vote_score
            : new Decimal(this.least_vote_score);
    }

    async request_upvote_pure_score(upvote, user_pure_score) {
        return await this.request_upvote_score(upvote, user_pure_score);
    }

    async request_downvote_pure_score(downvote, user_pure_score) {
        return await this.request_downvote_score(downvote, user_pure_score);
    }

    valid_content_score() {
        //ユーザが自分自身の記事を評価した場合 && 評価したユーザ数が10未満の場合は0
        return true;
    }

    valid_request_score() {
        //ユーザが自分自身の記事を評価した場合 && 評価したユーザ数が10未満の場合は0
        return true;
    }

    async content_score(content) {
        if (!this.valid_content_score()) return new Decimal(0);
        let good_score = content.UpVotes.map(
            UpVote => new Decimal(UpVote.score)
        );
        good_score = good_score.sumDecimal(good_score);
        let bad_score = content.DownVotes.map(
            DownVote => new Decimal(DownVote.score)
        );
        bad_score = bad_score.sumDecimal(bad_score);

        if (good_score.lessThan(bad_score.times(new Decimal(2))))
            return new Decimal(0);

        const requests_score = await this.request_sigma_score(content).catch(
            e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            }
        );

        const weight = await this.weight_content(content);
        const opinion_weight = !!content.ParentId
            ? new Decimal(reward_config.opinion_rate)
            : new Decimal(1);
        const cheerings_score = await this.cheerings_score(content);

        return new Decimal(content.User.score)
            .times(weight)
            .times(opinion_weight)
            .plus(good_score)
            .minus(bad_score)
            .plus(requests_score)
            .plus(cheerings_score);
    }

    async content_pure_score(content) {
        if (!this.valid_content_score()) return new Decimal(0);
        let good_score = content.UpVotes.map(
            UpVote => new Decimal(UpVote.pure_score)
        );
        good_score = good_score.sumDecimal(good_score);
        let bad_score = content.DownVotes.map(
            DownVote => new Decimal(DownVote.pure_score)
        );
        bad_score = bad_score.sumDecimal(bad_score);

        if (good_score.lessThan(bad_score.times(new Decimal(2))))
            return new Decimal(0);

        const requests_score = await this.request_sigma_pure_score(
            content
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const weight = await this.weight_content(content);
        const cheerings_score = await this.cheerings_pure_score(content);
        const opinion_weight = !!content.ParentId
            ? new Decimal(reward_config.opinion_rate)
            : new Decimal(1);

        return new Decimal(content.User.pure_score)
            .times(weight)
            .times(opinion_weight)
            .plus(good_score)
            .minus(bad_score)
            .plus(requests_score)
            .plus(cheerings_score);
    }

    async content_inflate_score(content) {
        if (!this.valid_content_score()) return new Decimal(0);
        let good_score = content.UpVotes.map(
            UpVote => new Decimal(UpVote.score)
        );
        good_score = good_score.sumDecimal(good_score);

        if (good_score.lessThan(0)) return new Decimal(content.User.score);

        const weight = await this.weight_content(content);

        return new Decimal(content.User.score).times(weight).plus(good_score);
    }

    async content_inflate_pure_score(content) {
        if (!this.valid_content_score()) return new Decimal(0);
        let good_score = content.UpVotes.map(
            UpVote => new Decimal(UpVote.pure_score)
        );
        good_score = good_score.sumDecimal(good_score);

        if (!(good_score > 0)) return new Decimal(content.User.pure_score);

        const weight = await this.weight_content(content);

        return new Decimal(content.User.pure_score)
            .times(weight)
            .plus(good_score);
    }

    async request_sigma_score(content) {
        if (!content) return 0;
        const Requests = content.Requests;
        if (!Requests) return 0;
        if (Requests.length == 0) return 0;
        return [].sumDecimal(
            content.Requests.filter(
                req => req.isAccepted && req.isResolved
            ).map(req => new Decimal(req.answer_score))
        );
    }

    async request_sigma_pure_score(content) {
        if (!content) return 0;
        const Requests = content.Requests;
        if (!Requests) return 0;
        if (Requests.length == 0) return 0;
        return [].sumDecimal(
            content.Requests.filter(
                req => req.isAccepted && req.isResolved
            ).map(req => new Decimal(req.answer_score))
        );
    }

    async update_content_scores(content) {
        const content_scores = await Promise.all([
            this.content_score(content),
            this.content_pure_score(content),
            this.content_inflate_score(content),
            this.content_inflate_pure_score(content),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        content = await models.Content.findOne({
            where: {
                id: Number(content.id),
            },
        });

        let platform = await models.Platform.findAll({
            limit: 1,
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        platform = platform[0];

        const totalScore = new Decimal(platform.totalScore)
                .plus(content_scores[0])
                .minus(new Decimal(content.score)),
            totalPureScore = new Decimal(platform.totalPureScore)
                .plus(content_scores[1])
                .minus(new Decimal(content.pure_score)),
            inflateTotalScore = new Decimal(platform.inflateTotalScore)
                .plus(content_scores[2])
                .minus(new Decimal(content.score)),
            inflateTotalPureScore = new Decimal(platform.inflateTotalPureScore)
                .plus(content_scores[3])
                .minus(new Decimal(content.pure_score));

        const updated_content = await Promise.all([
            content.update({
                score: content_scores[0].toFixed(data_config.min_decimal_range),
                pure_score: content_scores[1].toFixed(
                    data_config.min_decimal_range
                ),
                author_score: content_scores[0]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                author_pure_score: content_scores[1]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voters_score: content_scores[0]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voters_pure_score: content_scores[1]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                last_score_at: new Date(),
                hasPendingPayout: true,
            }),
            !content.isCheering &&
                models.Platform.create({
                    totalScore: totalScore.toFixed(
                        data_config.min_decimal_range
                    ),
                    totalPureScore: totalPureScore.toFixed(
                        data_config.min_decimal_range
                    ),
                    inflateTotalScore:
                        inflateTotalScore.toNumber() <
                        platform.inflateTotalScore
                            ? platform.inflateTotalScore
                            : inflateTotalScore.toFixed(
                                  data_config.min_decimal_range
                              ),
                    inflateTotalPureScore:
                        inflateTotalPureScore.toNumber() <
                        platform.inflateTotalPureScore
                            ? platform.inflateTotalPureScore
                            : inflateTotalPureScore.toFixed(
                                  data_config.min_decimal_range
                              ),
                }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return updated_content[0];
    }

    //TODO: is it better to save this number ?
    async number_of_upvote(upvote) {
        const votes = await models.UpVote.findAll({
            where: {
                voted_id: Number(upvote.voted_id),
            },
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const target = votes.map((vote, index) => {
            if (vote.id == upvote.id) return index + 1;
        });
        if (target.length > 0) {
            return {
                numerator: target[0],
                denominator: votes.length,
            };
        } else {
            throw new Error('the target vote is not include in content votes');
        }
    }

    async number_of_downvote(downvote) {
        const votes = await models.DownVote.findAll({
            where: {
                voted_id: Number(downvote.voted_id),
            },
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const target = votes.map((vote, index) => {
            if (vote.id == downvote.id) return index + 1;
        });
        if (target.length > 0) {
            return {
                numerator: target[0],
                denominator: votes.length,
            };
        } else {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        }
    }

    async request_score(request) {
        if (!this.valid_request_score() || !request.Voter)
            return new Decimal(0);
        let good_score =
            request.UpVotes.length > 0
                ? request.UpVotes.map(UpVote => new Decimal(UpVote.score || 0))
                : [new Decimal(0)];
        good_score = good_score.sumDecimal(good_score);
        let bad_score =
            request.DownVotes.length > 0
                ? request.DownVotes.map(
                      DownVote => new Decimal(DownVote.score || 0)
                  )
                : [new Decimal(0)];
        bad_score = bad_score.sumDecimal(bad_score);

        if (good_score.lessThan(bad_score.times(new Decimal(2))))
            return new Decimal(0);

        const weight = await this.weight_request(request);

        return new Decimal(request.Voter.score)
            .times(weight)
            .plus(good_score)
            .minus(bad_score);
    }

    async request_pure_score(request) {
        if (!this.valid_request_score() || !request.Voter)
            return new Decimal(0);
        let good_score =
            request.UpVotes.length > 0
                ? request.UpVotes.map(
                      UpVote => new Decimal(UpVote.pure_score || 0)
                  )
                : [new Decimal(0)];
        good_score = good_score.sumDecimal(good_score);
        let bad_score =
            request.DownVotes.length > 0
                ? request.DownVotes.map(
                      DownVote => new Decimal(DownVote.pure_score || 0)
                  )
                : [new Decimal(0)];
        bad_score = bad_score.sumDecimal(bad_score);

        if (good_score.lessThan(bad_score.times(new Decimal(2))))
            return new Decimal(0);

        const weight = await this.weight_request(request);

        return new Decimal(request.Voter.pure_score)
            .times(weight)
            .plus(good_score)
            .minus(bad_score);
    }

    async request_inflate_score(request) {
        if (!this.valid_request_score() || !request.Voter)
            return new Decimal(0);
        let good_score =
            request.UpVotes.length > 0
                ? request.UpVotes.map(UpVote => new Decimal(UpVote.score))
                : [new Decimal(0)];
        good_score = good_score.sumDecimal(good_score);
        if (good_score.lessThan(new Decimal(0)))
            return new Decimal(request.Voter.score);

        const weight = await this.weight_request(request);

        return new Decimal(request.Voter.score).times(weight).plus(good_score);
    }

    async request_inflate_pure_score(request) {
        if (!this.valid_request_score() || !request.Voter)
            return new Decimal(0);
        let good_score =
            request.UpVotes.length > 0
                ? request.UpVotes.map(UpVote => new Decimal(UpVote.pure_score))
                : [new Decimal(0)];
        good_score = good_score.sumDecimal(good_score);
        if (good_score.lessThan(new Decimal(0)))
            return new Decimal(request.Voter.pure_score);

        const weight = await this.weight_request(request);

        return new Decimal(request.Voter.pure_score)
            .times(weight)
            .plus(good_score);
    }

    async update_request_scores(request) {
        if (!request) return;
        const request_scores = await Promise.all([
            this.request_score(request),
            this.request_pure_score(request),
            this.request_inflate_score(request),
            this.request_inflate_pure_score(request),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        request = await models.Request.findOne({
            where: {
                id: Number(request.id),
            },
        });

        let platform = await models.Platform.findAll({
            limit: 1,
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        platform = platform[0];

        const totalScore = new Decimal(platform.totalScore)
                .plus(request_scores[0])
                .minus(new Decimal(request.score)),
            totalPureScore = new Decimal(platform.totalPureScore)
                .plus(request_scores[1])
                .minus(new Decimal(request.pure_score)),
            inflateTotalScore = new Decimal(platform.inflateTotalScore)
                .plus(request_scores[2])
                .minus(new Decimal(request.score)),
            inflateTotalPureScore = new Decimal(platform.inflateTotalPureScore)
                .plus(request_scores[3])
                .minus(new Decimal(request.pure_score));

        const updated_content = await Promise.all([
            request.update({
                score: request_scores[0].toFixed(data_config.min_decimal_range),
                pure_score: request_scores[1].toFixed(
                    data_config.min_decimal_range
                ),
                answer_score: request_scores[0]
                    .times(this.default_author_reward_ratio)
                    .toFixed(data_config.min_decimal_range),
                answer_pure_score: request_scores[1]
                    .times(this.default_author_reward_ratio)
                    .toFixed(data_config.min_decimal_range),
                voters_score: request_scores[0]
                    .times(this.default_voter_reward_ratio)
                    .toFixed(data_config.min_decimal_range),
                voters_pure_score: request_scores[1]
                    .times(this.default_voter_reward_ratio)
                    .toFixed(data_config.min_decimal_range),
                last_score_at: new Date(),
                hasPendingPayout: true,
            }),
            models.Platform.create({
                totalScore: totalScore.toFixed(data_config.min_decimal_range),
                totalPureScore: totalPureScore.toFixed(
                    data_config.min_decimal_range
                ),
                inflateTotalScore:
                    inflateTotalScore.toNumber() < platform.inflateTotalScore
                        ? platform.inflateTotalScore
                        : inflateTotalScore.toFixed(
                              data_config.min_decimal_range
                          ),
                inflateTotalPureScore:
                    inflateTotalPureScore.toNumber() <
                    platform.inflateTotalPureScore
                        ? platform.inflateTotalPureScore
                        : inflateTotalPureScore.toFixed(
                              data_config.min_decimal_range
                          ),
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    //TODO: is it better to save this number ?
    async number_of_request_upvote(upvote) {
        const votes = await models.RequestUpVote.findAll({
            where: {
                voted_id: Number(upvote.voted_id),
            },
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const target = votes.map((vote, index) => {
            if (vote.id == upvote.id) return index + 1;
        });
        if (target.length > 0) {
            return {
                numerator: target[0],
                denominator: votes.length,
            };
        } else {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        }
    }

    //TODO: is it better to save this number ?
    async number_of_request_downvote(downvote) {
        const votes = await models.RequestDownVote.findAll({
            where: {
                voted_id: Number(downvote.voted_id),
            },
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const target = votes.map((vote, index) => {
            if (vote.id == downvote.id) return index + 1;
        });
        if (target.length > 0) {
            return {
                numerator: target[0],
                denominator: votes.length,
            };
        } else {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        }
    }

    async upvote(user, content, isAcception = false) {
        if (!user || !content) return;

        if (isAcception) {
            await apiAcceptionOpinionValidates.isValid({ user, content });
        } else {
            await apiUpvoteValidates.isValid({ user, content });
        }

        const parent = await models.Content.findOne({
            where: {
                id: Number(content.ParentId),
            },
            attributes: ['user_id'],
            raw: true,
        });

        const isBetterOpinion = isAcception ? parent.user_id == user.id : false;

        const result = await models.UpVote.findOrCreate({
            where: {
                voter_id: Number(user.id),
                voted_id: Number(content.id),
                isCheering: !isBetterOpinion,
                isBetterOpinion,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const deleteContrastTransaction = await this.delete_downvote(
            user,
            content,
            false
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const scores = await Promise.all([
            isBetterOpinion
                ? this.opinion_acception_score(result[0], user.score)
                : this.upvote_score(result[0], user.score),
            isBetterOpinion
                ? this.opinion_acception_pure_score(result[0], user.pure_score)
                : this.upvote_pure_score(result[0], user.pure_score),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updated_vote = await result[0]
            .update({
                score: scores[0].toFixed(data_config.min_decimal_range),
                pure_score: scores[1].toFixed(data_config.min_decimal_range),
                author_score: scores[0]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                author_pure_score: scores[1]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voter_score: scores[0]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voter_pure_score: scores[1]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                last_score_at: new Date(),
                hasPendingPayout: true,
                isBetterOpinion,
                isCheering: !isBetterOpinion,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const contents_data = await contentDataStore
            .getIncludes([content])
            .catch(e => {
                throw new Error(e);
            });

        const interests = await contentDataStore
            .create_interest(user, contents_data[0], ACTION_TYPE.Upvote.value)
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_content = await this.update_content_scores(
            contents_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (isBetterOpinion) {
            const good_opinion_content = await updated_content
                .update({ isBetterOpinion })
                .catch(e => {
                    throw new ApiError({
                        error: e,
                        tt_key: 'errors.invalid_response_from_server',
                    });
                });
            await notificationDataStore.onGoodOpinion(good_opinion_content);
        } else {
            await notificationDataStore.onGood(updated_content);
        }

        const user_instance = await models.User.findOne({
            where: {
                id: Number(user.id),
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await Promise.all([
            userDataStore.updateVector(user_instance, contents_data[0].vector),
            userDataStore.updateUpvoteVector(
                user_instance,
                contents_data[0].vector
            ),
            models.User.findOne({
                where: {
                    id: Number(content.UserId),
                },
                raw: true,
            }),
            contentDataStore.updateCount(contents_data[0]),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        walletDataStore.claimReward({ user: datum[2] });
        walletDataStore.claimReward({ user });

        return updated_vote;
    }

    async downvote(user, content) {
        if (!user || !content) return;

        await apiDownvoteValidates.isValid({ user, content });

        const result = await models.DownVote.findOrCreate({
            where: {
                voter_id: Number(user.id),
                voted_id: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const deleteContrastTransaction = await this.delete_upvote(
            user,
            content,
            false
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const scores = await Promise.all([
            this.downvote_score(result[0], user.score),
            this.downvote_pure_score(result[0], user.pure_score),
        ]);

        const updated_vote = await result[0].update({
            score: scores[0].toFixed(data_config.min_decimal_range),
            pure_score: scores[1].toFixed(data_config.min_decimal_range),
        });

        const contents_data = await contentDataStore
            .getIncludes([content])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        // const interests = await contentDataStore.create_interest(
        //     user,
        //     contents_data,
        //     ACTION_TYPE.Downvote.value
        // ).catch(e => {
        //     throw new Error(e);
        // });

        const updated_content = await this.update_content_scores(
            contents_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return updated_vote;
    }

    async delete_upvote(user, content, update_score = true) {
        if (!user || !content) return;

        const upvote = await models.UpVote.findOne({
            where: {
                VoterId: Number(user.id),
                VotedId: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!upvote) return;

        await apiUnUpvoteValidates.isValid({ upvote });
        const isBetterOpinion = !!upvote ? upvote.isBetterOpinion : false;
        const result = await models.UpVote.destroy({
            where: {
                VoterId: Number(user.id),
                VotedId: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents_data = await contentDataStore
            .getIncludes([content])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const interests = await contentDataStore
            .delete_interest(user, contents_data[0], ACTION_TYPE.Upvote.value)
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        if (update_score) {
            const updated_content = await this.update_content_scores(
                contents_data[0]
            ).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

            if (isBetterOpinion) {
                await updated_content
                    .update({ isBetterOpinion: false })
                    .catch(e => {
                        throw new ApiError({
                            error: e,
                            tt_key: 'errors.invalid_response_from_server',
                        });
                    });
            }
        }

        const user_instance = await models.User.findOne({
            where: {
                id: Number(user.id),
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await Promise.all([
            userDataStore.subVector(user_instance, contents_data[0].vector),
            userDataStore.subUpvoteVector(
                user_instance,
                contents_data[0].vector
            ),
            contentDataStore.updateCount(contents_data[0]),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async delete_downvote(user, content, update_score = true) {
        const downvote = await models.DownVote.findOne({
            where: {
                VoterId: Number(user.id),
                VotedId: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        await apiUnDownvoteValidates.isValid({ downvote });
        const result = await models.DownVote.destroy({
            where: {
                VoterId: Number(user.id),
                VotedId: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents_data = await contentDataStore
            .getIncludes([content])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        // const interests = await contentDataStore.delete_interest(
        //     user,
        //     contents_data,
        //     ACTION_TYPE.Downvote.value
        // ).catch(e => {
        //     throw new Error(e);
        // });

        if (update_score) {
            const updated_content = await this.update_content_scores(
                contents_data[0]
            ).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
        }

        return result;
    }

    async checkVoteCondtion(user, content) {
        if (!user.id || !content.id)
            return {
                isUpVoted: false,
                isDownVoted: false,
            };
        const isUpVoted = await models.UpVote.findOne({
            where: {
                voter_id: Number(user.id),
                voted_id: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const isDownVoted = await models.DownVote.findOne({
            where: {
                voter_id: Number(user.id),
                voted_id: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return {
            isUpVoted: !!isUpVoted,
            isDownVoted: !!isDownVoted,
        };
    }

    async follow(user, target_user) {
        const results = await Promise.all([
            models.Follow.findOrCreate({
                where: {
                    voter_id: Number(user.id),
                    votered_id: Number(target_user.id),
                },
            }),
            models.User.findOne({
                where: {
                    id: Number(user.id),
                },
                raw: false,
            }),
            models.User.findOne({
                where: {
                    id: Number(target_user.id),
                },
                raw: false,
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await Promise.all([
            userDataStore.updateVector(results[1], results[2].vector),
            userDataStore.updateFollowVector(results[1], results[2].vector),
            userDataStore.updateFollowerVector(results[2], results[1].vector),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return results[0];
    }

    async unfollow(user, target_user) {
        const results = await Promise.all([
            models.Follow.destroy({
                where: {
                    VoterId: Number(user.id),
                    VoteredId: Number(target_user.id),
                },
            }),
            models.User.findOne({
                where: {
                    id: Number(user.id),
                },
                raw: false,
            }),
            models.User.findOne({
                where: {
                    id: Number(target_user.id),
                },
                raw: false,
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await Promise.all([
            userDataStore.subVector(results[1], results[2].vector),
            userDataStore.subFollowVector(results[1], results[2].vector),
            userDataStore.subFollowerVector(results[2], results[1].vector),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return results[0];
    }

    async request(request) {
        request.voter_id = request.VoterId;
        request.votered_id = request.VoteredId;
        request.last_payout_at = request.createdAt;

        await apiCreateRequestValidates.isValid({
            request,
            UserId: request.VoterId,
        });

        request.bid_amount = new Decimal(request.bid_amount || 0).toFixed(
            data_config.min_decimal_range
        );

        let result = await models.Request.create(request).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const request_data = await requestDataStore
            .getIncludes([result.toJSON(result)])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated = await Promise.all([
            this.update_request_scores(request_data[0]),
            null, // requestDataStore.setRequestVectors([result]),
            models.User.findOne({
                where: {
                    id: Number(request_data[0].VoterId),
                },
                raw: false,
            }),
            notificationDataStore.onRequestCreate(result),
            contracter.bid({ request: request_data[0] }),
            // models.User.findOne({
            //     where: {
            //         id: request_data[0].VoteredId,
            //     },
            //     raw: false,
            // }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        // const datum = await Promise.all([
        //     userDataStore.updateVector(updated[2], updated[1][0].vector),
        //     userDataStore.updateRequestPostVector(
        //         updated[2],
        //         updated[1][0].vector
        //     ),
        //     // userDataStore.updateRequestedVector(updated[3], updated[1].vector),
        // ]).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        return request_data[0];
    }

    async update_request(request) {
        request.voter_id = request.VoterId;
        request.votered_id = request.VoteredId;

        const base = await models.Request.findOne({
            where: {
                id: Number(request.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        let result = await base
            .update({
                body: request.body,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const request_data = await requestDataStore
            .getIncludes([result.toJSON(result)])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated = await Promise.all([
            this.update_request_scores(request_data[0]),
            null, //requestDataStore.setRequestVectors([result]),
            models.User.findOne({
                where: {
                    id: Number(request_data[0].VoterId),
                },
                raw: false,
            }),
            // models.User.findOne({
            //     where: {
            //         id: request_data[0].VoteredId,
            //     },
            //     raw: false,
            // }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        // const datum = await Promise.all([
        //     userDataStore.updateVector(
        //         updated[2],
        //         vector.sub(
        //             updated[1][0].vector ||
        //                 Array.apply(null, Array(data_config.w2v_size)).map(
        //                     () => 0
        //                 ),
        //             base.vector ||
        //                 Array.apply(null, Array(data_config.w2v_size)).map(
        //                     () => 0
        //                 )
        //         )
        //     ),
        //     userDataStore.updateRequestPostVector(
        //         updated[2],
        //         vector.sub(
        //             updated[1][0].vector ||
        //                 Array.apply(null, Array(data_config.w2v_size)).map(
        //                     () => 0
        //                 ),
        //             base.vector ||
        //                 Array.apply(null, Array(data_config.w2v_size)).map(
        //                     () => 0
        //                 )
        //         )
        //     ),
        //     // userDataStore.updateRequestedVector(updated[3], updated[1].vector),
        // ]).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        return request_data[0];
    }

    async unrequest(request) {
        await apiDestroyRequestValidates.isValid({
            request,
            UserId: request.VoterId,
        });

        await contracter.denyBid({ request });

        const result = await models.Request.destroy({
            where: {
                id: Number(request.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const user = await models.User.findOne({
            where: {
                id: Number(request.voter_id),
            },
            raw: false,
        });

        const datum = await Promise.all([
            userDataStore.subVector(user, request.vector),
            userDataStore.subRequestPostVector(user, request.vector),
            // userDataStore.updateRequestedVector(updated[3], updated[1].vector),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async request_upvote(user, request) {
        await apiRequestUpvoteValidates.isValid({ user, request });
        let result = await models.RequestUpVote.findOrCreate({
            where: {
                voter_id: user.id,
                voted_id: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const deleteContrastTransaction = await this.delete_request_downvote(
            user,
            request
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const scores = await Promise.all([
            this.request_upvote_score(result[0], user.score),
            this.request_upvote_pure_score(result[0], user.pure_score),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updated_vote = await result[0]
            .update({
                score: scores[0].toFixed(data_config.min_decimal_range),
                pure_score: scores[1].toFixed(data_config.min_decimal_range),
                answer_score: scores[0]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                answer_pure_score: scores[1]
                    .times(new Decimal(this.default_author_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voter_score: scores[0]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                voter_pure_score: scores[1]
                    .times(new Decimal(this.default_voter_reward_ratio))
                    .toFixed(data_config.min_decimal_range),
                last_score_at: new Date(),
                hasPendingPayout: true,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const request_data = await requestDataStore
            .getIncludes([request])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_request = await this.update_request_scores(
            request_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const targets = await Promise.all([
            models.User.findOne({
                where: {
                    id: request.VoterId,
                },
            }),
            models.User.findOne({
                where: {
                    id: request.VoteredId,
                },
            }),
        ]);

        targets.map(val => walletDataStore.claimReward({ user: val }));

        return updated_vote;
    }

    async request_downvote(user, request) {
        await apiRequestDownvoteValidates.isValid({ user, request });
        const result = await models.RequestDownVote.findOrCreate({
            where: {
                voter_id: user.id,
                voted_id: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const deleteContrastTransaction = await this.delete_request_upvote(
            user,
            request
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const scores = await Promise.all([
            this.request_downvote_score(result[0], user.score),
            this.request_downvote_pure_score(result[0], user.pure_score),
        ]);

        const updated_vote = await result[0].update({
            score: scores[0].toFixed(data_config.min_decimal_range),
            pure_score: scores[1].toFixed(data_config.min_decimal_range),
        });

        const request_data = await requestDataStore
            .getIncludes([request])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_request = await this.update_request_scores(
            request_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return updated_vote;
    }

    async delete_request_upvote(user, request) {
        const upvote = await models.RequestUpVote.findOne({
            where: {
                VoterId: user.id,
                VotedId: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        await apiRequestUnUpvoteValidates.isValid({ upvote });
        const result = await models.RequestUpVote.destroy({
            where: {
                VoterId: user.id,
                VotedId: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const request_data = await requestDataStore
            .getIncludes([request])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_request = await this.update_request_scores(
            request_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async delete_request_downvote(user, request) {
        const downvote = await models.RequestDownVote.findOne({
            where: {
                VoterId: user.id,
                VotedId: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        await apiRequestUnDownvoteValidates.isValid({ downvote });
        const result = await models.RequestDownVote.destroy({
            where: {
                VoterId: user.id,
                VotedId: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const request_data = await requestDataStore
            .getIncludes([request])
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_request = await this.update_request_scores(
            request_data[0]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async acceptContentForRequest(user, request, content) {
        request = await models.Request.findOne({
            where: {
                id: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await apiSolvingValidates.isValid({
            request,
        });

        const result = await request
            .update({
                isResolved: true,
                isAccepted: true,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        content = await contentDataStore.getIncludes([content]);
        content = content[0];

        const updated_content = await this.update_content_scores(content).catch(
            e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            }
        );

        const good_answer_content = await updated_content
            .update({ isBetterAnswer: true })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const upvote_for_answer = await models.UpVote.findOrCreate({
            where: {
                voter_id: Number(request.VoterId),
                voted_id: Number(content.id),
                isBetterAnswer: true,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await contentDataStore.updateCount(content);

        await notificationDataStore.onGoodAnswer(good_answer_content);

        return result;
    }

    async denyContentForRequest(user, request, content) {
        request = await models.Request.findOne({
            where: {
                id: request.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await apiSolvingValidates.isValid({
            request,
        });

        const result = await request
            .update({
                isResolved: true,
                isAccepted: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        content = await contentDataStore.getIncludes([content]);
        content = content[0];

        const updated_content = await this.update_content_scores(content).catch(
            e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            }
        );

        const upvote_for_answer = await models.UpVote.findOne({
            where: {
                voter_id: Number(request.VoterId),
                voted_id: Number(content.id),
                isBetterAnswer: true,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const deleted = await models.UpVote.destroy({
            where: {
                voter_id: Number(request.VoterId),
                voted_id: Number(content.id),
                isBetterAnswer: true,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await contentDataStore.updateCount(content);

        await updated_content.update({ isBetterAnswer: false }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async acceptContentForRequests(user, requests, content) {
        const results = await Promise.all(
            requests.map(request =>
                this.acceptContentForRequest(user, request, content)
            )
        );
    }

    async denyContentForRequests(user, requests, content) {
        const results = await Promise.all(
            requests.map(request =>
                this.denyContentForRequest(user, request, content)
            )
        );
    }
}
