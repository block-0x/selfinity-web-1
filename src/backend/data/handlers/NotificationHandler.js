import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import { NotificationDataStore } from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';
import safe2json from '@extension/safe2json';
import { ApiError } from '@extension/Error';
import { apiAuthenticateIdentityValidates } from '@validations/auth';
import data_config from '@constants/data_config';
import config from '@constants/config';
import uuidv4 from 'uuid/v4';

export default class NotificationHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleOpenCampaignRequest(router, ctx, next) {
        // const { identity } = router.request.body;

        // if (process.env.NODE_ENV !== 'develpment') {
        //     router.body = {
        //         success: true,
        //     };
        //     return;
        // }

        const identities = await models.Identity.findAll();

        const results = await Promise.all(
            identities
                .filter(identity => validator.isEmail(identity.email))
                .map(identity =>
                    mail.send(identity.email, 'open_campaign', {
                        unsubscribe_url:
                            config.CURRENT_APP_URL +
                            '/api/v1/notification/email/stop?token=' +
                            identity.mail_notification_token,
                    })
                )
        );

        router.body = {
            success: true,
        };
    }

    async handleOpenCallRequest(router, ctx, next) {
        // const { identity } = router.request.body;

        // if (process.env.NODE_ENV !== 'develpment') {
        //     router.body = {
        //         success: true,
        //     };
        //     return;
        // }

        const identities = await models.Identity.findAll();

        const results = await Promise.all(
            identities
                .filter(identity => validator.isEmail(identity.email))
                .map(identity =>
                    mail.send(identity.email, 'open_call', {
                        unsubscribe_url:
                            config.CURRENT_APP_URL +
                            '/api/v1/notification/email/stop?token=' +
                            identity.mail_notification_token,
                    })
                )
        );

        router.body = {
            success: true,
        };
    }

    async handleFixForTalkRequest(router, ctx, next) {
        // const { identity } = router.request.body;

        // if (process.env.NODE_ENV !== 'develpment') {
        //     router.body = {
        //         success: true,
        //     };
        //     return;
        // }

        const identities = await models.Identity.findAll().catch(e => {
            throw e;
        });

        const results = await Promise.all(
            identities
                .filter(identity => validator.isEmail(identity.email))
                .map(identity =>
                    mail.send(identity.email, 'fix_for_talk', {
                        unsubscribe_url:
                            config.CURRENT_APP_URL +
                            '/api/v1/notification/email/stop?token=' +
                            identity.mail_notification_token,
                    })
                )
        ).catch(e => {
            throw e;
        });

        router.body = {
            success: true,
        };
    }
}
