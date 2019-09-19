import RepositoryImpl from '@repository/RepositoryImpl';
import Cookie from 'js-cookie';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@network/client_models';
import jwt from 'jsonwebtoken';
import env from '@env/env.json';
import validator from 'validator';
import badDomains from '@constants/bad-domains';

export default class SessionRepository extends RepositoryImpl {
    constructor() {
        super();
    }

    async findOneIdentityRequest(accessToken, client_id) {
        const data = await super.apiCall('/api/v1/identity', {
            accessToken,
            client_id,
        });
        return data && data.identity;
    }

    async generateAccessToken(accessToken, client_id, isOneTime) {
        const data = await super.apiCall('/api/v1/access_token/create', {
            accessToken,
            client_id,
            isOneTime,
        });

        return data && data.accessToken;
    }

    async sendDeletePasswordConfirmEmail(email, username) {
        const data = await super.apiCall(
            '/api/v1/session/confirmation/send/password/delete',
            {
                email: email,
                username: username,
            }
        );
    }

    async sendConfirmEmail(email, username) {
        const data = await super.apiCall(
            '/api/v1/session/confirmation/send/email',
            {
                email: email,
                username: username,
            }
        );
    }

    async resendConfirmEmail(email, username) {
        const data = await super.apiCall(
            '/api/v1/session/confirmation/resend/email',
            {
                email: email,
                username: username,
            }
        );
    }

    async reSendConfirmEmail(email, username, protocol, host) {
        if (!email) throw new Error('error api email equired');
        if (!username) throw new Error('error api username equired');
        if (!validator.isEmail(email))
            throw new Error('error api email format');
        if (badDomains.includes(email.split('@')[1]))
            throw new Error('error api domain blacklisted');

        const identity = await models.Identity.findOne({
            where: {
                email: email,
                email_is_verified: false,
                username: username,
                permission: true,
            },
        });
        await this.sendEmail(identity.email, 'confirm_email', {
            url: `${protocol}://${host}/confirm-email?token=${identity.token}`,
        });
    }

    async setPassword(username, password) {
        const data = await super.apiCall('/api/v1/set_password', {
            username: username,
            password: password,
        });
    }

    async sendConfirmCode(phone_number, phone_code, username) {
        const data = await super.apiCall(
            '/api/v1/session/confirmation/send/code',
            {
                phone_number,
                phone_code,
                username,
            }
        );
    }

    async resendConfirmCode(phone_number, phone_code, username) {
        const data = await super.apiCall(
            '/api/v1/session/confirmation/resend/code',
            {
                phone_number,
                phone_code,
                username,
            }
        );
    }

    async confirmCode(confirmation_code, username) {
        const data = await super.apiCall('/api/v1/session/confirmation/code', {
            confirmation_code,
            username,
        });
        return data.isValid;
    }

    async checkUserName(username) {
        const value = await models.Identity.findAll({
            where: {
                username: username,
                //And disable account conditions...
            },
        });
        return value !== null;
    }

    async checkEmail(email) {
        const value = await models.Identity.findAll({
            where: {
                email: email,
                //And disable account conditions...
            },
        });
        return value !== null;
    }

    async checkPhoneNumber(phone_number) {
        const value = await models.Identity.findAll({
            where: {
                phone_number: phone_number,
                //And disable account conditions...
            },
        });
        return value !== null;
    }

    async sendSMS(to, body) {
        console.log(`Send SMS to ${to} with body ${body}`);
        return '000';
        // return twilio.sendMessage(to, body);
    }

    async validatePhone(number) {
        console.log(`Validate ${number} number`);
        // return twilio.isValidNumber(number);
    }

    async sendEmail(to, template, context) {
        console.log(`Send Email to ${to} using template ${template}`);
        // return mail.send(to, template, context);
    }

    async sendApprovalEmail(to, baseUrl) {
        const mailToken = await jwt.sign(
            {
                type: 'create_account',
                email: to,
            },
            env.JWT_SECRET
        );
        await this.sendEmail(to, 'create_account', {
            url: `${baseUrl}/create-account?token=${mailToken}`,
        });
    }
}
