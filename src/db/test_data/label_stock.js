const casual = require('casual');
const times = require('../utils/times');

const label_stock = (users_limit, labels_limit) => {
    return {
        label_id: casual.integer((from = 1), (to = labels_limit)),
        user_id: casual.integer((from = 1), (to = users_limit)),
        meta: '',
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function label_stocks(limit = 30, labels_number = 30, users_number = 30) {
    let label_stocks_array = [];
    await times(limit)(() => {
        label_stocks_array.push(label_stock(users_number, labels_number));
    });
    return label_stocks_array;
}

module.exports = label_stocks;
