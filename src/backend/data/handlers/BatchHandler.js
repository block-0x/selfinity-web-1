import HandlerImpl from '@handlers/HandlerImpl';
import { Set, Map, fromJS, List } from 'immutable';
import { call, put, select, takeEvery } from 'redux-saga/effects';
import models from '@models';
import { NotificationDataStore } from '@datastore';
import validator from 'validator';
import mail from '@network/mail';
import cron from 'node-cron';
import config from '@constants/config';
import notification_config from '@constants/notification_config';

const notificationDataStore = new NotificationDataStore();

export default class BatchHandler extends HandlerImpl {
    constructor() {
        super();
    }

    async handleBatchRequest(router, ctx, next) {
        cron.schedule(
            notification_config.notification_pickup_cron,
            () => notificationDataStore.onDailySummary(),
            {
                scheduled: true,
                timezone: 'Asia/Tokyo',
            }
        );

        cron.schedule(
            notification_config.notification_pickup_opinion_cron,
            () => notificationDataStore.onDailyOpinion(),
            {
                scheduled: true,
                timezone: 'Asia/Tokyo',
            }
        );

        router.body = {
            success: true,
        };
    }

    async handleDailySummaryRequest(router, ctx, next) {
        await notificationDataStore.onDailySummary();
        router.body = {
            success: true,
        };
    }

    async handleDailyOpinionRequest(router, ctx, next) {
        await notificationDataStore.onDailyOpinion();
        router.body = {
            success: true,
        };
    }
}
