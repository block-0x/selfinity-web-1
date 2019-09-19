import DataStoreImpl from '@datastore/DataStoreImpl';

import Cookie from 'js-cookie';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import WalletDataStore from '@datastore/WalletDataStore';
import UserDataStore from '@datastore/UserDataStore';
import AccountDataStore from '@datastore/AccountDataStore';
import { web3, Wallet } from '@network/web3';
import validator from 'validator';
import badDomains from '@constants/bad-domains';
import models from '@models';
import * as detection from '@network/detection';
import { ApiError } from '@extension/Error';
import { apiInitAuthValidates } from '@validations/auth';
import uuidv4 from 'uuid/v4';

const accountDataStore = new AccountDataStore();
const userDataStore = new UserDataStore();

export default class AuthDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async initAuth({ username, email }) {
        const data = await super.apiCall('/api/v1/initialize_auth', {
            identity: {
                email: email,
                username: username,
            },
        });

        return {
            identity: JSON.parse(data.identity),
            user: JSON.parse(data.user),
            account: JSON.parse(data.account),
        };
    }

    async isValidForInitAuth(identity) {
        const {
            email,
            username,
            phoneNumber,
            email_is_verified,
            phone_number_is_verified,
        } = identity;

        return await apiInitAuthValidates.isValid({
            identity,
            email,
            username,
        });
    }

    async initialize_auth(identity) {
        const isValidIdentity = await this.isValidForInitAuth(identity).catch(
            e => {
                throw e;
            }
        );

        if (!isValidIdentity) return;

        const {
            eth_account,
            wallet,
            error,
            privateKey,
            publicKey,
        } = await this.eth_account_create();

        if (error)
            throw new ApiError({
                error: error,
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const user = await models.User.create({
            username: identity.username,
            nickname: identity.username,
            detail: '',
            picture_small: '/icons/noimage.svg',
            picture_large: '/icons/noimage.svg',
            eth_address: eth_account,
            token_balance: 0,
            score: 0,
            locale: detection.getEnvLocale(),
            timezone: detection.getTimeZone(),
            verified:
                identity.phone_number_is_verified && identity.email_is_verified,
            bot: false,
            sign_up_meta: '',
            invite_code: uuidv4(),
            isPrivate: false,
            permission: true,
        });

        if (!user)
            throw new ApiError({
                error: new Error('User cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const account = await models.Account.create({
            UserId: user.id,
            name: user.username,
            first_name: '',
            last_name: '',
            birthday: new Date(),
            address: '',
            gender: '',
            // owner_private_key: privateKey,
            active_key: publicKey,
            posting_key: publicKey,
            memo_key: publicKey,
            permission: true,
        });

        if (!account)
            throw new ApiError({
                error: new Error('Account cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const updated_identity = await identity
            .update({
                UserId: user.id,
                account_is_created: !!account && !!user,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.cant_created',
                    tt_params: { content: identity },
                });
            });

        return { identity: updated_identity, user, account, error: null };
    }

    async initialize_twitter_auth(identity, profile) {
        if (!profile) return;
        // const isValidIdentity = await this.isValidForInitAuth(identity).catch(
        //     e => {
        //         throw e;
        //     }
        // );

        // if (!isValidIdentity) return;

        const {
            eth_account,
            wallet,
            error,
            privateKey,
            publicKey,
        } = await this.eth_account_create();

        if (error)
            throw new ApiError({
                error: error,
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const user = await models.User.create({
            username: identity.username,
            nickname: profile.displayName,
            detail: profile.description,
            picture_small:
                profile.profile_image_url_https || '/icons/noimage.svg',
            picture_large:
                profile.profile_background_image_url_https ||
                '/icons/noimage.svg',
            eth_address: eth_account,
            token_balance: 0,
            score: 0,
            locale: detection.getEnvLocale(),
            timezone: detection.getTimeZone(),
            verified: false,
            bot: false,
            sign_up_meta: '',
            invite_code: uuidv4(),
            isPrivate: false,
            permission: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('User cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const account = await models.Account.create({
            UserId: user.id,
            name: user.username,
            first_name: '',
            last_name: '',
            birthday: new Date(),
            address: '',
            gender: '',
            // owner_private_key: privateKey,
            active_key: publicKey,
            posting_key: publicKey,
            memo_key: publicKey,
            permission: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        if (!account)
            throw new ApiError({
                error: new Error('Account cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const updated_identity = await identity
            .update({
                UserId: user.id,
                account_is_created: !!account && !!user,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.cant_created',
                    tt_params: { content: identity },
                });
            });

        return { identity: updated_identity, user, account, error: null };
    }

    async initialize_facebook_auth(identity, profile) {
        if (!profile) return;
        // const isValidIdentity = await this.isValidForInitAuth(identity).catch(
        //     e => {
        //         throw e;
        //     }
        // );

        // if (!isValidIdentity) return;

        const {
            eth_account,
            wallet,
            error,
            privateKey,
            publicKey,
        } = await this.eth_account_create();

        if (error)
            throw new ApiError({
                error: error,
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const user = await models.User.create({
            username: identity.username,
            nickname: profile.displayName,
            detail: '',
            picture_small: '/icons/noimage.svg',
            picture_large: '/icons/noimage.svg',
            eth_address: eth_account,
            token_balance: 0,
            score: 0,
            locale: detection.getEnvLocale(),
            timezone: detection.getTimeZone(),
            verified: false,
            bot: false,
            sign_up_meta: '',
            invite_code: uuidv4(),
            isPrivate: false,
            permission: true,
        });

        if (!user)
            throw new ApiError({
                error: new Error('User cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const account = await models.Account.create({
            UserId: user.id,
            name: user.username,
            first_name: '',
            last_name: '',
            birthday: new Date(),
            address: '',
            gender: '',
            // owner_private_key: privateKey,
            active_key: publicKey,
            posting_key: publicKey,
            memo_key: publicKey,
            permission: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        if (!account)
            throw new ApiError({
                error: new Error('Account cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const updated_identity = await identity
            .update({
                UserId: user.id,
                account_is_created: !!account && !!user,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.cant_created',
                    tt_params: { content: identity },
                });
            });

        return { identity: updated_identity, user, account, error: null };
    }

    async initialize_instagram_auth(identity, profile) {
        if (!profile) return;
        // const isValidIdentity = await this.isValidForInitAuth(identity).catch(
        //     e => {
        //         throw e;
        //     }
        // );

        // if (!isValidIdentity) return;

        const {
            eth_account,
            wallet,
            error,
            privateKey,
            publicKey,
        } = await this.eth_account_create();

        if (error)
            throw new ApiError({
                error: error,
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const user = await models.User.create({
            username: identity.username,
            nickname: profile.displayName,
            detail: profile.description,
            picture_small: profile.profile_picture || '/icons/noimage.svg',
            picture_large: '/icons/noimage.svg',
            eth_address: eth_account,
            token_balance: 0,
            score: 0,
            locale: detection.getEnvLocale(),
            timezone: detection.getTimeZone(),
            verified: false,
            bot: false,
            sign_up_meta: '',
            invite_code: uuidv4(),
            isPrivate: false,
            permission: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('User cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const account = await models.Account.create({
            UserId: user.id,
            name: user.username,
            first_name: '',
            last_name: '',
            birthday: new Date(),
            address: '',
            gender: '',
            // owner_private_key: privateKey,
            active_key: publicKey,
            posting_key: publicKey,
            memo_key: publicKey,
            permission: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.is_already_registered',
            });
        });

        if (!account)
            throw new ApiError({
                error: new Error('Account cannot created'),
                tt_key: 'errors.cant_created',
                tt_params: { content: identity },
            });

        const updated_identity = await identity
            .update({
                UserId: user.id,
                account_is_created: !!account && !!user,
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.cant_created',
                    tt_params: { content: identity },
                });
            });

        return { identity: updated_identity, user, account, error: null };
    }

    async user_authenticate({ email, password }) {
        const data = await super.apiCall('/api/v1/authenticate', {
            email: email,
            password: password,
        });
        return data;
    }

    // async fb_auth(email, password, username) {
    //     await FBAuth.signInWithEmailAndPassword(email, password).catch(
    //         console.log
    //     );
    //     const me = auth.currentUser;
    //     console.log(me.email, me.emailVerified);
    //     const token = await me.getIdToken();
    //     console.log(token);
    // }

    async eth_account_create() {
        let error = null;
        try {
            /*
            @0.2.x
            const eth_account = await web3.eth.personal.newAccount('', (err, res) => {
                return new Promise((resolve, reject) => {
                    if (res) {
                        resolve(res);
                    }
                })
            });
            */
            const wallet = Wallet.generate();
            const privateKey = wallet.getPrivateKeyString();
            //privateKey.toString("hex") 先頭の0xを除去
            const publicKey = wallet.getPublicKeyString();
            const eth_account = wallet.getAddressString();
            /*
            @1.0.x
            const eth_account = await web3.eth.accounts.create();
            const wallet = await web3.eth.accounts.wallet.add(eth_account);
            */

            return { eth_account, wallet, error, privateKey, publicKey };
        } catch (e) {
            error = e;
            if (error)
                return {
                    eth_account: null,
                    wallet: null,
                    error: error,
                    privateKey: null,
                    publicKey: null,
                };
        }
    }
}
