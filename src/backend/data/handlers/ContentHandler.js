import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import {
    ContentDataStore,
    LabelDataStore,
    UserDataStore,
    RecommendDataStore,
    TransactionDataStore,
} from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import { CONTENT_TYPE, SUBMIT_TYPE } from '@entity';
import { HomeModel, HomeModels } from '@entity/ViewEntities';
import { RENDER_PATTERN, RENDER_TYPE } from '@entity';
import zip from '@extension/zip';
import Content from '@models/content';
import Promise from 'bluebird';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import reward_config from '@constants/reward_config';
import { ApiError } from '@extension/Error';
import { Decimal } from 'decimal.js';

const contentDataStore = new ContentDataStore();
const recommendDataStore = new RecommendDataStore();
const userDataStore = new UserDataStore();
const labelDataStore = new LabelDataStore();
const transactionDataStore = new TransactionDataStore();

export default class ContentHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleGetUserHottestContentsRequest(router, ctx, next) {
        const { user, limit, offset } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const contents = await recommendDataStore
            .getHottestContents({
                target_user: user,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleGetStaticUserHottestContentsRequest(router, ctx, next) {
        const { limit, offset } = router.request.body;

        const contents = await recommendDataStore
            .getStaticHottestContents({
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleGetUserContentsRequest(router, ctx, next) {
        const { user, limit, offset } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const users = await recommendDataStore
            .getUserRequestBaseRelates({
                target_user: user,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            users,
        };
    }

    async handleStaticContentsRecommendRequest(router, ctx, next) {
        const { limit, offset, locale, country } = router.request.body;

        const users = await recommendDataStore
            .getStaticRecommendContents({
                limit,
                offset,
                locale,
                country,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            users,
        };
    }

    async handleGetCommunicatesRecommendRequest(router, ctx, next) {
        const { user, limit, offset } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const contents = await recommendDataStore
            .getCommunicateRecommends({
                target_user: user,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleStaticCommunicatesRecommendRequest(router, ctx, next) {
        const { limit, offset, locale, country } = router.request.body;

        const contents = await recommendDataStore
            .getStaticCommunicateRecommends({
                limit,
                offset,
                locale,
                country,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleGetUserFeedsRequest(router, ctx, next) {
        const { user, limit, offset } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        let user_includes = await userDataStore.getIncludes([user]).catch(e => {
            throw e;
        });

        user_includes = await userDataStore
            .getUserIncludesLabelStocks(user_includes[0])
            .catch(e => {
                throw e;
            });

        const contents = await contentDataStore
            .getUserFeeds({
                user: user_includes,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            labelStocks: user_includes.LabelStocks,
            follows: user_includes.Follows,
            contents,
        };
    }

    async handleGetStaticUserFeedsRequest(router, ctx, next) {
        const { limit, offset, isCommunicates } = router.request.body;

        const contents = await contentDataStore
            .getFeeds({
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleGetCommentsRequest(router, ctx, next) {
        let { content, limit, offset } = router.request.body;

        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const contents = await contentDataStore
            .getComments({
                content,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents,
        };
    }

    async handleCreateContentRequest(router, ctx, next) {
        let { content } = router.request.body;

        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const result = await contentDataStore
            .createContent(content)
            .catch(e => {
                throw e;
            });

        const include = await contentDataStore.getIncludes([result]);

        if (Number.prototype.castBool(content.isCheering)) {
            await transactionDataStore
                .upvote(include[0].User, include[0].ParentContent)
                .catch(e => {
                    router.body = {
                        success: true,
                    };
                    return;
                });
        } else {
            await transactionDataStore
                .delete_upvote(include[0].User, include[0].ParentContent)
                .catch(e => {
                    router.body = {
                        success: true,
                    };
                    return;
                });
        }

        router.body = {
            success: true,
        };
    }

    async handleUpdateContentRequest(router, ctx, next) {
        let { content } = router.request.body;

        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        let result = await contentDataStore.updateContent(content).catch(e => {
            throw e;
        });

        const include = await contentDataStore.getIncludes([result]);

        if (Number.prototype.castBool(content.isCheering)) {
            await transactionDataStore
                .upvote(include[0].User, include[0].ParentContent)
                .catch(e => {
                    router.body = {
                        success: true,
                    };
                    return;
                });
        } else {
            await transactionDataStore
                .delete_upvote(include[0].User, include[0].ParentContent)
                .catch(e => {
                    router.body = {
                        success: true,
                    };
                    return;
                });
        }

        router.body = {
            content: safe2json(result),
            success: true,
        };
    }

    async handleDeleteContentRequest(router, ctx, next) {
        let { content } = router.request.body;

        if (!content)
            throw new ApiError({
                error: new Error('Content is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Content' },
            });

        const include = await contentDataStore.getIncludes([content]);

        if (Number.prototype.castBool(content.isCheering)) {
            await transactionDataStore
                .delete_upvote(include[0].User, include[0].ParentContent)
                .catch(e => {
                    // router.body = {
                    //     success: true,
                    // };
                    // return;
                });
        }

        let result = await contentDataStore.deleteContent(content).catch(e => {
            throw e;
        });

        router.body = {
            success: true,
        };
    }

    async handleGetContentRequest(router, ctx, next) {
        const { id, relate_limit } = router.request.body;

        if (!id)
            throw new ApiError({
                error: new Error('Id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Id' },
            });

        const data = await contentDataStore
            .findOneContent({
                id,
            })
            .catch(e => {
                throw e;
            });

        if (!data) {
            router.body = {
                success: true,
            };
            return;
        }

        const relate_contents = await recommendDataStore
            .getUserViewedBaseRelates({
                target_content: safe2json(data),
                limit: Number(relate_limit),
            })
            .catch(e => {
                throw e;
            });

        // const relate_contents = await recommendDataStore
        //     .getUserOwnedBaseRelates({
        //         target_content: safe2json(data),
        //         limit: relate_limit,
        //     })
        //     .catch(e => {
        //         throw e;
        //     });

        router.body = {
            success: true,
            content: safe2json(data),
            relate_contents: relate_contents.map(val => safe2json(val)),
        };
    }

    async handleCreateViewHistoryRequest(router, ctx, next) {
        const { user, content } = router.request.body;

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

        const data = await contentDataStore
            .create_view_history({
                user,
                content,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleDeleteViewHistoryRequest(router, ctx, next) {
        const { user, content } = router.request.body;

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

        const data = await contentDataStore
            .delete_view_history({
                user,
                content,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleInitializeVectorsRequest(router, ctx, next) {
        if (process.env.NODE_ENV != 'development') {
            router.body = JSON.stringify({ status: 'ok' });
            router.redirect('/');
        }

        const { from_id, to_id } = router.query;

        const id_range =
            from_id && to_id
                ? {
                      id: {
                          $between: [
                              parseInt(from_id, 10),
                              parseInt(to_id, 10),
                          ],
                      },
                  }
                : null;

        const results = await models.Content.findAll({
            where: id_range,
        }).catch(e => {
            throw e;
        });

        if (!results)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            result => {
                return new Promise((resolve, reject) => {
                    return contentDataStore
                        .setContentVectors([result])
                        .then(contents => {
                            resolve(contents);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },
            { concurrency: 10 }
        ).catch(e => {
            throw e;
        });

        router.body = {
            contents: datum.map(data => {
                return safe2json(data);
            }),
            success: true,
        };
    }

    async handleInitializeCountsRequest(router, ctx, next) {
        if (process.env.NODE_ENV != 'development') {
            router.body = JSON.stringify({ status: 'ok' });
            router.redirect('/');
        }

        const { from_id, to_id } = router.query;

        const id_range =
            from_id && to_id
                ? {
                      id: {
                          $between: [
                              parseInt(from_id, 10),
                              parseInt(to_id, 10),
                          ],
                      },
                  }
                : null;

        const results = await models.Content.findAll({
            where: id_range,
        }).catch(e => {
            throw e;
        });

        if (!results)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            result => contentDataStore.updateCount(result),
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        router.body = {
            contents: datum.map(data => {
                return safe2json(data);
            }),
            success: true,
        };
    }

    async handleInitializeUpvotesRequest(router, ctx, next) {
        if (process.env.NODE_ENV != 'development') {
            router.body = JSON.stringify({ status: 'ok' });
            router.redirect('/');
        }

        const { from_id, to_id } = router.query;

        const id_range =
            from_id && to_id
                ? {
                      id: {
                          $between: [
                              parseInt(from_id, 10),
                              parseInt(to_id, 10),
                          ],
                      },
                      isBetterAnswer: false,
                      isBetterOpinion: false,
                  }
                : {
                      isBetterAnswer: false,
                      isBetterOpinion: false,
                  };

        const results = await models.UpVote.findAll({
            where: id_range,
        }).catch(e => {
            throw e;
        });

        if (!results)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            result => result.update({ isCheering: true }),
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        router.body = {
            contents: datum.map(data => {
                return safe2json(data);
            }),
            success: true,
        };
    }

    async handleInitializeContentAmountRequest(router, ctx, next) {
        if (process.env.NODE_ENV != 'development') {
            router.body = JSON.stringify({ status: 'ok' });
            router.redirect('/');
        }

        const { from_id, to_id } = router.query;

        const id_range =
            from_id && to_id
                ? {
                      id: {
                          $between: [
                              parseInt(from_id, 10),
                              parseInt(to_id, 10),
                          ],
                      },
                  }
                : null;

        const results = await models.Content.findAll({
            where: id_range,
        }).catch(e => {
            throw e;
        });

        const owners = await Promise.all(
            results.map(result =>
                models.User.findOne({
                    id: result.UserId,
                })
            )
        );

        if (!results)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            (result, i) =>
                result.update({
                    token_amount: new Decimal(owners[i].token_balance)
                        .times(
                            new Decimal(
                                reward_config.getAuthorScore(result)
                            ).dividedBy(
                                new Decimal(reward_config.getScore(owners[i]))
                            )
                        )
                        .toFixed(data_config.min_decimal_range),
                }),
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        router.body = {
            contents: datum.map(data => {
                return safe2json(data);
            }),
            success: true,
        };
    }

    async handleInitializeUpvoteAmountRequest(router, ctx, next) {
        if (process.env.NODE_ENV != 'development') {
            router.body = JSON.stringify({ status: 'ok' });
            router.redirect('/');
        }

        const { from_id, to_id } = router.query;

        const id_range =
            from_id && to_id
                ? {
                      id: {
                          $between: [
                              parseInt(from_id, 10),
                              parseInt(to_id, 10),
                          ],
                      },
                  }
                : null;

        const results = await models.UpVote.findAll({
            where: id_range,
        }).catch(e => {
            throw e;
        });

        const owners = await Promise.all(
            results.map(result =>
                models.User.findOne({
                    id: result.VoterId,
                })
            )
        );

        if (!results)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            (result, i) =>
                result.update({
                    token_amount: new Decimal(owners[i].token_balance)
                        .times(
                            new Decimal(
                                reward_config.getVoterScore(result)
                            ).dividedBy(
                                new Decimal(reward_config.getScore(owners[i]))
                            )
                        )
                        .toFixed(data_config.min_decimal_range),
                }),
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        router.body = {
            contents: datum.map(data => {
                return safe2json(data);
            }),
            success: true,
        };
    }
}
