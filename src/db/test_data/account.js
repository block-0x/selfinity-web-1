const casual = require('casual');
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const account = key => {
    return {
        user_id: key + 1,
        name: casual.name,
        first_name: casual.first_name,
        last_name: casual.last_name,
        birthday: new Date(),
        address: casual.address,
        gender: gender[Math.floor(Math.random() * 2)],
        // owner_private_key:
        //     '0x3f2b71a354ce722f95f612c5dc89529715f3c2faf772454ce8c347e16563059c',
        active_key:
            '0x3f2b71a354ce722f95f612c5dc89529715f3c2faf772454ce8c347e16563059c',
        posting_key:
            '0x3f2b71a354ce722f95f612c5dc89529715f3c2faf772454ce8c347e16563059c',
        memo_key:
            '0x3f2b71a354ce722f95f612c5dc89529715f3c2faf772454ce8c347e16563059c',
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function accounts(limit = 30) {
    let accounts_array = [];
    await times(limit)(() => {
        accounts_array.push(account(accounts_array.length));
    });
    return accounts_array;
}

module.exports = accounts;
