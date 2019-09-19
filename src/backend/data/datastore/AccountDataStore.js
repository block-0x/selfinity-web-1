import DataStoreImpl from '@datastore/DataStoreImpl';
import Cookies from 'js-cookie';
import models from '@models';

export default class AccountDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async findOneAccountRequest({
        UserId,
        name,
        first_name,
        last_name,
        birthday,
        address,
        gender,
        // owner_private_key,
        active_key,
        posting_key,
        memo_key,
        permission,
    }) {
        const data = await super.apiCall('/api/v1/account', {
            UserId,
            name,
            first_name,
            last_name,
            birthday,
            address,
            gender,
            // owner_private_key,
            active_key,
            posting_key,
            memo_key,
            permission,
        });
        return JSON.parse(data.identity);
    }

    async findOneAccount({
        UserId,
        name,
        first_name,
        last_name,
        birthday,
        address,
        gender,
        // owner_private_key,
        active_key,
        posting_key,
        memo_key,
        permission,
    }) {
        const account = await models.Account.findOne({
            where: {
                UserId: Number(UserId),
                name,
                first_name,
                last_name,
                birthday,
                address,
                gender,
                // owner_private_key,
                active_key,
                posting_key,
                memo_key,
                permission,
            },
        });

        return account;
    }
}
