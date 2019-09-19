const casual = require('casual');
const times = require('../utils/times');
const actions = ['upvote', 'downvote', 'post', 'repost', 'stock'];

const interest = (users_limit, labels_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        label_id: casual.integer((from = 1), (to = labels_limit)),
        color: casual.rgb_hex,
        action: actions[0],
        meta: '',
        url: '',
        isCorrect: false,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function interests(limit = 30, users_number = 30, labels_number = 30) {
    let interests_array = [];
    await times(limit)(() => {
        interests_array.push(interest(users_number, labels_number));
    });
    return interests_array;
}

module.exports = interests;
