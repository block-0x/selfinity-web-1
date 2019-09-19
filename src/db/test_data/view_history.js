const casual = require('casual');
const times = require('../utils/times');

const viewHistory = (users_limit, contents_limit) => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        content_id: casual.integer((from = 1), (to = contents_limit)),
        residence_time: new Date(),
        meta: '',
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function viewHistories(
    limit = 30,
    users_number = 30,
    contents_number = 30
) {
    let viewHistories_array = [];
    await times(limit)(() => {
        viewHistories_array.push(viewHistory(users_number, contents_number));
    });
    return viewHistories_array;
}

module.exports = viewHistories;
