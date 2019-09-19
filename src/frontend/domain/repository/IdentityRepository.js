import RepositoryImpl from '@repository/RepositoryImpl';
import Cookies from 'js-cookie';
import models from '@network/client_models';

export default class IdentityRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async findOneIdentityRequest(accessToken, client_id) {
        const data = await super.apiCall('/api/v1/identity', {
            accessToken,
            client_id,
        });
        return JSON.parse(data.identity);
    }
}
