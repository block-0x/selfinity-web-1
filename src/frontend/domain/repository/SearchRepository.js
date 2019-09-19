import RepositoryImpl from '@repository/RepositoryImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import { SearchModels } from '@entity';

export default class SearchRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async searchContent({ keyword, limit, offset, user }) {
        const data = await super.apiCall('/api/v1/search', {
            keyword,
            limit,
            offset,
            user,
        });
        return SearchModels.build(data.contents);
    }

    async searchUser({ keyword, limit, offset, user }) {
        const data = await super.apiCall('/api/v1/user/search', {
            keyword,
            limit,
            offset,
            user,
        });
        return SearchModels.build(data.users);
    }

    async searchLabel({ keyword, limit, offset, user }) {
        const data = await super.apiCall('/api/v1/label/search', {
            keyword,
            limit,
            offset,
            user,
        });
        return SearchModels.build(data.labels);
    }
}
