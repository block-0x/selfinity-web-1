const casual = require('casual');
const times = require('../utils/times');

const downvote = (users_limit, contents_limit) => {
    return {
        voter_id: casual.integer((from = 1), (to = users_limit)),
        voted_id: casual.integer((from = 1), (to = contents_limit)),
        score: casual.double((from = 0), (to = 1000)),
        pure_score: casual.double((from = 0), (to = 1000)),
        country_code: 'JP',
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function downvotes(limit = 30, users_number = 30, contents_number = 30) {
    let downvotes_array = [];
    times(limit)(() => {
        downvotes_array.push(downvote(users_number, contents_number));
    });
    return downvotes_array;
}

module.exports = downvotes;
