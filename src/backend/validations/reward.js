// import { ClientError, ApiError } from '@extension/Error';
// import { ValidationEntity, ValidationEntities } from '@entity/ValidationEntity';
// import models from '@models';
// import badDomains from '@constants/bad-domains';
// import data_config from '@constants/data_config';
// import validator from 'validator';
// import { ACTION_TYPE } from '@entity';
// import {
//     apiUnwrapData,
//     apiCheckEmailFormat,
//     apiCheckEmailIsBadDomain,
//     apiCheckUserIsVerfied,
// } from '@validations';

// export const apiCheckRewardTitle = new ValidationEntity({
//     validate: async arg => {
//         const { content } = arg;
//         if (!content.title) return false;
//         return (
//             `${content.title}`.length > data_config.title_min_limit &&
//             `${content.title}`.length < data_config.title_max_limit
//         );
//     },
//     error: arg => {
//         throw new ApiError({
//             error: new Error('title is not correct format'),
//             tt_key: 'errors.is_text_min_max_limit',
//             tt_params: {
//                 data: 'g.title',
//                 min: data_config.title_min_limit,
//                 max: data_config.title_max_limit,
//             },
//         });
//     },
// });

// export const apiRewardValidates = new ValidationEntities({
//     items: [
//         apiUnwrapData('platform'),
//         apiUnwrapData('repository'),
//     ],
// });
