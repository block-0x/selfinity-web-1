import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import env from '@env/env.json';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import { SessionDataStore } from '@datastore';
import * as sessionActions from '@redux/Session/SessionReducer';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';
import uuidv4 from 'uuid/v4';
import countryCode from '@constants/countryCode';
import { ApiError } from '@extension/Error';
import {
    apiSendConfirmEmailValidates,
    apiSendConfirmCodeValidates,
    apiReSendConfirmEmailValidates,
    apiReSendConfirmCodeValidates,
    apiResetPasswordEmailValidates,
} from '@validations/session';
import Cookies from 'js-cookie';
import safe2json from '@extension/safe2json';
// import twillio from '@network/twillio';

const sessionDataStore = new SessionDataStore();

export default class SessionHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleCheckAccessTokenRequest(router, ctx, next) {
        const { accessToken, client_id } = router.request.body;

        const identity = await sessionDataStore
            .checkAccessToken({
                access_token: accessToken,
                client_id,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        if (!identity) {
            router.body = {
                success: true,
            };
            return;
        }

        const user =
            identity.UserId &&
            (await models.User.findOne({
                where: {
                    id: identity.UserId,
                },
            }).catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            }));

        router.body = {
            success: true,
            identity: safe2json(identity),
            user: safe2json(user),
        };
    }

    async handleGenerateAccessTokenRequest(router, ctx, next) {
        const { accessToken, client_id, isOneTime } = router.request.body;

        if (!accessToken) {
            router.body = {
                success: true,
            };
            return;
        }

        const identity = await sessionDataStore
            .checkAccessToken({
                access_token: accessToken,
                client_id: isOneTime ? '' : client_id,
                deleting: false,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });

        if (!identity) {
            router.body = {
                success: true,
            };
            return;
        }

        const newAccessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id,
            isOneTime: false,
        });

        router.body = {
            success: true,
            accessToken: newAccessToken,
        };
    }

    async handleConfirmEmail(router, ctx, next) {
        const { token } = router.query;

        const decoded = await sessionDataStore.verifyToken(
            token,
            'confirm_email'
        );

        const identity = await models.Identity.findOne({
            where: {
                email: decoded.email,
            },
        });

        if (!identity)
            throw new ApiError({
                error: e,
                tt_key: 'errors.not_exists',
                tt_params: { content: 'User' },
            });
        if (!identity.permission)
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_permitted',
                tt_params: { data: identity.username },
            });
        if (identity.account_is_created || identity.UserId)
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_access_token',
            });

        const val = await identity.update({
            email_is_verified: true, //token == identity.token,
        });

        const accessToken = await sessionDataStore.setAccessToken({
            identity,
            client_id: '',
            isOneTime: true,
        });

        const params = querystring.stringify({
            step: SIGNUP_STEP.Password.value,
            accessToken: accessToken,
        });

        router.redirect(`/signup?${params}`);
    }

    async handleStopMailNotificationRequest(router, ctx, next) {
        const { token } = router.query;

        const decoded = await sessionDataStore.verifyToken(
            token,
            'mail_notification'
        );

        const identity = await models.Identity.findOne({
            where: {
                email: decoded.email,
            },
        });

        if (!identity)
            throw new ApiError({
                error: e,
                tt_key: 'errors.not_exists',
                tt_params: { content: 'User' },
            });
        if (!identity.permission)
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_permitted',
                tt_params: { data: identity.username },
            });

        const val = await identity.update({
            isMailNotification: false,
        });

        router.redirect(`/?success_key=g.mail_stop`);
    }

    async handleDeletePasswordConfirmEmail(router, ctx, next) {
        const { token } = router.query;

        const decoded = await sessionDataStore.verifyToken(
            token,
            'delete_password'
        );

        const identity = await models.Identity.findOne({
            where: {
                email: decoded.email,
            },
        });

        if (!identity)
            throw new ApiError({
                error: e,
                tt_key: 'errors.not_exists',
                tt_params: { content: 'User' },
            });
        if (!identity.permission)
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_not_permitted',
                tt_params: { data: identity.username },
            });

        const val = await identity.update({
            password_hash: '',
            password: '',
        });

        const params = querystring.stringify({
            step: SIGNUP_STEP.Password.value,
        });

        router.redirect(`/signup?${params}`);
    }

    async handleSendConfirmEmail(router, ctx, next) {
        const { email, username } = router.request.body;

        await apiSendConfirmEmailValidates.isValid({
            identity: { email, username },
            email,
            username,
        });

        const mailToken = await jwt.sign(
            {
                type: 'confirm_email',
                email: email,
            },
            env.JWT_SECRET
        );

        const mail_notification_token = await jwt.sign(
            {
                type: 'mail_notification',
                email: email,
            },
            env.JWT_SECRET
        );

        const identity = await models.Identity.create({
            email: email,
            token: mailToken,
            email_is_verified: false,
            last_attempt_verify_email: new Date(),
            phone_number: uuidv4(),
            phone_number_is_verified: false,
            last_attempt_verify_phone_number: new Date(),
            phone_code_attempts: 0,
            phone_code: '',
            username: username,
            permission: true,
            account_is_created: false,
            mail_notification_token,
            isMailNotification: true,
            confirmation_code: '',
            username_booked_at: new Date(),
            password_hash: '',
            password: '',
            verified: false,
            bot: false,
            permission: true,
        });

        await sessionDataStore.sendEmail(identity.email, 'confirm_email', {
            url: `${
                process.env.NODE_ENV == 'production'
                    ? 'https'
                    : router.request.protocol
            }://${router.request.get('host')}/api/v1/confirm_email?token=${
                mailToken
            }`,
        });

        router.body = {
            success: true,
            username: identity.username,
            token: identity.token,
            email: identity.email,
        };
    }

    async handleReSendConfirmEmail(router, ctx, next) {
        const { email, username } = router.request.body;

        await apiReSendConfirmEmailValidates.isValid({
            identity: { email, username },
            email,
            username,
        });

        const mailToken = await jwt.sign(
            {
                type: 'confirm_email',
                email: email,
            },
            env.JWT_SECRET
        );

        let identity = await models.Identity.findOne({
            where: {
                username,
            },
        });

        if (!identity)
            throw new ApiError({
                error: new Error('user is not exists'),
                tt_key: 'errors.not_exists',
                tt_params: { content: username },
            });

        identity = await identity
            .update({
                email,
                token: mailToken,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_already_exists',
                    tt_params: { data: 'email' },
                });
            });

        await sessionDataStore.sendEmail(email, 'confirm_email', {
            url: `${
                process.env.NODE_ENV == 'production'
                    ? 'https'
                    : router.request.protocol
            }://${router.request.get('host')}/api/v1/confirm_email?token=${
                mailToken
            }`,
        });

        router.body = {
            success: true,
            username: identity.username,
            token: identity.token,
            email: identity.email,
        };
    }

    async handleSendDeletePasswordEmail(router, ctx, next) {
        const { email, username } = router.request.body;

        await apiResetPasswordEmailValidates.isValid({
            identity: { email, username },
            email,
            username,
        });

        const mailToken = await jwt.sign(
            {
                type: 'delete_password',
                email: email,
            },
            env.JWT_SECRET
        );

        let identity = await models.Identity.findOne({
            where: {
                username,
            },
        });

        if (!identity)
            throw new ApiError({
                error: new Error('user is not exists'),
                tt_key: 'errors.not_exists',
                tt_params: { content: username },
            });

        identity = await identity.update({
            delete_password_token: mailToken,
        });
        // .catch(e => {
        //     throw new ApiError({
        //         error: e,
        //         tt_key: 'errors.is_already_exists',
        //         tt_params: { data: 'email' },
        //     });
        // });

        await sessionDataStore.sendEmail(email, 'delete_password_email', {
            url: `${
                process.env.NODE_ENV == 'production'
                    ? 'https'
                    : router.request.protocol
            }://${router.request.get(
                'host'
            )}/api/v1/delete_password_email?token=${mailToken}`,
        });

        router.body = {
            success: true,
            username: identity.username,
            token: identity.token,
            email: identity.email,
        };
    }

    async handleSendConfirmCode(router, ctx, next) {
        const { username, phone_number, phone_code } = router.request.body;

        await apiSendConfirmCodeValidates.isValid({
            username,
            phone_number,
            phone_code,
            identity: { username, phone_number, phone_code },
        });

        const identity = await models.Identity.findOne({
            where: {
                username,
            },
        }).catch(e => {
            throw e;
        });

        const confirmation_code = await sessionDataStore
            .sendSMSVerify(phone_code + phone_number)
            .catch(e => {
                throw e;
            });

        const country_code = Object.keys(countryCode).map(key => {
            if (countryCode[key].code == phone_code) return key;
        })[0];

        // if (!confirmation_code && process.env.NODE_ENV != 'development')
        //     throw new ApiError({
        //         error: new Error('SMS verified is failed'),
        //         tt_key: 'errors.invalid_response_from_server',
        //     });

        const result = await identity
            .update({
                phone_code,
                phone_number,
                confirmation_code:
                    !!confirmation_code && confirmation_code.request_id,
                country_code,
            })
            .catch(e => {
                throw e;
            });

        router.body = {
            success: true,
        };
    }

    async handleReSendConfirmCode(router, ctx, next) {
        const { username, phone_number, phone_code } = router.request.body;

        await apiReSendConfirmCodeValidates.isValid({
            username,
            phone_number,
            phone_code,
            identity: { username, phone_number, phone_code },
        });

        let identity = await models.Identity.findOne({
            where: {
                username,
            },
        }).catch(e => {
            throw e;
        });

        identity = await identity
            .update({
                phone_code,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_already_exists',
                    tt_params: { data: 'phone_number' },
                });
            });

        const confirmation_code = await sessionDataStore
            .sendSMSVerify(phone_code + phone_number)
            .catch(e => {
                throw e;
            });

        const country_code = Object.keys(countryCode).map(key => {
            if (countryCode[key].code == phone_code) return key;
        })[0];

        // if (!confirmation_code && process.env.NODE_ENV != 'development')
        //     throw new ApiError({
        //         error: new Error('SMS verified is failed'),
        //         tt_key: 'errors.invalid_response_from_server',
        //     });

        const result = await identity
            .update({
                phone_code,
                phone_number,
                confirmation_code:
                    !!confirmation_code && confirmation_code.request_id,
                country_code,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.is_already_exists',
                    tt_params: { data: 'phone_number' },
                });
            });

        router.body = {
            success: true,
        };
    }

    async handleConfirmCode(router, ctx, next) {
        const { username, confirmation_code } = router.request.body;

        if (!confirmation_code)
            throw new ApiError({
                error: new Error('Confirmation code is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'Confirmation code' },
            });
        if (!username)
            throw new ApiError({
                error: new Error('User name is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'User name' },
            });

        const identity = await models.Identity.findOne({
            where: {
                username,
            },
        }).catch(e => {
            throw e;
        });

        const user = await models.User.findOne({
            where: {
                username,
            },
        }).catch(e => {
            throw e;
        });

        if (!identity || !user)
            throw new ApiError({
                error: new Error('user is not exists'),
                tt_key: 'errors.not_exists',
                tt_params: { content: username },
            });

        const isValid = await sessionDataStore.validatePhone(
            identity.confirmation_code,
            confirmation_code
        );

        if (!!isValid) {
            await identity
                .update({
                    phone_number_is_verified: isValid,
                    verified: isValid && identity.email_is_verified,
                })
                .catch(e => {
                    throw e;
                });

            await user
                .update({
                    verified: isValid && identity.email_is_verified,
                })
                .catch(e => {
                    throw e;
                });
        } else {
            throw new ApiError({
                error: new Error('phone code is not correct'),
                tt_key: 'errors.is_not_correct',
                tt_params: { data: 'g.phone_code' },
            });
        }

        router.body = {
            success: true,
            isValid,
        };
    }

    async handleSetMailNotificationTokenRequest(router, ctx, next) {
        const identities = await models.Identity.findAll();

        const tokens = await Promise.all(
            identities
                .filter(identity => validator.isEmail(identity.email))
                .map(identity =>
                    jwt.sign(
                        {
                            type: 'mail_notification',
                            email: identity.email,
                        },
                        env.JWT_SECRET
                    )
                )
        );

        const results = await Promise.all(
            identities
                .filter(identity => validator.isEmail(identity.email))
                .map((identity, index) =>
                    identity.update({
                        mail_notification_token: tokens[index],
                        isMailNotification: true,
                    })
                )
        );

        router.body = {
            success: true,
        };
    }
}
