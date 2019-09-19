import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import safe2json from '@extension/safe2json';
import { DetailModels, HomeModels } from '@entity';
import data_config from '@constants/data_config';

export default class LabelRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async getDetail({ id, limit, offset }) {
        const data = await super.apiCall('/api/v1/label', {
            id,
            limit,
            offset,
        });

        return DetailModels.build(data.label, data.contents);
    }

    async getCustomizeIndex({ user, section_limit = 3, row_limit = 6 }) {
        const data = await super.apiCall('/api/v1/home_labels', {
            section_limit,
            row_limit,
            user: safe2json(user),
        });

        return data;
    }

    async stock(user, label) {
        const data = await super.apiCall('/api/v1/label/stock', {
            label: safe2json(label),
            user: safe2json(user),
        });
        return data;
    }

    async unstock(user, label) {
        const data = await super.apiCall('/api/v1/label/unstock', {
            label: safe2json(label),
            user: safe2json(user),
        });
        return data;
    }

    async getTrend({ user, limit = data_config.trend_limit, offset }) {
        const data = await super.apiCall('/api/v1/labels/recommend', {
            user,
            limit,
            offset,
        });

        return data && data.labels;
    }

    async getTrendContent({ label, limit, offset }) {
        const data = await super.apiCall('/api/v1/label/contents/trend', {
            label,
            limit,
            offset,
        });

        return data && HomeModels.build(data.contents);
    }

    async getStaticTrend({ limit = data_config.trend_limit, offset = 0 }) {
        const data = await super.apiCall('/api/v1/labels/static/recommend', {
            limit,
            offset,
        });

        return data && data.labels;
    }

    async getRelate({ label, limit = data_config.relate_limit, offset }) {
        const data = await super.apiCall('/api/v1/label/recommend', {
            label,
            limit,
            offset,
        });

        return data && data.labels;
    }
}
