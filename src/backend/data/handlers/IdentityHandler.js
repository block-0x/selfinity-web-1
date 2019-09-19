import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import { IdentityDataStore } from '@datastore';
import * as sessionActions from '@redux/Session/SessionReducer';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';
import { apiSetPasswordValidates } from '@validations/auth';

const identityDataStore = new IdentityDataStore();

export default class IdentityHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleFindOneIdentity(router, ctx, next) {
        const {
            email,
            token,
            email_is_verified,
            last_attempt_verify_email,
            phone_number,
            phone_number_is_verified,
            last_attempt_verify_phone_number,
            phone_code_attempts,
            phone_code,
            account_is_created,
            confirmation_code,
            username,
            username_booked_at,
            password_hash,
            password,
            verified,
            bot,
            permission,
            step,
        } = router.request.body;

        let identity = models.Identity.build();

        if (username) {
            identity = await identityDataStore.findOneIdentityFromUserName(
                username
            );
        }

        if (!identity) {
            router.body = {
                success: true,
            };
            return;
        }

        identity.confirmation_code = '';

        router.body = {
            identity: JSON.stringify(identity.toJSON(identity)),
            success: true,
        };
    }

    async handleSetPasswordRequest(router, ctx, next) {
        const { password, username } = router.request.body;

        await apiSetPasswordValidates.isValid({
            password,
        });

        const identity = await identityDataStore.setPassword(
            password,
            username
        );

        router.body = {
            identity: JSON.stringify(identity.toJSON(identity)),
            success: true,
        };
    }
}
