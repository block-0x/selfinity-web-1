const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const bridge = (key, users_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        meta: '',
        toAddress: '0x00',
        amount: casual.double((from = -1000), (to = 1000)),
        country_code: 'JP',
        txnHashPrivate: '0x00',
        txnHashMain: '0x00',
        isPending: false,
        isSuccess: true,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function bridges(limit = 30, users_number = 30) {
    let bridges_array = [];
    await times(limit)(() => {
        bridges_array.push(bridge(bridges_array.length, users_number));
    });
    return bridges_array;
}

module.exports = bridges;
