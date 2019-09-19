import DataStoreImpl from '@datastore/DataStoreImpl';
import UserDataStore from '@datastore/UserDataStore';
import ContentDataStore from '@datastore/ContentDataStore';
import NotificationDataStore from '@datastore/NotificationDataStore';
import Cookie from 'js-cookie';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import Contracter from '@network/web3';
import Bridge from '@network/bridge';
import models from '@models';
import env from '@env/env.json';
import { ApiError } from '@extension/Error';
import reward_config from '@constants/reward_config';
import data_config from '@constants/data_config';
import Sequelize from 'sequelize';
import { Decimal } from 'decimal.js';
import Promise from 'bluebird';
import { apiBridgeValidates } from '@validations/bridge';

const userDataStore = new UserDataStore();
const contentDataStore = new ContentDataStore();
const contracter = new Contracter();
const bridge = new Bridge();
const notificationDataStore = new NotificationDataStore();

export default class WalletDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async getScoreInDays(from, to) {
        const platforms = await Promise.all([
            models.Platform.findAll({
                where: {
                    created_at: {
                        $between: [from, to],
                    },
                },
                limit: 1,
                order: [['created_at', 'ASC']],
            }),
            models.Platform.findAll({
                where: {
                    created_at: {
                        $between: [from, to],
                    },
                },
                limit: 1,
                order: [['created_at', 'DESC']],
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const minp = platforms[0][0],
            maxp = platforms[1][0];

        if (!minp || !maxp) return;

        const diffDay = (to.getTime() - from.getTime()) / 86400000;

        return {
            diffScore: maxp.inflateTotalScore - minp.inflateTotalScore,
            diffPureScore:
                maxp.inflateTotalPureScore - minp.inflateTotalPureScore,
            diffDay,
        };
    }

    async claimRewardFromContent({ account, author, content }) {
        if (!new Date().isOneDayAgo(content.last_payout_at)) {
            return false;
        }
        const platform = await this.getScoreInDays(
            content.last_payout_at,
            content.last_score_at
        ).catch(e => {
            throw e;
        });

        if (!platform) return false;

        const score = new Decimal(content.author_score).minus(
                new Decimal(content.last_payout_author_score)
            ),
            pure_score = new Decimal(content.author_pure_score).minus(
                new Decimal(content.last_payout_author_pure_score)
            );

        if (
            platform.diffScore <= 0 ||
            platform.diffPureScore <= 0 ||
            platform.diffDay <= 0 ||
            score <= 0 ||
            pure_score <= 0
        )
            return false;

        const results = await contracter
            .reward({
                user: author,
                account,
                score,
                pure_score,
                totalScore: platform.diffScore,
                totalPureScore: platform.diffPureScore,
                interval: platform.diffDay,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_content = await content
            .update({
                token_amount: new Decimal(content.token_amount)
                    .plus(new Decimal(results[0].amount))
                    .toFixed(data_config.min_decimal_range),
                last_payout_score: content.score,
                last_payout_pure_score: content.pure_score,
                last_payout_author_score: content.author_score,
                last_payout_author_pure_score: content.author_pure_score,
                last_payout_voter_score: content.voter_score,
                last_payout_voter_pure_score: content.voter_pure_score,
                last_payout_at: new Date(),
                hasPendingPayout: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        return true;
    }

    async resolveRequestStatus({ request }) {
        if (!request.isResolved || !request.isAccepted) return false;

        await request
            .update({
                last_payout_score: request.score,
                last_payout_pure_score: request.pure_score,
                last_payout_answer_score: request.answer_score,
                last_payout_answer_pure_score: request.answer_pure_score,
                last_payout_voters_score: request.voters_score,
                last_payout_voters_pure_score: request.voters_pure_score,
                last_payout_at: new Date(),
                hasPendingPayout: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        return true;
    }

    async claimRewardFromRequest({ account, author, content }) {
        if (!content.isResolved || !!content.isAccepted) return;

        if (!new Date().isOneDayAgo(content.last_payout_at)) {
            return false;
        }

        const platform = await this.getScoreInDays(
            content.last_payout_at,
            content.last_score_at
        ).catch(e => {
            throw e;
        });

        if (!platform) return false;

        const score = new Decimal(content.answer_score).minus(
                new Decimal(content.last_payout_answer_score)
            ),
            pure_score = new Decimal(content.answer_pure_score).minus(
                new Decimal(content.last_payout_answer_pure_score)
            );

        if (
            platform.diffScore <= 0 ||
            platform.diffPureScore <= 0 ||
            platform.diffDay <= 0 ||
            score <= 0 ||
            pure_score <= 0
        )
            return false;

        const result = await contracter
            .reward({
                user: author,
                account,
                score,
                pure_score,
                totalScore: platform.diffScore,
                totalPureScore: platform.diffPureScore,
                interval: platform.diffDay,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_upvote = await content
            .update({
                last_payout_score: content.score,
                last_payout_pure_score: content.pure_score,
                last_payout_answer_score: content.answer_score,
                last_payout_answer_pure_score: content.answer_pure_score,
                last_payout_voters_score: content.voters_score,
                last_payout_voters_pure_score: content.voters_pure_score,
                last_payout_at: new Date(),
                hasPendingPayout: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        return true;
    }

    async claimRewardFromUpvote({ account, voter, upvote }) {
        if (!new Date().isOneDayAgo(upvote.last_payout_at)) {
            return false;
        }

        const content = await models.Content.findOne({
            where: {
                id: Number(upvote.VotedId),
            },
        });
        const platform = await this.getScoreInDays(
            content.last_payout_at,
            content.last_score_at
        ).catch(e => {
            throw e;
        });

        if (!platform) return false;

        const score = new Decimal(upvote.author_score).minus(
                new Decimal(upvote.last_payout_author_score)
            ),
            pure_score = new Decimal(upvote.author_pure_score).minus(
                new Decimal(upvote.last_payout_author_pure_score)
            );

        if (
            platform.diffScore <= 0 ||
            platform.diffPureScore <= 0 ||
            platform.diffDay <= 0 ||
            score <= 0 ||
            pure_score <= 0
        )
            return false;

        const results = await contracter
            .reward({
                user: voter,
                account,
                score,
                pure_score,
                totalScore: platform.diffScore,
                totalPureScore: platform.diffPureScore,
                interval: platform.diffDay,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_upvote = await upvote
            .update({
                token_amount: results[0].amount,
                last_payout_score: upvote.score,
                last_payout_pure_score: upvote.pure_score,
                last_payout_author_score: upvote.author_score,
                last_payout_author_pure_score: upvote.author_pure_score,
                last_payout_voter_score: upvote.voter_score,
                last_payout_voter_pure_score: upvote.voter_pure_score,
                last_payout_at: new Date(),
                hasPendingPayout: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        // const updated_content = await content
        //     .update({
        //         token_amount: new Decimal(content.token_amount).plus(new Decimal(results[0].token_amount)),
        //     })
        //     .catch(e => {
        //         throw new ApiError({
        //             error: e,
        //             tt_key: 'errors.invalid_response_from_server',
        //         });
        //     });

        return true;
    }

    async claimRewardFromRequestUpvote({ account, voter, upvote }) {
        if (!new Date().isOneDayAgo(upvote.last_payout_at)) {
            return false;
        }
        const content = await models.Request.findOne({
            where: {
                id: Number(upvote.VotedId),
            },
        });
        const platform = await this.getScoreInDays(
            content.last_payout_at,
            content.last_score_at
        ).catch(e => {
            throw e;
        });

        if (!platform) return false;

        const score = new Decimal(upvote.answer_score).minus(
                new Decimal(upvote.last_payout_answer_score)
            ),
            pure_score = new Decimal(upvote.answer_pure_score).minus(
                new Decimal(upvote.last_payout_answer_pure_score)
            );

        if (
            platform.diffScore <= 0 ||
            platform.diffPureScore <= 0 ||
            platform.diffDay <= 0 ||
            score <= 0 ||
            pure_score <= 0
        )
            return false;

        const result = await contracter
            .reward({
                user: voter,
                account,
                score,
                pure_score,
                totalScore: platform.diffScore,
                totalPureScore: platform.diffPureScore,
                interval: platform.diffDay,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const updated_upvote = await upvote
            .update({
                last_payout_score: upvote.score,
                last_payout_pure_score: upvote.pure_score,
                last_payout_answer_score: upvote.answer_score,
                last_payout_answer_pure_score: upvote.answer_pure_score,
                last_payout_voter_score: upvote.voter_score,
                last_payout_voter_pure_score: upvote.voter_pure_score,
                last_payout_at: new Date(),
                hasPendingPayout: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        return true;
    }

    async claimBidFromRequest({ request }) {
        if (
            Number.prototype.castBool(request.isAccepted) &&
            Number.prototype.castBool(request.isResolved)
        ) {
            await contracter.successBid({ request });
        } else if (
            !Number.prototype.castBool(request.isAccepted) &&
            Number.prototype.castBool(request.isResolved)
        ) {
            await contracter.denyBid({ request });
        }

        return true;
    }

    async claimReward({ user }) {
        const datum = await Promise.all([
            models.Account.findOne({
                where: {
                    user_id: Number(user.id),
                    // name: user.username,
                },
            }),
            models.Content.findAll({
                where: {
                    user_id: Number(user.id),
                    hasPendingPayout: true,
                    isCheering: false,
                },
            }),
            models.UpVote.findAll({
                where: {
                    voter_id: Number(user.id),
                    hasPendingPayout: true,
                    isBetterAnswer: false,
                },
            }),
            models.Request.findAll({
                where: {
                    voter_id: Number(user.id),
                    hasPendingPayout: true,
                    isResolved: true,
                    isAccepted: false,
                },
            }),
            models.RequestUpVote.findAll({
                where: {
                    voter_id: Number(user.id),
                    hasPendingPayout: true,
                },
            }),
            models.Request.findAll({
                where: {
                    votered_id: Number(user.id),
                    hasPendingPayout: true,
                    isResolved: true,
                    isAccepted: true,
                },
            }),
            models.Request.findAll({
                where: {
                    isResolved: true,
                    votered_id: Number(user.id),
                    hasPendingSuccessfulBid: true,
                },
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const beforeScore = reward_config.getScore(user);

        const c_results = await Promise.map(
            datum[1],
            (val, i) =>
                this.claimRewardFromContent({
                    account: datum[0],
                    author: user,
                    content: val,
                }),
            { concurrency: 1 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const v_results = await Promise.map(
            datum[2],
            val =>
                this.claimRewardFromUpvote({
                    account: datum[0],
                    voter: user,
                    upvote: val,
                }),
            { concurrency: 1 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const r_results = await Promise.map(
            datum[3],
            val =>
                this.claimRewardFromRequest({
                    account: datum[0],
                    author: user,
                    content: val,
                }),
            { concurrency: 1 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const rv_results = await Promise.map(
            datum[4],
            val =>
                this.claimRewardFromRequestUpvote({
                    account: datum[0],
                    voter: user,
                    upvote: val,
                }),
            { concurrency: 1 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const rr_results = await Promise.all(
            datum[5].map((request, i) =>
                this.resolveRequestStatus({
                    request,
                })
            )
        );

        const rb_results = await Promise.all(
            datum[6].map((request, i) =>
                this.claimBidFromRequest({
                    request,
                })
            )
        );

        const updated_user = await models.User.findOne({
            where: {
                id: Number(user.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const afterScore = reward_config.getScore(updated_user);

        if (new Decimal(afterScore).greaterThan(new Decimal(beforeScore))) {
            // await notificationDataStore.onReward(updated_user);
        }
    }

    async bridgeToken({ user, toAddress, amount }) {
        await apiBridgeValidates.isValid({
            user,
            toAddress,
            amount,
        });

        const result = await bridge.run({
            user,
            walletAddress: toAddress,
            amount,
        });
    }

    async sendToken(fromAddress, toAddress, amount) {
        await contracter.sendToken(fromAddress, toAddress, amount).catch(e => {
            throw e;
        });
    }

    async transferToken(toAddress, amount) {
        await contracter
            .transferToken(fromAddress, toAddress, amount)
            .catch(e => {
                throw e;
            });
    }

    async getPrivateKeyFromUser(user) {
        const account = await models.Account.findOne({
            where: {
                user_id: Number(user.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return ''; //account.owner_private_key;
    }

    async getTokenBalanceOf(walletAddress) {
        return await contracter.getTokenBalanceOf(walletAddress);
    }
}
