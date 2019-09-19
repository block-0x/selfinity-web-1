import DataStoreImpl from '@datastore/DataStoreImpl';
import LabelDataStore from '@datastore/LabelDataStore';
import UserDataStore from '@datastore/UserDataStore';
import RequestDataStore from '@datastore/RequestDataStore';
import NotificationDataStore from '@datastore/NotificationDataStore';
import Cookies from 'js-cookie';
import models from '@models';
import { CONTENT_TYPE, SUBMIT_TYPE, ACTION_TYPE } from '@entity';
import User from '@models/user';
import Content from '@models/content';
import {
    generateLikeQuery,
    generateOrQuery,
    generateOrQueries,
} from '@extension/query';
import Promise from 'bluebird';
import PyShell from '@network/python_shell';
import data_config from '@constants/data_config';
import { ApiError } from '@extension/Error';
import {
    apiCreateLabelValidates,
    apiCreateContentValidates,
    apiDestroyContentValidates,
} from '@validations/content';
import content_path from '@network/content_path';
import Decimal from 'decimal.js';

const labelDataStore = new LabelDataStore();
const userDataStore = new UserDataStore();
const requestDataStore = new RequestDataStore();
const notificationDataStore = new NotificationDataStore();

export default class ContentDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    checkAction(action) {
        switch (action) {
            case ACTION_TYPE.LIKE.value:
            case ACTION_TYPE.LIKE.rawValue:
            case ACTION_TYPE.REPOST.value:
            case ACTION_TYPE.REPOST.rawValue:
            case ACTION_TYPE.POST.value:
            case ACTION_TYPE.POST.rawValue:
            case ACTION_TYPE.IMPORT.value:
            case ACTION_TYPE.IMPORT.rawValue:
                return true;
                break;
            default:
                throw new ApiError({
                    error: new Error('action is not correct'),
                    tt_key: 'errors.action_is_not_correct',
                    tt_params: { action },
                });
        }
    }

    async updateCount(content) {
        content = await models.Content.findOne({
            where: {
                id: content.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents = await models.Content.findAll({
            where: {
                path: {
                    $like: `${content.path}/%`,
                },
            },
            attributes: [
                'id',
                'score',
                'pure_score',
                'isBetterOpinion',
                'isCheering',
                'isBetterAnswer',
            ],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const children = await models.UpVote.findAll({
            where: {
                voted_id: content.id,
            },
            attributes: [
                'id',
                'isBetterOpinion',
                'isBetterAnswer',
                'isCheering',
            ],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        contents.push(content);

        const result = await content
            .update({
                count: contents.length,
                good_opinion_count: children.filter(
                    val =>
                        Number.prototype.castBool(val.isBetterOpinion) ||
                        Number.prototype.castBool(val.isBetterAnswer)
                ).length,
                cheering_count: children.filter(val =>
                    Number.prototype.castBool(val.isCheering)
                ).length,
                sum_score: Array.prototype
                    .sumDecimal(contents.map(val => new Decimal(val.score)))
                    .toFixed(data_config.min_decimal_range),
                sum_pure_score: Array.prototype
                    .sumDecimal(
                        contents.map(val => new Decimal(val.pure_score))
                    )
                    .toFixed(data_config.min_decimal_range),
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async updateCountsFromContent(content) {
        if (!content) return;
        const path = content.path;
        if (!path || path == '') return;

        const contents = await models.Content.findAll({
            where: {
                id: {
                    $in: content_path.getIds(path),
                },
            },
            attributes: ['id', 'path', 'score', 'pure_score'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await Promise.map(
            contents,
            val => this.updateCount(val),
            { concurrency: data_config.concurrency_size('L') }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async createContent(content) {
        if (!!content.Labels) {
            await Promise.all(
                content.Labels.map(
                    async label =>
                        await apiCreateLabelValidates.isValid({
                            label,
                        })
                )
            ).catch(e => {
                throw e;
            });
        }

        content.last_payout_at = content.createdAt;

        await apiCreateContentValidates
            .isValid({
                content,
                UserId: content.UserId,
            })
            .catch(e => {
                throw e;
            });

        let result = await models.Content.create(content).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.cant_created_with_error',
                tt_params: { content, e },
            });
        });

        if (!result)
            throw new ApiError({
                error: new Error("couldn't created request content"),
                tt_key: 'errors.cant_created',
                tt_params: { content },
            });

        await content_path.setPath(result).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        content.id = result.id;

        const datum = await Promise.all([
            this.saveLabels(content),
            this.saveRequests(content),
            null, // labelDataStore.generateLabel(result),
            null, // this.setContentVectors([result]),
            models.User.findOne({
                where: {
                    id: Number(content.UserId),
                },
                raw: false,
            }),
            notificationDataStore.onOpinionCreate(result),
            notificationDataStore.onStoryCreate(result),
            this.updateCountsFromContent(result),
            // requestDataStore.setAssigns(content),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await notificationDataStore.onAnswerCreate(result);

        const include_labels = await this.getIncludes([content], {
            labels: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const user = datum[4];

        // const update_vec_content = await Promise.all([
        //     userDataStore.updateVector(user, datum[3][0].vector),
        //     userDataStore.updatePostVector(user, datum[3][0].vector),
        // ]).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        await this.create_interest(
            user,
            include_labels[0],
            ACTION_TYPE.Post.value
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return content;
    }

    async deleteContent(content) {
        await apiDestroyContentValidates.isValid({ content });
        const result = await models.Content.destroy({
            where: {
                id: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async updateContent(content) {
        if (!!content.Labels) {
            await Promise.all(
                content.Labels.map(
                    async label =>
                        await apiCreateLabelValidates.isValid({
                            label,
                        })
                )
            ).catch(e => {
                throw e;
            });
        }

        await apiCreateContentValidates
            .isValid({
                content,
                UserId: content.UserId,
            })
            .catch(e => {
                throw e;
            });

        let data = await models.Content.findOne({
            where: {
                id: Number(content.id),
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId),
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        data = await this.getIncludes([data]);
        data = data[0];

        // const delete_before_datum = await Promise.all([
        //     userDataStore.subVector(user, data.vector),
        //     userDataStore.subPostVector(user, data.vector),
        //     this.delete_interest(user, data, ACTION_TYPE.Post.value),
        // ]).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        data.title = content.title;
        data.body = content.body;

        if (!data)
            throw new ApiError({
                error: e,
                tt_key: 'errors.not_exists',
                tt_params: { content: data },
            });

        const result = await Promise.all([
            data.update({
                title: content.title,
                body: content.body,
                isCheering: content.isCheering,
                isOpinionWanted: content.isOpinionWanted,
                isRequestWanted: content.isRequestWanted,
                isPrivate: content.isPrivate,
            }),
            this.updateLabelings(content),
            // labelDataStore.generateLabel(data),
            // this.setContentVectors([data]),
            this.updateCountsFromContent(content),
            requestDataStore.setAssigns(content),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        let updated_data = await models.Content.findOne({
            where: {
                id: Number(content.id),
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        updated_data = await this.getIncludes([updated_data]);
        updated_data = updated_data[0];

        // const update_vec_content = await Promise.all([
        //     userDataStore.updateVector(user, updated_data.vector),
        //     userDataStore.updatePostVector(user, updated_data.vector),
        //     this.create_interest(user, updated_data, ACTION_TYPE.Post.value),
        // ]).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        return updated_data;
    }

    async saveLabels(content) {
        let created_labels = [];

        const labels = await Promise.all(
            content.Labels.filter(item => !!item)
                .filter(item => !!item.title && item.title != '')
                .map(async label => {
                    return await models.Label.findOrCreate({
                        where: {
                            title: label.title,
                        },
                    }).spread(async (label, label_created) => {
                        await Promise.all([
                            models.Labeling.findOrCreate({
                                where: {
                                    content_id: Number(content.id),
                                    label_id: Number(label.id),
                                    bot: false,
                                },
                            }),
                            label_created && created_labels.push(label),
                        ]);
                        return label;
                    });
                })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await Promise.all(
            labels.map(val => labelDataStore.updateCount(val))
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        // await labelDataStore.setLabelVectors(created_labels).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        return;
    }

    async getLabelingContentsFromLabel({ label, limit, offset }) {
        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
            raw: true,
            limit: Number(limit || data_config.fetch_data_limit('M')),
            offset: Number(offset || 0),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const labelingContents = await Promise.all(
            labelings.map(labeling =>
                models.Content.findOne({
                    where: {
                        id: Number(labeling.ContentId),
                    },
                    raw: true,
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(labelingContents);
    }

    async updateLabelings(content) {
        const before_labels = await models.Labeling.findAll({
            where: {
                content_id: Number(content.id),
                bot: false,
            },
            raw: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const delete_results = await Promise.all(
            before_labels.map(val =>
                models.Labeling.destroy({
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

        await this.saveLabels(content);
        return;
    }

    async saveRequests(content) {
        if (!content.Requests) return;
        const requests = await Promise.map(
            content.Requests,
            val =>
                models.Request.findOne({
                    where: {
                        id: Number(val.id),
                        isAnswered: false,
                    },
                }),
            { concurrency: 30 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await Promise.map(
            requests,
            request =>
                !!request &&
                request.update({
                    isAnswered: true,
                    content_id: content.id,
                }),
            { concurrency: 30 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return;
    }

    async setContentVectors(contents) {
        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.TextVectorize.value,
            [
                JSON.stringify({
                    contents: contents.map(val => val.toJSON(val)),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updated_contents = await Promise.all(
            contents.map(content => {
                return content.update({
                    vector: results.contents.filter(
                        (result, key) => result.id == content.id
                    )[0].vector,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return updated_contents;
    }

    async getIncludes(
        datum,
        params = {
            user: true,
            upvotes: true,
            downvotes: true,
            labels: true,
            label_bot: false,
            children: true,
            requests: true,
            parent: true,
            communicates: false,
            flatten: false,
        }
    ) {
        let contents = datum.filter(data => !!data);
        const includes = await Promise.map(
            contents,
            val => {
                return Promise.all([
                    params.user &&
                        models.User.findOne({
                            where: {
                                id: val.UserId,
                            },
                            raw: true,
                        }),
                    params.upvotes &&
                        models.UpVote.findAll({
                            where: {
                                voted_id: val.id,
                            },
                            raw: true,
                        }),
                    params.downvotes &&
                        models.DownVote.findAll({
                            where: {
                                voted_id: val.id,
                            },
                            raw: true,
                        }),
                    params.labels &&
                        models.Labeling.findAll({
                            where: {
                                content_id: val.id,
                                bot: !params.label_bot && false,
                            },
                            raw: true,
                        }),
                    params.children &&
                        models.Content.findAll({
                            where: {
                                parent_id: val.id,
                            },
                            raw: true,
                            limit: data_config.fetch_data_limit('M'),
                        }),
                    params.requests &&
                        models.Request.findAll({
                            where: {
                                content_id: val.id,
                            },
                            raw: true,
                        }),
                    params.parent
                        ? models.Content.findOne({
                              where: {
                                  id: val.ParentId,
                              },
                              raw: true,
                          })
                        : models.Content.findOne({
                              where: {
                                  id: val.ParentId,
                              },
                              attributes: ['id', 'user_id'],
                              raw: true,
                          }),
                    params.communicates &&
                        models.Content.findAll({
                            where: {
                                path: {
                                    $like: `${content_path.getRootId(
                                        val.path
                                    )}%`,
                                },
                            },
                            raw: true,
                            limit: data_config.fetch_data_limit('S'),
                            order: [['created_at', 'ASC']],
                        }),
                    params.flatten &&
                        models.Content.findAll({
                            where: {
                                path: {
                                    $like: `${val.path}/%`,
                                },
                            },
                            raw: true,
                            limit: data_config.fetch_data_limit('M'),
                            order: [['created_at', 'ASC']],
                        }),
                ]);
            },
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const labels = params.labels
            ? await Promise.all(
                  includes.map(async data => {
                      let labelings = data[3];
                      return await Promise.all(
                          labelings.map(labeling => {
                              return models.Label.findOne({
                                  where: {
                                      id: labeling.LabelId,
                                  },
                                  raw: true,
                              });
                          })
                      );
                  })
              ).catch(e => {
                  throw new ApiError({
                      error: e,
                      tt_key: 'errors.invalid_response_from_server',
                  });
              })
            : [];

        return await Promise.all(
            contents.map(async (val, index) => {
                if (params.user) val.User = includes[index][0];
                if (params.upvotes) val.UpVotes = includes[index][1];
                if (params.downvotes) val.DownVotes = includes[index][2];
                if (params.labels) {
                    val.Labelings = includes[index][3];
                    val.Labelings = val.Labelings.map((val, i) => {
                        val.Label = labels[index][i];
                        return val;
                    });
                }
                if (params.children) {
                    val.children_contents = await this.getIndexIncludes(
                        includes[index][4]
                    );
                }
                if (params.requests) {
                    val.Requests = await requestDataStore.getIndexIncludes(
                        includes[index][5]
                    );
                }
                if (params.parent) {
                    val.ParentContent = await this.getIndexIncludes([
                        includes[index][6],
                    ]);
                    val.ParentContent = val.ParentContent[0];
                } else {
                    val.ParentContent = includes[index][6];
                    if (val.ParentContent) {
                        val.ParentContent.UserId = val.ParentContent.UserId;
                    }
                }
                if (params.communicates) {
                    val.children_contents = await this.getIndexIncludes(
                        includes[index][7]
                    );
                }
                if (params.flatten) {
                    val.children_contents = await this.getIndexIncludes(
                        includes[index][8]
                    );
                }
                return val;
            })
        );
    }

    async getIndexIncludes(datum) {
        return await this.getIncludes(datum, {
            user: true,
            upvotes: true,
            downvotes: false,
            labels: true,
            children: false,
            requests: false,
            parent: true,
        });
    }

    async getCommunicateIncludes(datum) {
        return await this.getIncludes(datum, {
            user: true,
            upvotes: false,
            downvotes: false,
            labels: true,
            children: true,
            requests: true,
            communicates: true,
        });
    }

    async findOneContent({ id }) {
        const result = await models.Content.findOne({
            where: {
                id: Number(id),
            },
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const datum = await this.getIncludes([result], {
            user: true,
            upvotes: true,
            downvotes: true,
            labels: true,
            label_bot: false,
            children: false,
            requests: true,
            parent: true,
            communicates: false,
            flatten: true,
        });

        return datum[0];
    }

    async getUserHistoryContents({ user_id }) {
        const histories = await models.ViewHistory.findAll({
            where: {
                user_id: Number(user_id),
            },
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await Promise.all(
            histories.map(val =>
                models.Content.findOne({
                    where: {
                        id: Number(val.ContentId),
                    },
                    raw: true,
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(results);
    }

    async getUserContents({
        user_id,
        offset,
        limit,
        isMyAccount,
        isRequestWanted,
        isOpinionWanted,
    }) {
        const where = isMyAccount
            ? {
                  user_id: Number(user_id),
                  isRequestWanted,
                  isOpinionWanted,
              }
            : {
                  user_id: Number(user_id),
                  isPrivate: false,
                  isRequestWanted,
                  isOpinionWanted,
              };

        const results = await models.Content.findAll({
            where,
            order: [['created_at', 'DESC']],
            raw: true,
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')),
            subQuery: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(results);
    }

    async getComments({ content, offset, limit }) {
        const results = await models.Content.findAll({
            where: {
                path: {
                    $like: `${content.path}/%`,
                },
            },
            raw: true,
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('M')),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIncludes(results);
    }

    async getUserFeeds({ user, offset, limit }) {
        let labeling_content_ids = await Promise.all(
            user.LabelStocks.map(stock => {
                return this.getContentIdsFromLabel(stock.Label);
            })
        );

        labeling_content_ids = Array.prototype.concat.apply(
            [],
            labeling_content_ids
        );

        let following_user_ids = user.Follows.map(follow => follow.id);

        const results = await models.Content.findAll({
            where: {
                $or: generateOrQueries([
                    {
                        key: 'id',
                        values: labeling_content_ids,
                    },
                    {
                        key: 'user_id',
                        values: following_user_ids,
                    },
                ]),
            },
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')) / 2,
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const newests = await models.Content.findAll({
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')) / 2,
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return this.getCommunicateIncludes(results.concat(newests));
    }

    async getFeeds({ offset, limit, isCommunicates = true }) {
        const newests = await models.Content.findAll({
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')) / 2,
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return isCommunicates
            ? this.getCommunicateIncludes(newests)
            : this.getIndexIncludes(newests);
    }

    async getUserComments({ user_id, offset, limit }) {
        const results = await models.Content.findAll({
            where: {
                user_id: Number(user_id),
                parent_id: {
                    $ne: null,
                },
            },
            order: [['created_at', 'DESC']],
            raw: true,
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(results);
    }

    async getUserWanteds({ user_id, offset, limit }) {
        const results = await models.Content.findAll({
            where: {
                user_id: Number(user_id),
                $or: [
                    {
                        isRequestWanted: true,
                    },
                    {
                        isOpinionWanted: true,
                    },
                ],
            },
            order: [['created_at', 'DESC']],
            raw: true,
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('L')),
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return await this.getIndexIncludes(results);
    }

    async relatesBasedContent({ content, limit = 10 }) {
        //TODO: set correctly.
        const results = await this.getNewestContents({
            limit: 10,
            offset: 10,
        });

        return results;
    }

    async getNewestContents({ limit, offset, pruned = false }) {
        let results = await models.Content.findAll({
            limit: Number(limit || data_config.fetch_data_limit('L')),
            raw: true,
            offset: Number(offset || 0),
            order: [['created_at', 'DESC']],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return pruned ? results : await this.getIndexIncludes(results);
    }

    async search({ keyword, limit, offset }) {
        let like_results = await Promise.all(
            generateLikeQuery(keyword).map(val => {
                return models.Content.findAll({
                    where: {
                        $or: [
                            {
                                title: {
                                    $like: val,
                                },
                            },
                            {
                                body: {
                                    $like: val,
                                },
                            },
                        ],
                    },
                    offset: Number(offset || 0),
                    limit: Number(limit || data_config.fetch_data_limit('M')),
                    raw: true,
                    // order: [['score', 'DESC']],
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        like_results = Array.prototype.concat.apply([], like_results);

        const results = [];
        const map = new Map();
        for (const item of like_results) {
            if (!map.has(item.id)) {
                map.set(item.id, true);
                results.push(item);
            }
        }

        return await this.getIndexIncludes(results);
    }

    async create_search_hisotry(user, title) {
        const result = await models.SearchHistory.create({
            UserId: user.id,
            title,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async delete_search_hisotry(user, title) {
        const result = await models.SearchHistory.destroy({
            where: {
                UserId: Number(user.id),
                title,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async createHomeLabelOnLabelMultCounts(user, limit = 4) {
        const interests = await models.Interest.findAll({
            where: {
                UserId: Number(user.id),
            },
            include: [models.Label],
        });

        let labels_mul_count = [];
        interests.map(interest => {
            const label_id = interest.LabelId;
            let label_poli_count = labels_mul_count.filter(
                ele => ele.id == label_id
            )[0];
            let index = labels_mul_count.indexOf(label_poli_count);
            if (label_poli_count && index != -1) {
                label_poli_count.count += 1;
                labels_mul_count[index] = label_poli_count;
            } else {
                labels_mul_count.push({ id: label_id, count: 1 });
            }
        });

        labels_mul_count.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
        });

        let homeLabels = await Promise.all(
            labels_mul_count.map((ele, index) => {
                return models.HomeLabel.findOrCreate({
                    where: {
                        user_id: Number(user.id),
                        label_id: Number(ele.id),
                    },
                    include: [models.Label, models.User],
                });
            })
        );
        const results = homeLabels.slice(0, limit + 1);
        return results.map(val => {
            return val[0];
        });
    }

    async getContentIdsFromLabel(label) {
        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
            // limit: Number(limit || data_config.fetch_data_limit('L')),
            // offset: Number(offset || 0),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'invalid_response_from_server',
            });
        });

        return labelings.map(labeling => labeling.ContentId);
    }

    async newestContentsFromLabel(label, limit, offset) {
        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
            limit: Number(limit || data_config.fetch_data_limit('L')),
            offset: Number(offset || 0),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        const vals = await Promise.all(
            labelings.map(labeling => {
                return models.Content.findOne({
                    where: {
                        id: Number(labeling.ContentId),
                    },
                    subQuery: false,
                    raw: true,
                    order: [['score', 'DESC']],
                });
            })
        );
        return vals; //await this.getIncludes(vals);
    }

    async newestContentsFromUser(user, limit, offset) {
        const contents = await models.Content.findAll({
            where: {
                user_id: Number(user.id),
            },
            limit: Number(limit || data_config.fetch_data_limit('L')),
            offset: Number(offset || 0),
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return contents; //await this.getIncludes(contents);
    }

    async staticRecommendFromLabel(label, limit = 6) {
        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const vals = await Promise.all(
            labelings.map(labeling => {
                return models.Content.findOne({
                    where: {
                        id: Number(labeling.ContentId),
                    },
                    limit: Number(limit),
                    subQuery: false,
                    raw: true,
                    order: [['score', 'DESC']],
                });
            })
        );

        return await this.getIndexIncludes(vals);
    }

    async staticRecommendFromLabels(labels, section_limit = 1, row_limit = 6) {
        return await Promise.all(
            labels.map(label => {
                return self.staticRecommendFromLabel(
                    labels,
                    section_limit,
                    row_limit
                );
            })
        );
    }

    async create_interest(user, content, action) {
        const results = await Promise.all(
            content.Labelings.map(labeling => {
                //TODO: findOrCreate or Create ...?
                return models.Interest.create({
                    LabelId: labeling.Label.id,
                    user_id: user.id,
                    action: action instanceof String ? action : action.value,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return results;
    }

    async delete_interest(user, content, action) {
        const results = await Promise.all(
            content.Labelings.map(labeling => {
                return models.Interest.destroy({
                    where: {
                        LabelId: Number(labeling.Label.id),
                        UserId: Number(user.id),
                        action:
                            action instanceof String ? action : action.value,
                    },
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return results;
    }

    async update_interest(user, content, action) {
        await this.delete_interest(user, content, action);
        await this.create_interest(user, content, action);
    }

    async create_view_history({ user, content }) {
        const result = await models.ViewHistory.create({
            user_id: user.id,
            content_id: content.id,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents_data = await this.getIncludes([content]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const interests = await this.create_interest(
            user,
            contents_data[0],
            ACTION_TYPE.View.value
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

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
            userDataStore.updateViewVector(
                user_instance,
                contents_data[0].vector
            ),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }

    async delete_view_history({ user, content }) {
        const result = await models.ViewHistory.destroy({
            where: {
                UserId: Number(user.id),
                ContentId: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents_data = await this.getIncludes([content]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const interests = await this.delete_interest(
            user,
            contents_data[0],
            ACTION_TYPE.View.value
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return result;
    }
}
