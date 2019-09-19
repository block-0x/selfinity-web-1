const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const platform = key => {
    return {
        totalScore: casual.double((from = 0), (to = 1000)),
        totalPureScore: casual.double((from = 0), (to = 1000)),
        inflateTotalScore: 0,
        inflateTotalPureScore: 0,
        meta: '',
        country_code: 'JP',
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function platforms(limit = 30) {
    let platforms_array = [];
    await times(limit)(() => {
        platforms_array.push(platform(platforms_array.length));
    });
    return platforms_array;
}

module.exports = platforms;
