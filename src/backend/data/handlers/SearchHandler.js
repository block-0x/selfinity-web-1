import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { ContentDataStore, LabelDataStore, UserDataStore } from '@datastore';
import Content from '@models/content';

const contentDataStore = new ContentDataStore();
const labelDataStore = new LabelDataStore();
const userDataStore = new UserDataStore();

export default class SearchHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleSearchRequest(router, ctx, next) {
        const { keyword, limit, offset, user } = router.request.body;

        const contents = await contentDataStore
            .search({
                keyword,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        if (!offset || offset == 0) {
            const result = await models.SearchHistory.create({
                user_id: user && user.id,
                title: keyword,
                table_name: 'contents',
            }).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
        }

        router.body = {
            contents,
            success: true,
        };
    }

    async handleSearchUserRequest(router, ctx, next) {
        const { keyword, limit, offset, user } = router.request.body;

        const users = await userDataStore
            .search({
                keyword,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        if (!offset || offset == 0) {
            const result = await models.SearchHistory.create({
                user_id: user && user.id,
                title: keyword,
                table_name: 'users',
            }).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
        }

        router.body = {
            users,
            success: true,
        };
    }

    async handleSearchLabelRequest(router, ctx, next) {
        const { keyword, limit, offset, user } = router.request.body;

        const labels = await labelDataStore
            .search({
                keyword,
                limit,
                offset,
            })
            .catch(e => {
                throw e;
            });

        if (!offset || offset == 0) {
            const result = await models.SearchHistory.create({
                user_id: user && user.id,
                title: keyword,
                table_name: 'labels',
            }).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
        }

        router.body = {
            labels,
            success: true,
        };
    }
}
