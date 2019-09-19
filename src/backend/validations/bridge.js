import { ClientError, ApiError } from '@extension/Error';
import { ValidationEntity, ValidationEntities } from '@entity/ValidationEntity';
import models from '@models';
import badDomains from '@constants/bad-domains';
import data_config from '@constants/data_config';
import validator from 'validator';
import { ACTION_TYPE } from '@entity';
import {
    apiUnwrapData,
    apiCheckInteger,
    apiCheckEthAddress,
} from '@validations';
import { apiCheckUserIsValid } from '@validations/user';
import bridge_config from '@constants/bridge_config';
import { Decimal } from 'decimal.js';

export const apiCheckAmount = new ValidationEntity({
    validate: async arg => {
        let { amount } = arg;
        if (!amount) return false;
        amount = amount instanceof Decimal ? amount : new Decimal(amount);
        return (
            amount.greaterThan(new Decimal(bridge_config.min_send_token)) ||
            amount.lessThan(new Decimal(bridge_config.max_send_token))
        );
    },
    error: arg => {
        throw new ApiError({
            error: new Error('body is not correct format'),
            tt_key: 'errors.is_min_max_limit',
            tt_params: {
                data: 'g.send_amount',
                min: bridge_config.min_send_token,
                max: bridge_config.max_send_token,
            },
        });
    },
});

export const apiBridgeValidates = new ValidationEntities({
    items: [
        apiUnwrapData('user'),
        apiUnwrapData('amount'),
        apiUnwrapData('toAddress'),
        apiCheckAmount,
        // apiCheckInteger('amount'),
        apiCheckEthAddress('toAddress'),
    ],
});
