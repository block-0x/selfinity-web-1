import DataStoreImpl from '@datastore/DataStoreImpl';
import UserDataStore from '@datastore/UserDataStore';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import vector from '@extension/vector';
import Promise from 'bluebird';
import PyShell from '@network/python_shell';
import Content from '@models/content';
import safe2json from '@extension/safe2json';
import data_config from '@constants/data_config';
import Sequelize from 'sequelize';
import { ApiError } from '@extension/Error';
import mail from '@network/mail';
import validator from 'validator';
import config from '@constants/config';
import notification_config from '@constants/notification_config';
import Notification from '@network/notification';
import querystring from 'querystring';

const notification = new Notification();

export default class NotificationDataStore extends DataStoreImpl {
    constructor() {
        super();
    }

    async onRandomCreate(content) {
        if (!content) return;
        // if (content.ParentId) return;
        const target = await models.Content.findOne({
            where: {
                id: Number(content.id),
            },
            attributes: ['id', 'UserId', 'user_id', 'isOpinionWanted', 'title'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId),
            },
            attributes: ['id', 'nickname'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const all_users = await models.User.findAll({
            attributes: ['id', 'nickname', 'notification_id'],
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const users = Array.prototype.randomSelect(
            all_users,
            notification_config.random_limit
        );

        const identities = await Promise.all(
            users.map(val =>
                models.Identity.findOne({
                    where: {
                        user_id: Number(val.id),
                    },
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const notifications = await Promise.all(
            users.map(follower =>
                notification.push({
                    tt_key: Number.prototype.castBool(content.isOpinionWanted)
                        ? 'on_create_content_call'
                        : 'on_create_content',
                    url: config.CURRENT_APP_URL + `/content/${content.id}`,
                    ids: [follower.notification_id || ''],
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await Promise.all(
            identities
                .filter(identity => !!identity)
                .filter(
                    identity =>
                        validator.isEmail(identity.email) &&
                        Number.prototype.castBool(identity.isMailNotification)
                )
                .map(async identity => {
                    if (Number.prototype.castBool(content.isOpinionWanted)) {
                        return await mail.send(
                            identity.email,
                            'content_call_notification',
                            {
                                title: `新しい募集をチェックしよう！`,
                                text: `${config.APP_NAME}です。\n
                                「${target.title.slice(
                                    0,
                                    data_config.email_desc_max_limit
                                )}...」でチャットを募集しています！いち早くメッセージを出してスーパーグッドを手に入れましょう！下記のボタンをクリックして確認しましょう！`,
                                button_text: '確認する',
                                button_url:
                                    config.CURRENT_APP_URL +
                                    `/content/${content.id}`,
                                foot_text: '',
                                end_text: '',
                                inc_name: config.INC_FULL_NAME,
                                unsubscribe_text:
                                    'メールの通知を解除したい場合は',
                                unsubscribe_url:
                                    config.CURRENT_APP_URL +
                                    '/api/v1/notification/email/stop?token=' +
                                    identity.mail_notification_token,
                                unsubscribe: 'こちらから',
                                contact: '会社住所・お問い合わせ',
                            }
                        );
                    } else {
                        return await mail.send(
                            identity.email,
                            'content_notification',
                            {
                                title: `新チャットをチェックしよう！`,
                                text: `${
                                    config.APP_NAME
                                }です。\n「${target.title.slice(
                                    0,
                                    data_config.email_desc_max_limit
                                )}...」を投稿しました。いち早くメッセージを出してスーパーグッドを手に入れましょう！下記のボタンをクリックして確認しましょう！`,
                                button_text: '確認する',
                                button_url:
                                    config.CURRENT_APP_URL +
                                    `/content/${content.id}`,
                                foot_text: '',
                                end_text: '',
                                inc_name: config.INC_FULL_NAME,
                                unsubscribe_text:
                                    'メールの通知を解除したい場合は',
                                unsubscribe_url:
                                    config.CURRENT_APP_URL +
                                    '/api/v1/notification/email/stop?token=' +
                                    identity.mail_notification_token,
                                unsubscribe: 'こちらから',
                                contact: '会社住所・お問い合わせ',
                            }
                        );
                    }
                })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async onStoryCreate(content) {
        if (!content) return;
        if (content.ParentId) return;
        const target = await models.Content.findOne({
            where: {
                id: Number(content.id),
            },
            attributes: ['id', 'UserId', 'user_id', 'isOpinionWanted', 'title'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        this.onRandomCreate(content);

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId),
            },
            attributes: ['id', 'nickname'],
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const follower_models = await models.Follow.findAll({
            where: {
                votered_id: Number(content.UserId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const followers = await Promise.all(
            follower_models.map(follow =>
                models.User.findOne({
                    where: {
                        id: follow.VoterId,
                    },
                    attributes: ['id', 'nickname', 'notification_id'],
                    raw: true,
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const identities = await Promise.all(
            followers.map(follower =>
                models.Identity.findOne({
                    where: {
                        user_id: Number(follower.id),
                    },
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const notifications = await Promise.all(
            followers.map(follower =>
                notification.push({
                    tt_key: Number.prototype.castBool(content.isOpinionWanted)
                        ? 'on_create_content_call'
                        : 'on_create_content',
                    url: config.CURRENT_APP_URL + `/content/${content.id}`,
                    ids: [follower.notification_id || ''],
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await Promise.all(
            identities
                .filter(identity => !!identity)
                .filter(
                    identity =>
                        validator.isEmail(identity.email) &&
                        Number.prototype.castBool(identity.isMailNotification)
                )
                .map(async identity => {
                    if (Number.prototype.castBool(content.isOpinionWanted)) {
                        return await mail.send(
                            identity.email,
                            'content_call_notification',
                            {
                                title: `新しい募集をチェックしよう！`,
                                text: `${config.APP_NAME}です。\n
                                「${target.title.slice(
                                    0,
                                    data_config.email_desc_max_limit
                                )}...」でチャットを募集しています！いち早くメッセージを出してスーパーグッドを手に入れましょう！下記のボタンをクリックして確認しましょう！`,
                                button_text: '確認する',
                                button_url:
                                    config.CURRENT_APP_URL +
                                    `/content/${content.id}`,
                                foot_text: '',
                                end_text: '',
                                inc_name: config.INC_FULL_NAME,
                                unsubscribe_text:
                                    'メールの通知を解除したい場合は',
                                unsubscribe_url:
                                    config.CURRENT_APP_URL +
                                    '/api/v1/notification/email/stop?token=' +
                                    identity.mail_notification_token,
                                unsubscribe: 'こちらから',
                                contact: '会社住所・お問い合わせ',
                            }
                        );
                    } else {
                        return await mail.send(
                            identity.email,
                            'content_notification',
                            {
                                title: `新チャットをチェックしよう！`,
                                text: `${
                                    config.APP_NAME
                                }です。\n「${target.title.slice(
                                    0,
                                    data_config.email_desc_max_limit
                                )}...」を投稿しました。いち早くメッセージを出してスーパーグッドを手に入れましょう！下記のボタンをクリックして確認しましょう！`,
                                button_text: '確認する',
                                button_url:
                                    config.CURRENT_APP_URL +
                                    `/content/${content.id}`,
                                foot_text: '',
                                end_text: '',
                                inc_name: config.INC_FULL_NAME,
                                unsubscribe_text:
                                    'メールの通知を解除したい場合は',
                                unsubscribe_url:
                                    config.CURRENT_APP_URL +
                                    '/api/v1/notification/email/stop?token=' +
                                    identity.mail_notification_token,
                                unsubscribe: 'こちらから',
                                contact: '会社住所・お問い合わせ',
                            }
                        );
                    }
                })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async onOpinionCreate(content) {
        if (!content.ParentId) return;
        this.onRandomCreate(content);
        if (Number.prototype.castBool(content.isCheering)) {
            await this.onCheeringCreate(content);
            return;
        }
        const target = await models.Content.findOne({
            where: {
                id: Number(content.ParentId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(target.UserId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(target.UserId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_create_opinion',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'opinion_notification', {
                title: `新メッセージを確認しましょう!`,
                text: `${config.APP_NAME}です。\nあなたの「${target.title.slice(
                    0,
                    data_config.email_desc_max_limit
                )}...」に対してメッセージをもらいました。下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onCheeringCreate(content) {
        if (!content.ParentId) return;
        const target = await models.Content.findOne({
            where: {
                id: Number(content.ParentId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(target.UserId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(target.UserId),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_get_cheering',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'cheering_notification', {
                title: `あなたのメッセージに心を動かされた人がいいねメッセージを届けてくれました!`,
                text: `${config.APP_NAME}です。\nあなたの「${target.title.slice(
                    0,
                    data_config.email_desc_max_limit
                )}...」に対していいねメッセージをもらいました。いいねメッセージはメッセージの価値を更に高めてくれます！下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onAnswerCreate(content) {
        if (!content.id) return;
        const target = await models.Request.findOne({
            where: {
                content_id: Number(content.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!target) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(target.VoterId || target.voter_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(target.VoterId || target.voter_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_answer_request',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'answer_notification', {
                title: `あなたのリクエストの回答が届きました！`,
                text: `${
                    config.APP_NAME
                }です。\nあなたのリクエストの${''
                    .cleaning_tag(target.body)
                    .slice(
                        0,
                        data_config.email_desc_max_limit
                    )}...」に対して回答をもらいました。下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onRequestCreate(request) {
        if (!request.id) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(request.VoteredId || request.votered_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(request.VoteredId || request.votered_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_create_request',
            url: config.CURRENT_APP_URL + `/request/${request.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'request_notification', {
                title: `あなたに会話権購入リクエストが届きました！`,
                text: `${config.APP_NAME}です。\nあなたに「${''
                    .cleaning_tag(request.body)
                    .slice(
                        0,
                        data_config.email_desc_max_limit
                    )}...」という会話権購入リクエストもらいました。下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/request/${request.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onGood(content) {
        if (!content.id) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_get_good',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'good_notification', {
                title: `いいねを獲得しました！`,
                text: `${
                    config.APP_NAME
                }です。\nあなたの「${content.title.slice(
                    0,
                    data_config.email_desc_max_limit
                )}...」でいいねをもらいました。いいねはあなたのメッセージが閲覧者に認められたときに獲得できます！評価者のポイントの高さ分、あなたのポイントが上がります！下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onGoodOpinion(content) {
        if (!content.id) return;
        if (!Number.prototype.castBool(content.isBetterOpinion)) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_get_good_opinion',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'good_opinion_notification', {
                title: `スーパーグッドを獲得しました！`,
                text: `${
                    config.APP_NAME
                }です。\nあなたの「${content.title.slice(
                    0,
                    data_config.email_desc_max_limit
                )}...」でスーパーグッドをもらいました。スーパーグッドはあなたのメッセージが聞き手に認められたときに獲得できます！下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onGoodAnswer(content) {
        if (!content.id) return;
        if (!Number.prototype.castBool(content.isBetterAnswer)) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        const user = await models.User.findOne({
            where: {
                id: Number(content.UserId || content.user_id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_get_good_answer',
            url: config.CURRENT_APP_URL + `/content/${content.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'good_answer_notification', {
                title: `スーパーグッドを獲得しました！`,
                text: `${
                    config.APP_NAME
                }です。\nあなたの「${content.title.slice(
                    0,
                    data_config.email_desc_max_limit
                )}...」でスーパーグッドをもらいました。スーパーグッドはあなたのメッセージがリクエスト投稿者に認められたときに獲得できます！下記のボタンをクリックして確認しましょう！`,
                button_text: '確認する',
                button_url: config.CURRENT_APP_URL + `/content/${content.id}`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async onReward(user) {
        if (!user.id) return;

        const rewards = await models.Reward.findAll({
            where: {
                created_at: {
                    $between: [Date.prototype.getOneDayAgo(), new Date()],
                },
            },
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (rewards.length > 0) return;

        const identity = await models.Identity.findOne({
            where: {
                user_id: Number(user.id),
            },
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        if (!identity)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        if (!user)
            throw new ApiError({
                error: new Error('identity is required'),
                tt_key: 'errors.is_required',
                tt_params: { data: 'g.user' },
            });

        await notification.push({
            tt_key: 'on_get_token',
            url: config.CURRENT_APP_URL + `/user/${user.id}`,
            ids: [user.notification_id || ''],
        });

        if (
            !validator.isEmail(identity.email) ||
            !Number.prototype.castBool(identity.isMailNotification)
        )
            return;

        await mail
            .send(identity.email, 'token_notification', {
                title: `報酬を獲得しました！`,
                text: `${
                    config.APP_NAME
                }です。\nもらった報酬を確認しましょう！報酬を使って好きな人と好きな会話を買いましょう！`,
                button_text: '確認する',
                button_url:
                    config.CURRENT_APP_URL + `/user/${user.id}/transfers`,
                foot_text: '',
                end_text: '',
                inc_name: config.INC_FULL_NAME,
                unsubscribe_text: 'メールの通知を解除したい場合は',
                unsubscribe_url:
                    config.CURRENT_APP_URL +
                    '/api/v1/notification/email/stop?token=' +
                    identity.mail_notification_token,
                unsubscribe: 'こちらから',
                contact: '会社住所・お問い合わせ',
            })
            .catch(e => {
                throw new ApiError({
                    error: e,
                    tt_key: 'errors.invalid_response_from_server',
                });
            });
    }

    async getDailySummary({ limit = 5, offset = 0 }) {
        const contents = await models.Content.findAll({
            where: {
                // count: {
                //     $gte: data_config.disscussion_count_min_limit,
                // },
                // sum_pure_score: {
                //     $gte: data_config.disscussion_sum_min_limit,
                // },
                isStory: true,
                isBetterAnswer: false,
                created_at: {
                    $between: [Date.prototype.getOneDayAgo(), new Date()],
                },
            },
            order: [['sum_score', 'ASC']],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return contents;
    }

    async getDailyOpinion({ limit = 5, offset = 0 }) {
        const contents = await models.Content.findAll({
            where: {
                // count: {
                //     $gte: data_config.disscussion_count_min_limit,
                // },
                // sum_pure_score: {
                //     $gte: data_config.disscussion_sum_min_limit,
                // },
                isBetterOpinion: true,
                created_at: {
                    $between: [Date.prototype.getOneDayAgo(), new Date()],
                },
            },
            order: [['sum_score', 'ASC']],
            offset: Number(offset || 0),
            limit: Number(limit || data_config.fetch_data_limit('S')),
            raw: true,
        }).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        return contents;
    }

    async onDailySummary() {
        const users = await models.User.findAll();
        const identities = await Promise.all(
            users.map(user =>
                models.Identity.findOne({ where: { user_id: Number(user.id) } })
            )
        );

        const contents = await this.getDailySummary({
            limit: notification_config.summary_limit + 1,
            offset: 0,
        });

        if (contents.length < notification_config.summary_limit) {
            return;
        }

        const params = querystring.stringify({
            ...new Date.prototype.separate(),
        });

        const notifications = await Promise.all(
            users.map(user =>
                notification.push({
                    tt_key: 'on_daily_summary',
                    url: config.CURRENT_APP_URL + `/pickup/contents?${params}`,
                    ids: [user.notification_id || ''],
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await Promise.all(
            identities
                .filter(identity => !!identity)
                .filter(
                    identity =>
                        validator.isEmail(identity.email) &&
                        Number.prototype.castBool(identity.isMailNotification)
                )
                .map(async identity => {
                    return await mail.send(
                        identity.email,
                        'daily_summary_notification',
                        {
                            title: `本日の注目トークまとめ`,
                            text: `本日の注目トークまとめを確認しよう`,
                            item1: contents[0].title,
                            button_url1:
                                config.CURRENT_APP_URL +
                                `/content/${contents[0].id}`,
                            item2: contents[1].title,
                            button_url2:
                                config.CURRENT_APP_URL +
                                `/content/${contents[1].id}`,
                            item3: contents[2].title,
                            button_url3:
                                config.CURRENT_APP_URL +
                                `/content/${contents[2].id}`,
                            item4: contents[3].title,
                            button_url4:
                                config.CURRENT_APP_URL +
                                `/content/${contents[3].id}`,
                            item5: contents[4].title,
                            button_url5:
                                config.CURRENT_APP_URL +
                                `/content/${contents[4].id}`,
                            button_text: '確認する',
                            more_text: 'もっとみる...',
                            more_url:
                                config.CURRENT_APP_URL +
                                `/pickup/contents?${params}`,
                            inc_name: config.INC_FULL_NAME,
                            unsubscribe_text: 'メールの通知を解除したい場合は',
                            unsubscribe_url:
                                config.CURRENT_APP_URL +
                                '/api/v1/notification/email/stop?token=' +
                                identity.mail_notification_token,
                            unsubscribe: 'こちらから',
                            contact: '会社住所・お問い合わせ',
                        }
                    );
                })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }

    async onDailyOpinion() {
        const users = await models.User.findAll();
        const identities = await Promise.all(
            users.map(user =>
                models.Identity.findOne({ where: { user_id: Number(user.id) } })
            )
        );

        const contents = await this.getDailyOpinion({
            limit: notification_config.summary_limit + 1,
            offset: 0,
        });

        if (contents.length < notification_config.summary_limit) {
            return;
        }

        const params = querystring.stringify({
            ...new Date.prototype.separate(),
        });

        const notifications = await Promise.all(
            users.map(user =>
                notification.push({
                    tt_key: 'on_daily_opinion',
                    url: config.CURRENT_APP_URL + `/pickup/opinions?${params}`,
                    ids: [user.notification_id || ''],
                })
            )
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });

        await Promise.all(
            identities
                .filter(identity => !!identity)
                .filter(
                    identity =>
                        validator.isEmail(identity.email) &&
                        Number.prototype.castBool(identity.isMailNotification)
                )
                .map(async identity => {
                    return await mail.send(
                        identity.email,
                        'daily_opinion_notification',
                        {
                            title: `本日の注目スーパーグッドまとめ`,
                            text: `本日の注目スーパーグッドまとめを確認しよう`,
                            item1: contents[0].title,
                            button_url1:
                                config.CURRENT_APP_URL +
                                `/content/${contents[0].id}`,
                            item2: contents[1].title,
                            button_url2:
                                config.CURRENT_APP_URL +
                                `/content/${contents[1].id}`,
                            item3: contents[2].title,
                            button_url3:
                                config.CURRENT_APP_URL +
                                `/content/${contents[2].id}`,
                            item4: contents[3].title,
                            button_url4:
                                config.CURRENT_APP_URL +
                                `/content/${contents[3].id}`,
                            item5: contents[4].title,
                            button_url5:
                                config.CURRENT_APP_URL +
                                `/content/${contents[4].id}`,
                            button_text: '確認する',
                            more_text: 'もっとみる...',
                            more_url:
                                config.CURRENT_APP_URL +
                                `/pickup/opinions?${params}`,
                            inc_name: config.INC_FULL_NAME,
                            unsubscribe_text: 'メールの通知を解除したい場合は',
                            unsubscribe_url:
                                config.CURRENT_APP_URL +
                                '/api/v1/notification/email/stop?token=' +
                                identity.mail_notification_token,
                            unsubscribe: 'こちらから',
                            contact: '会社住所・お問い合わせ',
                        }
                    );
                })
        ).catch(e => {
            throw new ApiError({
                error: e,
                tt_key: 'errors.invalid_response_from_server',
            });
        });
    }
}
