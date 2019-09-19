import ContentRepository from '@repository/ContentRepository';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';

export default class RecommendRepository extends ContentRepository {
    constructor() {
        super();
    }

    async getRecommend({
        user,
        wrap_limit = 4,
        section_limit = 3,
        row_limit = 6,
    }) {
        const data = await super.apiCall('/api/v1/recommends', {
            wrap_limit,
            section_limit,
            row_limit,
            user: safe2json(user),
            highLight: true,
        });

        return data;
    }
}
