import ContentDataStore from '@datastore/ContentDataStore';
import UserDataStore from '@datastore/UserDataStore';
import LabelDataStore from '@datastore/LabelDataStore';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import vector from '@extension/vector';
import Promise from 'bluebird';
import PyShell from '@network/python_shell';
import Content from '@models/content';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import Sequelize from 'sequelize';
import { ApiError } from '@extension/Error';

const userDataStore = new UserDataStore();
const labelDataStore = new LabelDataStore();

export default class RecommendDataStore extends ContentDataStore {
    constructor() {
        super();
    }

    async getNewestContents({ limit = 6, offset = 0, pruned = false }) {
        const data = await super
            .getNewestContents({
                limit,
                offset,
                pruned,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        return data;
    }

    async getStaticRecommendContents({ limit, offset, locale, country }) {
        const requests = await models.Request.findAll({
            where: {
                // locale,
                // country,
                isAccepted: false,
            },
            attributes: [
                'votered_id',
                'VoteredId',
                [
                    Sequelize.fn('count', Sequelize.col('votered_id')),
                    'VoteredIdCount',
                ],
            ],
            limit: data_config.fetch_data_limit('XL'),
            group: ['votered_id'],
            // order: [['VoteredIdCount', 'DESC']],
            offset: 0,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const ids = requests
            .sort((a, b) => {
                if (a.VoteredIdCount > b.VoteredIdCount) return -1;
                if (a.VoteredIdCount < b.VoteredIdCount) return 1;
                return 0;
            })
            .map(val => val.VoteredId)
            .slice(
                offset || 0,
                (limit || data_config.fetch_data_limit('S')) + (offset || 0)
            );

        let users = await Promise.all(
            ids.map(id =>
                models.User.findOne({ where: { id: Number(id) }, raw: true })
            )
        );

        users = await userDataStore.getIncludes(users, {
            contents: true,
            voted_requests: true,
        });

        const contents = await Promise.all(
            users.map(val => super.getIndexIncludes(val.Contents))
        );

        return users.map((val, i) => {
            val.Contents = contents[i];
            return val;
        });
    }

    async getLabelsFromUserInterests({ user, limit, offset }) {
        const interests = await models.Interest.findAll({
            where: {
                user_id: Number(user.id),
            },
            attributes: [
                'label_id',
                [
                    Sequelize.fn('count', Sequelize.col('label_id')),
                    'labelCount',
                ],
            ],
            group: ['label_id'],
            order: [['labelCount', 'DESC']],
            limit: data_config.fetch_data_limit('XL'),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await Promise.all(
            interests
                .slice(
                    offset || 0,
                    Number(limit || data_config.fetch_data_limit('S'))
                )
                .map(
                    async val =>
                        await models.Label.findOne({
                            where: {
                                id: Number(val.id),
                            },
                        })
                )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async vecRecommend(target_vector, mode, limit = 6, co_limit = 100) {
        const vals = await models.Content.findAll({
            where: {
                mode,
            },
            limit: co_limit,
            subQuery: false,
            raw: true,
        });

        const contents = vals
            .map(val => {
                return {
                    content: val,
                    sim: vector.cosinesim(target_vector, val.vector),
                };
            })
            .sort((a, b) => {
                if (a.sim > b.sim) return -1;
                if (a.sim < b.sim) return 1;
                return 0;
            })
            .map(sorted => sorted.content)
            .slice(0, limit);

        return await super.getIndexIncludes(contents);
    }

    async vecRecommendFromLabel(label, limit = 6, co_limit = 100) {
        const vals = await models.Content.findAll({
            limit: co_limit,
            subQuery: false,
            raw: true,
        });

        const contents = vals
            .map(val => {
                return {
                    content: val,
                    sim: vector.cosinesim(label.vector, val.vector),
                };
            })
            .sort((a, b) => {
                if (a.sim > b.sim) return -1;
                if (a.sim < b.sim) return 1;
                return 0;
            })
            .map(sorted => sorted.content)
            .slice(0, limit);

        return await super.getIndexIncludes(contents);
    }

    async vecRecommendFromUser(user, limit = 6, co_limit = 100) {
        const vals = await models.Content.findAll({
            limit: co_limit,
            subQuery: false,
            raw: true,
        });

        const contents = vals
            .map(val => {
                return {
                    content: val,
                    sim: vector.cosinesim(user.vector, val.vector),
                };
            })
            .sort((a, b) => {
                if (a.sim > b.sim) return -1;
                if (a.sim < b.sim) return 1;
                return 0;
            })
            .map(sorted => sorted.content)
            .slice(0, limit);

        return await super.getIndexIncludes(contents);
    }

    async getUserOwnedBaseRelates({ target_content, limit = 6 }) {
        let contents = await this.getNewestContents({
            limit: 50,
            pruned: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        contents = await super
            .getIncludes(contents, {
                upvotes: true,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.UserOwnedBased.value,
            [
                JSON.stringify({
                    target_content,
                    contents: contents.filter(val => !!val),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await super.getIndexIncludes(results.contents.slice(0, limit));
    }

    async getUserViewedBaseRelates({ target_content, limit, offset }) {
        const viewHistories = await models.ViewHistory.findAll({
            include: [
                {
                    model: models.Content,
                    where: {
                        isStory: true,
                        count: {
                            $gte: data_config.disscussion_count_min_limit,
                        },
                        sum_pure_score: {
                            $gte: data_config.disscussion_sum_min_limit,
                        },
                    },
                    attributes: ['id'],
                },
            ],
            raw: true,
            limit: data_config.fetch_data_limit('XL'),
            // offset: Number(offset || 0),
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        target_content = {
            id: target_content.id,
            UserId: target_content.UserId,
        };

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.UserViewedBased.value,
            [
                JSON.stringify({
                    target_content,
                    viewHistories: viewHistories
                        .filter(val => !!val)
                        .map(val => safe2json(val)),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const ids = results.contents.slice(
            offset || 0,
            Number(limit || data_config.fetch_data_limit('S'))
        );
        const contents = await Promise.all(
            ids.map(val =>
                models.Content.findOne({ where: { id: Number(val.id) } })
            )
        );

        return await super.getIndexIncludes(contents);
    }

    async getUserRequestBaseRelates({ target_user, limit, offset }) {
        const requests = await models.Request.findAll({
            where: {
                isAccepted: false,
            },
            attributes: ['id', 'VoterId', 'VoteredId'],
            raw: true,
            limit: data_config.fetch_data_limit('XL'),
            offset: Number(offset || 0),
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.UserRequestBased.value,
            [
                JSON.stringify({
                    target_user,
                    requests: safe2json(
                        requests.filter(val => !!val).map(val => safe2json(val))
                    ),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const ids = results.users.slice(
            offset || 0,
            (limit || data_config.fetch_data_limit('S')) + (offset || 0)
        );

        let users = await Promise.all(
            ids.map(val =>
                models.User.findOne({
                    where: { id: Number(val.id) },
                    raw: true,
                })
            )
        );

        users = await userDataStore.getIncludes(users, {
            contents: true,
            voted_requests: true,
        });

        const contents = await Promise.all(
            users.map(val => super.getIndexIncludes(val.Contents))
        );

        return users.map((val, i) => {
            val.Contents = contents[i];
            return val;
        });
    }

    async getCommunicateRecommends({ target_user, limit, offset }) {
        const datums = await Promise.all([
            models.UpVote.findAll({
                include: [
                    {
                        model: models.Content,
                        where: {
                            isStory: true,
                            count: {
                                $gte: data_config.disscussion_count_min_limit,
                            },
                            sum_pure_score: {
                                $gte: data_config.disscussion_sum_min_limit,
                            },
                        },
                        attributes: ['id'],
                    },
                ],
                attributes: ['id', 'VoterId', 'VotedId'],
                raw: true,
                limit: data_config.fetch_data_limit('XL'),
                offset: Number(offset || 0),
                order: [['created_at', 'DESC']],
            }),
            models.UpVote.findAll({
                where: {
                    voter_id: Number(target_user.id),
                },
                order: [['score', 'DESC']],
                limit: 1,
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.UserUpvoteBased.value,
            [
                JSON.stringify({
                    target_content: datums[1][0] && {
                        id: datums[1][0].VotedId,
                    },
                    upvotes: datums[0].filter(val => !!val),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const ids = results.contents.slice(
            offset || 0,
            (limit || data_config.fetch_data_limit('S')) + (offset || 0)
        );

        let contents = await Promise.all(
            ids.map(val =>
                models.Content.findOne({
                    where: { id: Number(val.id), isRequestWanted: false },
                    raw: true,
                })
            )
        );

        return await this.getCommunicateIncludes(contents);
    }

    async getStaticCommunicateRecommends({ target_user, limit, offset }) {
        const contents = await models.Content.findAll({
            where: {
                isStory: true,
                count: {
                    $gte: data_config.disscussion_count_min_limit,
                },
                sum_pure_score: {
                    $gte: data_config.disscussion_sum_min_limit,
                },
            },
            order: [
                ['created_at', 'DESC'],
                ['sum_pure_score', 'ASC'],
                ['count', 'ASC'],
            ],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getCommunicateIncludes(contents);
    }

    async getDisscussionsFromLabel({ label, limit, offset }) {
        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
            raw: true,
            limit: Number(limit || data_config.fetch_data_limit('S')),
            offset: Number(offset || 0),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents = await Promise.all(
            labelings.map(val =>
                models.Content.findOne({
                    where: {
                        id: Number(val.ContentId),
                    },
                })
            )
        );

        return await this.getCommunicateIncludes(contents);
    }

    async getHottestContents({ target_user, limit, offset }) {}

    async getStaticHottestContents({ limit, offset }) {
        const contents = await models.Content.findAll({
            where: {
                // count: {
                //     $gte: data_config.disscussion_count_min_limit,
                // },
                // sum_pure_score: {
                //     $gte: data_config.disscussion_sum_min_limit,
                // },
                isStory: true,
                isBetterAnswer: false,
            },
            order: [['created_at', 'DESC']],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(contents);
    }

    async getDailySummary({ limit = 5, offset = 0, date = new Date() }) {
        const contents = await models.Content.findAll({
            where: {
                // count: {
                //     $gte: data_config.disscussion_count_min_limit,
                // },
                // sum_pure_score: {
                //     $gte: data_config.disscussion_sum_min_limit,
                // },
                isStory: true,
                isBetterAnswer: false,
                created_at: {
                    $between: [Date.prototype.getOneDayAgo(date), new Date()],
                },
            },
            order: [['sum_score', 'ASC']],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return this.getIndexIncludes(contents);
    }

    async getDailyOpinion({ limit = 5, offset = 0, date = new Date() }) {
        const contents = await models.Content.findAll({
            where: {
                // count: {
                //     $gte: data_config.disscussion_count_min_limit,
                // },
                // sum_pure_score: {
                //     $gte: data_config.disscussion_sum_min_limit,
                // },
                $or: [
                    {
                        isBetterOpinion: true,
                    },
                    {
                        isBetterAnswer: true,
                    },
                ],
                created_at: {
                    $between: [Date.prototype.getOneDayAgo(date), new Date()],
                },
            },
            order: [['sum_score', 'ASC']],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return this.getIndexIncludes(contents);
    }
}
