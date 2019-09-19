import DataStoreImpl from '@datastore/DataStoreImpl';
import Cookies from 'js-cookie';
import models from '@models';
import { ApiError } from '@extension/Error';
import data_config from '@constants/data_config';

export default class IdentityDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async findOneIdentityRequest(username, step) {
        const data = await super.apiCall('/api/v1/identity', {
            step: step,
            username: username,
        });
        return JSON.parse(data.identity);
    }

    async findOneIdentityFromUserName(username, includeUser = false) {
        const identity = await models.Identity.findOne({
            where: {
                username: username,
            },
            include: includeUser ? [models.User] : [],
        });

        return identity;
    }

    async findOneIdentityFromEmail(email, includeUser = false) {
        const identity = await models.Identity.findOne({
            where: {
                email: email,
            },
            include: includeUser ? [models.User] : [],
        });

        return identity;
    }

    async setPassword(password, username) {
        const identity = await this.findOneIdentityFromUserName(username);
        if (identity.password_hash && identity.password_hash != '')
            throw new ApiError({
                error: new Error('Password is already exists'),
                tt_key: 'errors.password_is_already_exists',
            });
        if (
            `${password}`.length < data_config.password_min_limit ||
            `${password}`.length > data_config.password_max_limit
        )
            throw new ApiError({
                error: new Error('password is not correct format'),
                tt_key: 'errors.is_text_min_max_limit',
                tt_params: {
                    data: 'g.password',
                    min: data_config.password_min_limit,
                    max: data_config.password_max_limit,
                },
            });
        const val = await identity.update({
            password: `${password}`,
        });
        return val;
    }
}
