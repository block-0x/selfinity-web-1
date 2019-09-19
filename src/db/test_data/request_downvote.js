const casual = require('casual');
const times = require('../utils/times');

const requestDownvote = (users_limit, requests_limit) => {
    return {
        voter_id: casual.integer((from = 1), (to = users_limit)),
        voted_id: casual.integer((from = 1), (to = requests_limit)),
        country_code: 'JP',
        score: casual.double((from = 0), (to = 1000)),
        pure_score: casual.double((from = 0), (to = 1000)),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function requestDownvotes(
    limit = 30,
    users_number = 30,
    requests_number = 30
) {
    let requestDownvotes_array = [];
    await times(limit)(() => {
        requestDownvotes_array.push(
            requestDownvote(users_number, requests_number)
        );
    });
    return requestDownvotes_array;
}

module.exports = requestDownvotes;
