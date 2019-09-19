import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import PyShell from '@network/python_shell';
import DataStoreImpl from '@datastore/DataStoreImpl';
import UserDataStore from '@datastore/UserDataStore';
import Promise from 'bluebird';
import safe2json from '@extension/safe2json';
import { ApiError } from '@extension/Error';
import data_config from '@constants/data_config';
import Decimal from 'decimal.js';
import {
    generateLikeQuery,
    generateOrQuery,
    generateOrQueries,
} from '@extension/query';

const userDataStore = new UserDataStore();

export default class LabelDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async search({ keyword, limit, offset }) {
        let like_results = await Promise.all(
            generateLikeQuery(keyword).map(val => {
                return models.Label.findAll({
                    where: {
                        $or: [
                            {
                                title: {
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

        // like_results = await this.getIndexIncludes(like_results);

        return results;
    }

    async updateCount(label) {
        label = await models.Label.findOne({
            where: {
                id: Number(label.id),
            },
        });

        const labelings = await models.Labeling.findAll({
            where: {
                label_id: Number(label.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const contents = await Promise.all(
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

        const result = await label
            .update({
                count: contents.length,
                sum_score: Array.prototype
                    .sumDecimal(contents.map(val => new Decimal(val.sum_score)))
                    .toFixed(data_config.min_decimal_range),
                sum_pure_score: Array.prototype
                    .sumDecimal(
                        contents.map(val => new Decimal(val.sum_pure_score))
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

    async getIncludes(
        datum,
        params = {
            labelings: true,
            label_stocks: true,
            disscussions: false,
        }
    ) {
        let labels = datum.filter(data => !!data);
        const includes = await Promise.map(
            labels,
            val => {
                return Promise.all([
                    params.label_stocks &&
                        models.LabelStock.findAll({
                            where: {
                                label_id: val.id,
                            },
                            raw: true,
                        }),
                    params.labelings &&
                        models.Labeling.findAll({
                            where: {
                                label_id: val.id,
                            },
                            raw: true,
                            limit: data_config.fetch_data_limit('M'),
                        }),
                    params.disscussions &&
                        models.Labeling.findAll({
                            where: {
                                label_id: val.id,
                            },
                            raw: true,
                            limit: data_config.fetch_data_limit('S'),
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

        const stockedUsers = params.label_stocks
            ? await Promise.all(
                  includes.map(async data => {
                      let labelings = data[0];
                      return await Promise.all(
                          labelings.map(labeling => {
                              return models.User.findOne({
                                  where: {
                                      id: labeling.UserId,
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

        const labelingContents = params.labelings
            ? await Promise.all(
                  includes.map(async data => {
                      let labelings = data[1];
                      return await Promise.all(
                          labelings.map(labeling => {
                              return models.Content.findOne({
                                  where: {
                                      id: labeling.ContentId,
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

        const disscussionContents = params.disscussions
            ? await Promise.all(
                  includes.map(async data => {
                      let labelings = data[2];
                      return await Promise.all(
                          labelings.map(labeling => {
                              return models.Content.findOne({
                                  where: {
                                      id: labeling.ContentId,
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
            labels.map(async (val, index) => {
                if (params.label_stocks) {
                    val.LabelStocks = includes[index][0];
                    val.LabelStocks = val.LabelStocks.map((val, i) => {
                        val.User = stockedUsers[index][i];
                        return val;
                    });
                }
                if (params.labelings) {
                    val.Labelings = includes[index][1];
                    val.Labelings = val.Labelings.map((val, i) => {
                        val.Content = labelingContents[index][i];
                        return val;
                    });

                    //MEMO: you should rebuild classes
                    // val.Contents = await contentDataStore.getIndexIncludes(
                    //     labelingContents[index]
                    // );
                    val.Contents = labelingContents[index];
                }
                if (params.disscussions) {
                    val.Labelings = includes[index][2];
                    val.Labelings = val.Labelings.map((val, i) => {
                        val.Content = disscussionContents[index][i];
                        return val;
                    });
                    //MEMO: you should rebuild classes
                    // val.Contents = await contentDataStore.getCommunicateIncludes(disscussionContents[index]);
                    val.Contents = disscussionContents[index];
                }
                return val;
            })
        );
    }

    async getIndexIncludes(datum) {
        return await this.getIncludes(datum, {
            labelings: true,
            label_stocks: false,
        }).catch(e => {
            throw e;
        });
    }

    async findOneLabel({ id }) {
        const label = await models.Label.findOne({
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

        const result = await this.getIncludes([label]);

        return result[0];
    }

    //This method is adapted to create labels on ONLY CONTENT.
    async generateLabel(content) {
        const result = await PyShell.runPython(
            PyShell.PYTHON_METHODS.LabelCreate.value,
            [
                JSON.stringify({
                    contents: [content.toJSON(content)],
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        let titles = [];
        Object.keys(Object.values(result)[0]).forEach(key => {
            titles.push(key);
            if (Object.values(result)[0][key].length > 0)
                titles = titles.concat(Object.values(result)[0][key]);
        }, Object.values(result)[0]);

        let created_labels = [];

        await Promise.map(
            titles,
            async title => {
                const [label, label_created] = await models.Label.findOrCreate({
                    where: {
                        title: title,
                    },
                }).catch(e => {
                    throw new ApiError({
                        error: e,
                        tt_key: 'errors.invalid_response_from_server',
                    });
                });

                await Promise.all([
                    models.Labeling.findOrCreate({
                        where: {
                            content_id: Number(content.id),
                            label_id: Number(label.id),
                            bot: true,
                        },
                    }),
                    label_created
                        ? created_labels.push(label)
                        : async () => {
                              return;
                          },
                ]).catch(e => {
                    throw new ApiError({
                        error: e,
                        tt_key: 'errors.invalid_response_from_server',
                    });
                });
            },
            { concurrency: 8 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        // await this.setLabelVectors(created_labels).catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.invalid_response_from_server',
        //     });
        // });

        return {
            content: content,
        };
    }

    async stock({ user, label }) {
        const results = await Promise.all([
            models.LabelStock.findOrCreate({
                where: {
                    label_id: Number(label.id),
                    user_id: Number(user.id),
                },
            }),
            models.User.findOne({
                where: {
                    id: Number(user.id),
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
            userDataStore.updateVector(
                results[1] ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0),
                label.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0)
            ),
            userDataStore.updateLabelStockVector(
                results[1] ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0),
                label.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0)
            ),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return;
    }

    async unstock({ user, label }) {
        const results = await Promise.all([
            models.LabelStock.destroy({
                where: {
                    LabelId: Number(label.id),
                    UserId: Number(user.id),
                },
            }),
            models.User.findOne({
                where: {
                    id: Number(user.id),
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
            userDataStore.subVector(
                results[1] ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0),
                label.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0)
            ),
            userDataStore.subLabelStockVector(
                results[1] ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0),
                label.vector ||
                    Array.apply(null, Array(data_config.w2v_size)).map(() => 0)
            ),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return;
    }

    async getStockLabels({ user }) {
        const data = await models.LabelStock.findAll({
            where: {
                UserId: Number(user.id),
            },
            raw: true,
            subQuery: false,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await Promise.all(
            data.map(val =>
                models.Label.findOne({
                    where: {
                        id: Number(val.LabelId),
                    },
                    // raw: true,
                    // subQuery: false,
                })
            )
        );

        return results;
    }

    async setLabelVectors(labels) {
        if (!labels) return;
        if (labels.length == 0) return;
        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.LabelVectorize.value,
            [
                JSON.stringify({
                    labels: labels.map(val => safe2json(val)),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updated_labels = await Promise.all(
            labels.map(label => {
                return label.update({
                    vector: results.labels.filter(
                        (result, key) => result.id == label.id
                    )[0].vector,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return updated_labels;
    }
}
