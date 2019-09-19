import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import { DetailModel, DetailModels } from '@entity';
import { browserHistory } from 'react-router';
import { contentShowRoute } from '@infrastructure/RouteInitialize';

export default class RequestRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async initDetail({ id }) {
        const data = await super.apiCall('/api/v1/request', {
            id,
        });
        return data && DetailModels.build(data.request, []);
    }

    async getRequest({ id }) {
        const data = await super.apiCall('/api/v1/request', {
            id,
        });
        return data && data.request;
    }
}
