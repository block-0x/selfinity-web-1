const casual = require('casual');
const times = require('../utils/times');

const requestUpvote = (users_limit, requests_limit) => {
    const score = casual.double((from = 0), (to = 1000));
    return {
        voter_id: casual.integer((from = 1), (to = users_limit)),
        voted_id: casual.integer((from = 1), (to = requests_limit)),
        country_code: 'JP',
        score: score,
        pure_score: score,
        last_payout_score: score,
        last_payout_pure_score: score,
        answer_score: score * 0.9,
        answer_pure_score: score * 0.9,
        last_payout_answer_score: score * 0.9,
        last_payout_answer_pure_score: score * 0.9,
        voter_score: score * 0.1,
        voter_pure_score: score * 0.1,
        last_payout_voter_score: score * 0.1,
        last_payout_voter_pure_score: score * 0.1,
        max_accepted_payout: '',
        hasPendingPayout: false,
        deadline_cashout_at: new Date(),
        last_payout_at: new Date(),
        last_score_at: new Date(),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function requestUpvotes(
    limit = 30,
    users_number = 30,
    requests_number = 30
) {
    let requestUpvotes_array = [];
    await times(limit)(() => {
        requestUpvotes_array.push(requestUpvote(users_number, requests_number));
    });
    return requestUpvotes_array;
}

module.exports = requestUpvotes;
