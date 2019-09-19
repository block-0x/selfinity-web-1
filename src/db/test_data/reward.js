const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const reward = (key, users_limit, platforms_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        meta: '',
        amount: casual.double((from = -1000), (to = 1000)),
        totalScore: 0,
        totalPureScore: 0,
        score: 0,
        pure_score: 0,
        score_rate: 0,
        pure_score_rate: 0,
        interval: 0,
        intervalSupply: 0,
        country_code: 'JP',
        txnHash: '0x00',
        isPending: false,
        isSuccess: true,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function rewards(limit = 30, users_number = 30, platforms_number = 30) {
    let rewards_array = [];
    await times(limit)(() => {
        rewards_array.push(
            reward(rewards_array.length, users_number, platforms_number)
        );
    });
    return rewards_array;
}

module.exports = rewards;
