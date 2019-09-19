import { INVITE_TYPE } from '@entity/InviteEntity';

const inviter_avarage = 500;
const invited_avarage = 500;
const invite_max_limit = INVITE_TYPE._enums.length;
const invited_max_limit = 1;
const invite_date_max_limit = 3;

const bonus = i =>
    INVITE_TYPE._enums[i] ? INVITE_TYPE._enums[i].value + inviter_avarage : 0;

module.exports = {
    inviter_avarage,
    invited_avarage,
    bonus,
    invite_max_limit,
    invited_max_limit,
    invite_date_max_limit,
};
