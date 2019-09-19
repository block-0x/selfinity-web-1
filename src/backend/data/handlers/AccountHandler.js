import models from '@models';
import mail from '@network/mail';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import { AccountDataStore } from '@datastore';
import HandlerImpl from '@handlers/HandlerImpl';
import { SIGNUP_STEP } from '@entity';
import querystring from 'querystring';

const accountDataStore = new AccountDataStore();

export default class AccountHandler extends HandlerImpl {
    constructor() {
        super();
    }
}
