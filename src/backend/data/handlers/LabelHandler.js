import models from '@models';
import Label from '@models/label';
import {
    ContentDataStore,
    LabelDataStore,
    LabelRecommendDataStore,
    RecommendDataStore,
} from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';
import Promise from 'bluebird';
import { CONTENT_TYPE, SUBMIT_TYPE } from '@entity';
import safe2json from '@extension/safe2json';
import { ApiError } from '@extension/Error';
import data_config from '@constants/data_config';

const labelDataStore = new LabelDataStore();
const contentDataStore = new ContentDataStore();
const labelRecommendDataStore = new LabelRecommendDataStore();
const recommendDataStore = new RecommendDataStore();

export default class LabelHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleGetLabelRequest(router, ctx, next) {
        const { id, limit, offset } = router.request.body;

        if (!id)
            throw new ApiError({
                error: new Error('Id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Id' },
            });

        const label = await labelDataStore.findOneLabel({
            id,
        });

        const contents = await contentDataStore.getLabelingContentsFromLabel({
            limit,
            offset,
            label,
        });

        router.body = {
            success: true,
            label: label,
            contents: contents,
        };
    }

    async handleInitializeLabelsRequest(router, ctx, next) {
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
            throw new Error(e);
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
                    return labelDataStore
                        .generateLabel(result)
                        .then(content => {
                            resolve(content);
                        })
                        .catch(err => {
                            reject(err);
                        });
                });
            },
            { concurrency: 10 }
        ).catch(e => {
            throw new Error(e);
        });

        router.body = {
            contents: datum.map(data => {
                return data.content.toJSON(data.content);
            }),
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

        const results = await models.Label.findAll({
            where: id_range,
        }).catch(e => {
            throw new Error(e);
        });

        if (!results)
            throw new ApiError({
                error: new Error('not exists results'),
                tt_key: 'errors.invalid_response_from_server',
            });

        /*
        10 of concurrency is very confortable to do tasks smoothly.
        */
        const datum = await Promise.map(
            results,
            result => {
                return new Promise((resolve, reject) => {
                    return labelDataStore
                        .setLabelVectors([result])
                        .then(labels => {
                            resolve(labels);
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
            labels: datum.map(data => {
                return data.toJSON(data);
            }),
            success: true,
        };
    }

    async handleStockRequest(router, ctx, next) {
        const { label, user } = router.request.body;

        if (!user) throw new Error('cant get request user');
        if (!label) throw new Error('cant get request label');

        const result = await labelDataStore
            .stock({
                label,
                user,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleUnStockRequest(router, ctx, next) {
        const { label, user } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });
        if (!label)
            throw new ApiError({
                error: new Error('Label is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Label' },
            });

        const result = await labelDataStore
            .unstock({
                label,
                user,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        router.body = {
            success: true,
        };
    }

    async getUserRecommendRequest(router, ctx, next) {
        const { user, limit, offset } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const results = await labelRecommendDataStore
            .getLabelRecommends({
                target_user: user,
                limit,
                offset,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        router.body = {
            success: true,
            labels: results.map(val => safe2json(val)),
        };
    }

    async getUserStaticRecommendRequest(router, ctx, next) {
        const { limit, offset } = router.request.body;

        const results = await labelRecommendDataStore
            .getStaticLabelRecommends({
                limit,
                offset,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        router.body = {
            success: true,
            labels: results.map(val => safe2json(val)),
        };
    }

    async handleGetRelatesRequest(router, ctx, next) {
        const { label, limit, offset } = router.request.body;

        if (!label)
            throw new ApiError({
                error: new Error('label is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.label' },
            });

        const data = await models.Label.findOne({
            where: {
                id: Number(label.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!data) {
            router.body = {
                success: true,
            };
            return;
        }

        const results = await labelRecommendDataStore
            .getLabelLabeingsBaseRelates({
                target_label: safe2json(data),
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            labels: results.map(val => safe2json(val)),
        };
    }

    async handleGetDisscussionsRequest(router, ctx, next) {
        const { label, limit, offset } = router.request.body;

        if (!label)
            throw new ApiError({
                error: new Error('label is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.label' },
            });

        const data = await models.Label.findOne({
            where: {
                id: Number(label.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!data) {
            router.body = {
                success: true,
            };
            return;
        }

        const results = await recommendDataStore
            .getDisscussionsFromLabel({
                label: safe2json(data),
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            contents: results.map(val => safe2json(val)),
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

        const results = await models.Label.findAll({
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
            result => labelDataStore.updateCount(result),
            { concurrency: 10 }
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        router.body = {
            labels: datum.map(data => safe2json(data)),
            success: true,
        };
    }
}
