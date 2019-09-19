const casual = require('casual');
const gender = ['mail', 'femail'];
const times = require('../utils/times');
const uuidv4 = require('uuid/v4');

const user = () => {
    return {
        username: casual.username + uuidv4(),
        nickname: casual.username,
        detail: casual.sentences((n = 3)),
        picture_small:
            'https://i0.wp.com/sk-imedia.com/wp-content/uploads/2015/05/osyarega1-e1430436385100.jpg?zoom=2&fit=580%2C387&ssl=1',
        picture_large:
            'https://i0.wp.com/sk-imedia.com/wp-content/uploads/2015/05/osyarega1-e1430436385100.jpg?zoom=2&fit=580%2C387&ssl=1',
        eth_address: '0x96b020d7D25B785F078875953FCc2a420FbF6fe9',
        invite_code: uuidv4(),
        token_balance: parseFloat(casual.double((from = 0), (to = 1000))),
        score: parseFloat(casual.double((from = 0), (to = 1000))),
        pure_score: casual.double((from = 0), (to = 1000)),
        vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        upvote_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        view_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        post_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        follow_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        follower_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        request_post_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        request_upvote_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        label_stock_vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        locale: 'ja_JP.UTF-8',
        country_code: 'JP',
        timezone: 'Asia/Tokyo',
        verified: true /*Math.floor(Math.random()*2) == 0*/,
        bot: false,
        sign_up_meta: '',
        isPrivate: false,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function users(limit = 30) {
    let users_array = [];
    await times(limit)(() => {
        users_array.push(user());
    });
    return users_array;
}

module.exports = users;
