import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { ContentDataStore } from '@datastore';

const contentDataStore = new ContentDataStore();

export default class HomeLabelHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleGetHomeLabelsRequest(router, ctx, next) {
        const { user, section_limit, row_limit } = router.request.body;

        if (!user)
            throw new ApiError({
                error: new Error('User is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User' },
            });

        const homeLabels = await contentDataStore
            .createHomeLabelOnLabelMultCounts(user)
            .catch(e => {
                throw new Error(e);
            });

        router.body = {
            success: true,
            homeLabels: homeLabels.map(val => {
                return val.toJSON(val);
            }),
        };
    }
}
