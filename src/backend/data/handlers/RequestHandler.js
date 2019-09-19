import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { UserDataStore, RequestDataStore, ContentDataStore } from '@datastore';
import safe2json from '@extension/safe2json';

const requestDataStore = new RequestDataStore();
const userDataStore = new UserDataStore();
const contentDataStore = new ContentDataStore();

export default class RequestHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleGetOneRequest(router, ctx, next) {
        const { id } = router.request.body;

        if (!id)
            throw new ApiError({
                error: new Error('Id is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Id' },
            });

        let data = await requestDataStore
            .findOneRequest({
                id,
            })
            .catch(e => {
                throw e;
            });

        if (!data) {
            router.body = {
                success: true,
            };
        }

        data.Content = await contentDataStore.getIndexIncludes([data.Content]);
        data.Content = data.Content[0];

        router.body = {
            success: true,
            request: safe2json(data),
        };
    }

    async handleGetUserRequestFeedsRequest(router, ctx, next) {
        const { user, section_limit, row_limit } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        let user_includes = await userDataStore.getIncludes([user]).catch(e => {
            throw e;
        });

        const contents = await requestDataStore
            .getUserRequestFeeds({
                user: user_includes,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
            follows: user_includes.Follows,
            homeModels: {
                items: [
                    {
                        contents: contents,
                        categories: ['新着'],
                    },
                ],
            },
        };
    }

    async handleHomeRequest(router, ctx, next) {
        const {
            user,
            wrap_limit,
            section_limit,
            row_limit,
            highLight,
        } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const base_users = await Promise.all([
            models.User.findOne({
                where: {
                    id: Number(user.id),
                },
                raw: true,
            }),
            models.User.findAll({
                where: {
                    id: {
                        $notIn: [Number(user.id)],
                    },
                    vector: {
                        $notIn: [
                            Array.apply(null, Array(50))
                                .map(function() {
                                    return 0;
                                })
                                .toString(),
                        ],
                    },
                },
                limit: 100,
                raw: true,
            }),
        ]).catch(e => {
            throw e;
        });

        let results = await userDataStore
            .getUsersSimiliars(base_users[0], base_users[1], section_limit)
            .catch(e => {
                throw e;
            });

        results = await userDataStore.getIncludes(results, {
            upvotes: false,
            downvotes: false,
            contents: true,
            follows: false,
            followers: false,
            vote_requests: false,
            voted_requests: true,
            view_histories: false,
            search_histories: false,
            interests: false,
        });

        const homeModels = results.map((user, index) => {
            return {
                content: safe2json(user),
                items: [
                    {
                        storyContents: [],
                        contents: user.VotedRequests
                            ? user.VotedRequests.map(val =>
                                  safe2json(val)
                              ).slice(0, row_limit)
                            : [],
                        categories: ['評価募集中のリクエスト'],
                    },
                    {
                        storyContents: [],
                        contents: user.Contents
                            ? user.Contents.map(val => safe2json(val)).slice(
                                  0,
                                  row_limit
                              )
                            : [],
                        categories: ['ユーザーの人気コンテンツ'],
                    },
                ],
                key: index + wrap_limit + 1,
            };
        });

        router.body = {
            success: true,
            homeModels: homeModels,
        };
    }
}
