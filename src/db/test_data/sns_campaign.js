const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const snsCampaign = (key, users_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        meta: '',
        provider: '',
        url: '',
        amount: casual.double((from = -1000), (to = 1000)),
        times: casual.integer((from = 0), (to = 10)),
        likes: casual.integer((from = 0), (to = 10)),
        reposts: casual.integer((from = 0), (to = 10)),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function snsCampaigns(limit = 30, users_number = 30) {
    let snsCampaigns_array = [];
    await times(limit)(() => {
        snsCampaigns_array.push(
            snsCampaign(snsCampaigns_array.length, users_number)
        );
    });
    return snsCampaigns_array;
}

module.exports = snsCampaigns;
