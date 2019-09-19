import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import RecommendDataStore from '@datastore/RecommendDataStore';
// import { ApiError } from '@extension/Error';

const recommendDataStore = new RecommendDataStore();

export default class RecommendHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleNewestRecommendRequest(router, ctx, next) {}

    async handleUserRecommendsRequest(router, ctx, next) {
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
        // if (!wrap_limit) throw new Error('cant get request wrap_limit');
        // if (!section_limit) throw new Error('cant get request section_limit');
        // if (!row_limit) throw new Error('cant get request row_limit');

        const newest_contents = await recommendDataStore.getNewestContents({
            limit: row_limit,
        });

        router.body = {
            success: true,
            homeModels: [
                {
                    items: [
                        {
                            categories: ['新着コンテンツ'],
                            contents: newest_contents,
                            storyContent: null,
                        },
                    ],
                    content: null,
                    key: 0,
                },
            ],
        };
    }

    async handleGetDailyContentsRequest(router, ctx, next) {
        const { limit, offset, date } = router.request.body;

        const contents = await recommendDataStore.getDailySummary({
            limit,
            offset,
            date: new Date(date),
        });

        router.body = {
            success: true,
            contents: contents,
        };
    }

    async handleGetDailyOpinionsRequest(router, ctx, next) {
        const { limit, offset, date } = router.request.body;

        const contents = await recommendDataStore.getDailyOpinion({
            limit,
            offset,
            date: new Date(date),
        });

        router.body = {
            success: true,
            contents: contents,
        };
    }
}
