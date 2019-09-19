import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import {
    AuthDataStore,
    SessionDataStore,
    IdentityDataStore,
    UserDataStore,
} from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';
import safe2json from '@extension/safe2json';
import { ApiError } from '@extension/Error';
import { apiAuthenticateIdentityValidates } from '@validations/auth';
import data_config from '@constants/data_config';
import uuidv4 from 'uuid/v4';
import env from '@env/env.json';

const authDataStore = new AuthDataStore();
const sessionDataStore = new SessionDataStore();
const identityDataStore = new IdentityDataStore();

export default class AuthHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleInitializeAuth(router, ctx, next) {
        const { identity } = router.request.body;

        const model_identity = await identityDataStore
            .findOneIdentityFromUserName(identity.username)
            .catch(e => {
                throw e;
            });

        if (model_identity.UserId) {
            router.body = { success: false };
            return;
        }

        const val = await authDataStore
            .initialize_auth(model_identity)
            .catch(e => {
                throw e;
            });

        if (val.error) {
            router.body = { success: false, error: val.error };
            return;
        }

        router.body = {
            identity: safe2json(val.identity),
            user: safe2json(val.user),
            account: safe2json(val.account),
            success: true,
        };
    }

    async handleTwitterInitializeAuth(router, req, res, next) {
        const { profile } = res;

        let email;
        let mail_notification_token;
        let isMailNotification = false;
        if (profile.emails) {
            if (profile.emails.length > 0) {
                email = profile.emails[0].value;
                mail_notification_token = await jwt.sign(
                    {
                        type: 'mail_notification',
                        email: profile.emails[0].value,
                    },
                    env.JWT_SECRET
                );
                isMailNotification = true;
            } else {
                email = `${profile.provider.slice(
                    0,
                    data_config.provider_limit
                )}${profile.id}${profile.username}`;
            }
        } else {
            email = `${profile.provider.slice(0, data_config.provider_limit)}${
                profile.id
            }${profile.username}`;
        }

        const identity = await models.Identity.create({
            email,
            token: '',
            email_is_verified: true,
            last_attempt_verify_email: new Date(),
            phone_number: uuidv4(),
            phone_number_is_verified: false,
            last_attempt_verify_phone_number: new Date(),
            phone_code_attempts: 0,
            phone_code: '',
            username: uuidv4(),
            permission: true,
            account_is_created: false,
            confirmation_code: '',
            username_booked_at: new Date(),
            password_hash: '',
            password: '',
            twitter_id: profile.id,
            verified: false,
            bot: false,
            permission: true,
            mail_notification_token,
            isMailNotification,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
            router.redirect('/signup');
        });

        const val = await authDataStore
            .initialize_twitter_auth(identity, profile)
            .catch(e => {
                router.redirect('/signup');
                throw e;
            });

        if (val.error) {
            router.body = { success: false, error: val.error };
            router.redirect('/signup');
            return;
        }

        router.body = {
            identity: safe2json(val.identity),
            user: safe2json(val.user),
            account: safe2json(val.account),
            success: true,
        };

        const accessToken = await sessionDataStore.setAccessToken({
            identity: val.identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            step: SIGNUP_STEP.PhoneNumber.value,
            accessToken: accessToken,
        });

        router.redirect(`/signup?${params}`);
    }

    async handleFacebookInitializeAuth(router, req, res, next) {
        const { profile } = res;

        const identity = await models.Identity.create({
            email: `${profile.provider.slice(0, data_config.provider_limit)}${
                profile.id
            }${profile.username || ''}`,
            token: '',
            email_is_verified: true,
            last_attempt_verify_email: new Date(),
            phone_number: uuidv4(),
            phone_number_is_verified: false,
            last_attempt_verify_phone_number: new Date(),
            phone_code_attempts: 0,
            phone_code: '',
            username: uuidv4(),
            permission: true,
            account_is_created: false,
            confirmation_code: '',
            username_booked_at: new Date(),
            password_hash: '',
            password: '',
            facebook_id: profile.id,
            verified: false,
            bot: false,
            permission: true,
        }).catch(e => {
            router.redirect('/signup');
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        const val = await authDataStore
            .initialize_facebook_auth(identity, profile)
            .catch(e => {
                router.redirect('/signup');
                throw e;
            });

        if (val.error) {
            router.body = { success: false, error: val.error };
            router.redirect('/signup');
            return;
        }

        router.body = {
            identity: safe2json(val.identity),
            user: safe2json(val.user),
            account: safe2json(val.account),
            success: true,
        };

        const accessToken = await sessionDataStore.setAccessToken({
            identity: val.identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            step: SIGNUP_STEP.PhoneNumber.value,
            accessToken: accessToken,
        });

        router.redirect(`/signup?${params}`);
    }

    async handleInstagramInitializeAuth(router, req, res, next) {
        const { profile } = res;

        const identity = await models.Identity.create({
            email: `${profile.provider.slice(0, data_config.provider_limit)}${
                profile.id
            }${profile.username}`,
            token: '',
            email_is_verified: true,
            last_attempt_verify_email: new Date(),
            phone_number: uuidv4(),
            phone_number_is_verified: false,
            last_attempt_verify_phone_number: new Date(),
            phone_code_attempts: 0,
            phone_code: '',
            username: uuidv4(),
            permission: true,
            account_is_created: false,
            confirmation_code: '',
            username_booked_at: new Date(),
            password_hash: '',
            password: '',
            instagram_id: profile.id,
            verified: false,
            bot: false,
            permission: true,
        }).catch(e => {
            router.redirect('/signup');
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        const val = await authDataStore
            .initialize_instagram_auth(identity, profile)
            .catch(e => {
                router.redirect('/signup');
                throw e;
            });

        if (val.error) {
            router.body = { success: false, error: val.error };
            router.redirect('/signup');
            return;
        }

        router.body = {
            identity: safe2json(val.identity),
            user: safe2json(val.user),
            account: safe2json(val.account),
            success: true,
        };

        const accessToken = await sessionDataStore.setAccessToken({
            identity: val.identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            step: SIGNUP_STEP.PhoneNumber.value,
            accessToken: accessToken,
        });

        router.redirect(`/signup?${params}`);
    }

    async handleAuthenticateRequest(router, ctx, next) {
        const { email, password, client_id } = router.request.body;

        await apiAuthenticateIdentityValidates.isValid({
            email,
            password,
        });

        const identity = await identityDataStore
            .findOneIdentityFromEmail(email, true)
            .catch(e => {
                throw e;
            });

        const result = await identity
            .authenticate(identity, password)
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_not_correct_auth',
                });
            });

        if (!result)
            throw new ApiError({
                error: new Error(`is_not_correct_auth`),
                tt_key: 'errors.is_not_correct_auth',
            });

        const accessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id,
            isOneTime: false,
        });

        router.body = {
            success: true,
            user: result ? safe2json(identity.User) : null,
            accessToken,
        };
    }

    async handleFacebookAuthenticateRequest(router, req, res, next) {
        const { profile, accessToken } = res;
        const { state } = router.query;

        if (!profile) {
            router.redirect('/login');
            return;
        }

        const identity = await models.Identity.findOne({
            where: {
                facebook_id: profile.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_registered',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('is_not_registered'),
                tt_key: 'errors.is_not_registered',
            });

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            facebook_logined: true,
            accessToken: newAccessToken,
        });

        router.body = {
            success: true,
        };

        switch (state) {
            case 'privatekey/confirm':
                router.redirect(`/privatekey/?${confirmparams}`);
                break;
            case 'user/delete/confirm':
                router.redirect(`/user/delete/?${confirmparams}`);
                break;
            case 'session':
            default:
                router.redirect(`/?${params}`);
                break;
        }
    }

    async handleInstagramAuthenticateRequest(router, req, res, next) {
        const { profile, accessToken } = res;
        const { state } = router.query;

        if (!profile) {
            router.redirect('/login');
            return;
        }

        const identity = await models.Identity.findOne({
            where: {
                instagram_id: profile.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_registered',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('is_not_registered'),
                tt_key: 'errors.is_not_registered',
            });

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            instagram_logined: true,
            accessToken: newAccessToken,
        });

        router.body = {
            success: true,
        };

        switch (state) {
            case 'privatekey/confirm':
                router.redirect(`/privatekey/confirm?${params}`);
                break;
            case 'user/delete/confirm':
                router.redirect(`/user/delete/confirm?${params}`);
                break;
            case 'session':
            default:
                router.redirect(`/?${params}`);
                break;
        }
    }

    async handleTwitterAuthenticateRequest(router, req, res, next) {
        const { profile } = res;

        const { oauth_token } = router.query;

        if (!profile) {
            router.redirect('/login');
            return;
        }

        const identity = await models.Identity.findOne({
            where: {
                twitter_id: profile.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_registered',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('is_not_registered'),
                tt_key: 'errors.is_not_registered',
            });

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            twitter_logined: true,
            accessToken: newAccessToken,
        });

        router.body = {
            success: true,
        };

        router.redirect(`/?${params}`);
    }

    async handleTwitterPrivateKeyAuthenticateRequest(router, req, res, next) {
        const { profile } = res;

        const { oauth_token, state } = router.query;

        if (!profile) {
            router.redirect('/login');
            return;
        }

        const identity = await models.Identity.findOne({
            where: {
                twitter_id: profile.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_registered',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('is_not_registered'),
                tt_key: 'errors.is_not_registered',
            });

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            twitter_logined: true,
            accessToken: newAccessToken,
        });

        router.body = {
            success: true,
        };

        router.redirect(`/privatekey/confirm?${params}`);

        switch (state) {
            case 'privatekey/confirm':
                break;
            case 'user/delete/confirm':
                router.redirect(`/user/delete/confirm?${params}`);
                break;
            case 'session':
            default:
                router.redirect(`/?${params}`);
                break;
        }
    }

    async handleTwitterUserDeleteAuthenticateRequest(router, req, res, next) {
        const { profile } = res;

        const { oauth_token } = router.query;

        if (!profile) {
            router.redirect('/login');
            return;
        }

        const identity = await models.Identity.findOne({
            where: {
                twitter_id: profile.id,
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_registered',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('is_not_registered'),
                tt_key: 'errors.is_not_registered',
            });

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            twitter_logined: true,
            accessToken: newAccessToken,
        });

        router.body = {
            success: true,
        };

        router.redirect(`/user/delete/confirm?${params}`);
    }

    async handleGetPrivateKeyRequest(router, ctx, next) {
        const { user } = router.request.body;

        router.body = {
            success: true,
            privateKey: '',
        };
    }
}
