const casual = require('casual');
const times = require('../utils/times');

const homeLabel = (users_limit, labels_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        label_id: casual.integer((from = 1), (to = labels_limit)),
        color: casual.rgb_hex,
        url: '',
        meta: '',
        start_at: casual.moment.toDate(),
        end_at: casual.moment.toDate(),
        repeat_span: casual.integer((from = 1), (to = 24)),
        remind: true,
        score: casual.double((from = 0), (to = 1000)),
        pure_score: casual.double((from = 0), (to = 1000)),
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function homeLabels(limit = 30, users_number = 30, labels_number = 30) {
    let homeLabels_array = [];
    await times(limit)(() => {
        homeLabels_array.push(homeLabel(users_number, labels_number));
    });
    return homeLabels_array;
}

module.exports = homeLabels;
