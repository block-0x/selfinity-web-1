const casual = require('casual');
const times = require('../utils/times');

const label = () => {
    return {
        title: casual.title,
        score: casual.double((from = 0), (to = 1000)),
        pure_score: casual.double((from = 0), (to = 1000)),
        vector: JSON.stringify(
            Array.apply(null, Array(50)).map(function() {
                return casual.double((from = -1), (to = 1));
            })
        ),
        locale: 'ja',
        count: 2,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function labels(limit = 30) {
    let labels_array = [];
    await times(limit)(() => {
        labels_array.push(label());
    });
    return labels_array;
}

module.exports = labels;
