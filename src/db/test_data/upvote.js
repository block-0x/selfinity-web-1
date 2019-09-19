const casual = require('casual');
const times = require('../utils/times');

const upvote = (users_limit, contents_limit) => {
    const score = casual.double((from = 0), (to = 1000));
    return {
        voter_id: casual.integer((from = 1), (to = users_limit)),
        voted_id: casual.integer((from = 1), (to = contents_limit)),
        country_code: 'JP',
        score: score,
        pure_score: score,
        last_payout_score: score,
        last_payout_pure_score: score,
        author_score: score * 0.9,
        author_pure_score: score * 0.9,
        last_payout_author_score: score * 0.9,
        last_payout_author_pure_score: score * 0.9,
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
        isCheering: true,
        isBetterOpinion: false,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function upvotes(limit = 30, users_number = 30, contents_number = 30) {
    let upvotes_array = [];
    await times(limit)(() => {
        upvotes_array.push(upvote(users_number, contents_number));
    });
    return upvotes_array;
}

module.exports = upvotes;
