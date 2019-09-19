import DataStoreImpl from '@datastore/DataStoreImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import Promise from 'bluebird';
import PyShell from '@network/python_shell';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import { ApiError } from '@extension/Error';

export default class RequestDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async getIndexIncludes(datum) {
        return await this.getIncludes(datum, {
            voter: true,
            upvotes: true,
            downvotes: true,
            content: false,
            target_user: true,
        });
    }

    async getIncludes(
        datum,
        params = {
            voter: true,
            upvotes: true,
            downvotes: true,
            content: true,
            target_user: true,
        }
    ) {
        let requests = datum.filter(data => !!data);
        const includes = await Promise.map(
            requests,
            val => {
                return Promise.all([
                    params.voter &&
                        models.User.findOne({
                            where: {
                                id: val.VoterId,
                            },
                            raw: true,
                        }),
                    params.upvotes &&
                        models.RequestUpVote.findAll({
                            where: {
                                voted_id: val.id,
                            },
                            raw: true,
                        }),
                    params.downvotes &&
                        models.RequestDownVote.findAll({
                            where: {
                                voted_id: val.id,
                            },
                            raw: true,
                        }),
                    params.content &&
                        models.Content.findOne({
                            where: {
                                id: val.ContentId,
                            },
                            raw: true,
                        }),
                    params.target_user &&
                        models.User.findOne({
                            where: {
                                id: val.VoteredId,
                            },
                            raw: true,
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

        return requests.map((val, index) => {
            if (params.voter) val.Voter = includes[index][0];
            if (params.upvotes) val.UpVotes = includes[index][1];
            if (params.downvotes) val.DownVotes = includes[index][2];
            if (params.content) {
                val.Content = includes[index][3];
            }
            if (params.target_user) val.TargetUser = includes[index][4];
            return val;
        });
    }

    async findOneRequest({ id }) {
        const data = await models.Request.findOne({
            where: {
                id: Number(id),
            },
            raw: true,
        });

        const request_data = await this.getIncludes([data]);

        return request_data[0];
    }

    async getUserRequests({ user_id, offset, limit, isPrivate }) {
        const results = await models.Request.findAll({
            where: {
                votered_id: Number(user_id),
                isPrivate,
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

    async getUserSendRequests({ user_id, offset, limit }) {
        const results = await models.Request.findAll({
            where: {
                voter_id: Number(user_id),
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

    async getUserSolvedRequests({ user_id, offset, limit }) {
        const results = await models.Request.findAll({
            where: {
                votered_id: Number(user_id),
                isAccepted: true,
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

    async getUserUnSolvedRequests({ user_id, offset, limit }) {
        const results = await models.Request.findAll({
            where: {
                votered_id: Number(user_id),
                isAccepted: false,
            },
            order: [['bid_amount', 'DESC']],
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

    async getUserRequestFeeds({ user }) {
        const follow_contents = await Promise.all(
            user.Follows.map(follow => {
                return this.newestRequestsFromUser(follow);
            })
        );

        return follow_contents.slice(0, 54);
    }

    async newestRequestsFromUser(user, limit = 10) {
        const requests = await models.Request.findAll({
            where: {
                votered_id: Number(user.id),
            },
            limit,
            order: [['created_at', 'DESC']],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return await this.getIndexIncludes(contents);
    }

    async setRequestVectors(requests) {
        const results = await PyShell.runPython(
            PyShell.PYTHON_METHODS.TextVectorize.value,
            [
                JSON.stringify({
                    contents: requests.map(val => safe2json(val)),
                }),
            ]
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const updated_requests = await Promise.all(
            requests.map(request => {
                return request.update({
                    vector: results.contents.filter(
                        (result, key) => result.id == request.id
                    )[0].vector,
                });
            })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
        return updated_requests;
    }

    async setAssigns(content) {
        if (!content) return;
        if (!Number.prototype.castBool(content.isAssign) || !content.id) return;

        const assigns = content.Assigns;
        if (!assigns) return;

        const deleted = await Promise.all(
            assigns
                .filter(assign => !!assign)
                .filter(assign => !!assign.id)
                .map(assign =>
                    models.Request.destroy({
                        where: {
                            id: assign.id,
                        },
                    })
                )
        );

        const results = await Promise.all(
            assigns
                .filter(assign => !!assign)
                .filter(assign => !assign.id)
                .map(assign =>
                    models.Request.create({
                        voter_id: content.UserId,
                        votered_id: assign.VoteredId,
                        assign_id: content.id,
                        isAssign: true,
                        title: '',
                        body: '',
                        isPrivate: Number.prototype.castBool(content.isPrivate),
                    })
                )
        );
    }
}
