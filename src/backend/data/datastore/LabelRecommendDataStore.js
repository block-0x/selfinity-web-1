import ContentDataStore from '@datastore/ContentDataStore';
import LabelDataStore from '@datastore/LabelDataStore';
import UserDataStore from '@datastore/UserDataStore';
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
const contentDataStore = new ContentDataStore();

export default class LabelRecommendDataStore extends LabelDataStore {
    constructor() {
        super();
    }

    async getLabelRecommends({ target_user, limit, offset }) {
        const datums = await Promise.all([
            models.Interest.findAll({
                attributes: ['id', 'LabelId', 'UserId'],
                include: [
                    {
                        model: models.Label,
                        where: {
                            count: {
                                $gte: data_config.topic_count_min_limit,
                            },
                            sum_pure_score: {
                                $gte: data_config.topic_sum_min_limit,
                            },
                        },
                        attributes: [],
                    },
                ],
                order: [['created_at', 'DESC']],
                raw: true,
                limit: data_config.fetch_data_limit('XL'),
                offset: Number(offset || 0),
            }),
            models.Interest.findAll({
                attributes: [
                    'label_id',
                    'LabelId',
                    [
                        Sequelize.fn('count', Sequelize.col('label_id')),
                        'LabelIdCount',
                    ],
                ],
                limit: data_config.fetch_data_limit('XL'),
                group: ['label_id'],
                offset: 0,
            }),
        ]).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.LabelInterestBased.value,
            [
                JSON.stringify({
                    target_label: {
                        id: datums[1].sort((a, b) => {
                            if (a.LabelIdCount > b.LabelIdCount) return -1;
                            if (a.LabelIdCount < b.LabelIdCount) return 1;
                            return 0;
                        })[0].LabelId,
                    },
                    interests: datums[0].filter(val => !!val),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const ids = results.labels.slice(
            offset || 0,
            (limit || data_config.fetch_data_limit('S')) + (offset || 0)
        );

        let labels = await Promise.all(
            ids.map(val =>
                models.Label.findOne({
                    where: { id: Number(val.id) },
                    raw: true,
                })
            )
        );

        return labels;

        // labels = await this.getIncludes(labels, {
        //     labelings: false,
        //     label_stocks: false,
        //     disscussions: true,
        // });

        // return await Promise.all(
        //     labels.map(async (label, index) => {
        //         label.Contents = await contentDataStore.getCommunicateIncludes(label.Contents);
        //         val.Labelings = val.Labelings.map((val, i) => {
        //             val.Content = label.Contents[index][i];
        //             return val;
        //         });
        //     })
        // )
    }

    async getStaticLabelRecommends({ limit, offset }) {
        const labels = await models.Label.findAll({
            where: {
                count: {
                    $gte: data_config.topic_count_min_limit,
                },
                sum_pure_score: {
                    $gte: data_config.topic_sum_min_limit,
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

        return labels;

        // labels = await this.getIncludes(labels, {
        //     labelings: false,
        //     label_stocks: false,
        //     disscussions: true,
        // });

        // return await Promise.all(
        //     labels.map(async (label, index) => {
        //         label.Contents = await contentDataStore.getCommunicateIncludes(label.Contents);
        //         val.Labelings = val.Labelings.map((val, i) => {
        //             val.Content = label.Contents[index][i];
        //             return val;
        //         });
        //     })
        // )
    }

    async getLabelLabeingsBaseRelates({ target_label, limit, offset }) {
        const labelings = await models.Labeling.findAll({
            attributes: ['label_id', 'LabelId', 'content_id', 'ContentId'],
            include: [
                {
                    model: models.Label,
                    where: {
                        count: {
                            $gte: data_config.topic_count_min_limit,
                        },
                        sum_pure_score: {
                            $gte: data_config.topic_sum_min_limit,
                        },
                    },
                    attributes: [],
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

        target_label = {
            id: target_label.id,
        };

        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.LabelLabelingBased.value,
            [
                JSON.stringify({
                    target_label,
                    labelings: labelings
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

        const ids = results.labels.slice(
            offset || 0,
            limit || data_config.fetch_data_limit('S')
        );
        const labels = await Promise.all(
            ids.map(val =>
                models.Label.findOne({ where: { id: Number(val.id) } })
            )
        );

        return labels; //await super.getIndexIncludes(contents);
    }
}
