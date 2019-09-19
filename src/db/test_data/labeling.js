const casual = require('casual');
const times = require('../utils/times');

const labeling = (contents_limit, labels_limit) => {
    return {
        label_id: casual.integer((from = 1), (to = labels_limit)),
        content_id: casual.integer((from = 1), (to = contents_limit)),
        color: casual.rgb_hex,
        url: '',
        meta: '',
        bot: true,
        isPrivate: false,
        valid: true,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function labelings(limit = 30, labels_number = 30, contents_number = 30) {
    let labelings_array = [];
    await times(limit)(() => {
        labelings_array.push(labeling(contents_number, labels_number));
    });
    return labelings_array;
}

module.exports = labelings;
