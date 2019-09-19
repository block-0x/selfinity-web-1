const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const invite = (key, users_limit) => {
    return {
        inviter_id: casual.integer((from = 1), (to = users_limit)),
        invited_id: casual.integer((from = 1), (to = users_limit)),
        meta: '',
        invite_code: '',
        inviter_txnHash: '0x00',
        invited_txnHash: '0x00',
        inviter_amount: casual.double((from = -1000), (to = 1000)),
        invited_amount: casual.double((from = -1000), (to = 1000)),
        times: casual.integer((from = 0), (to = 10)),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function invites(limit = 30, users_number = 30) {
    let invites_array = [];
    await times(limit)(() => {
        invites_array.push(invite(invites_array.length, users_number));
    });
    return invites_array;
}

module.exports = invites;
