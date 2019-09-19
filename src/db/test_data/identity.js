const casual = require('casual'); //.ja_JP;
const gender = ['mail', 'femail'];
const times = require('../utils/times');

const identity = users_limit => {
    return {
        user_id: casual.integer((from = 1), (to = users_limit)),
        email: casual.email,
        delete_password_token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY29uZmlybV9lbWFpbCIsImVtYWlsIjoidGgyNzg3NjMxNEBpY2xvdWQuY29tIiwiaWF0IjoxNTUwNzIxODY5fQ.xCQCe1Dmh1Hp4yOcSgzjdot7hgauF4gIMAWaqfJtn6A',
        isDelete: false /*casual.boolean*/,
        token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiY29uZmlybV9lbWFpbCIsImVtYWlsIjoidGgyNzg3NjMxNEBpY2xvdWQuY29tIiwiaWF0IjoxNTUwNzIxODY5fQ.xCQCe1Dmh1Hp4yOcSgzjdot7hgauF4gIMAWaqfJtn6A',
        email_is_verified: true /*casual.boolean*/,
        last_attempt_verify_email: new Date(),
        phone_number: casual.phone,
        phone_number_is_verified: false,
        last_attempt_verify_phone_number: new Date(),
        phone_code_attempts: 0,
        phone_code: '',
        country_code: 'JP',
        username: casual.name,
        permission: true,
        account_is_created: true,
        confirmation_code: '',
        username_booked_at: new Date(),
        password_hash:
            '$2a$10$IsGkaweZ1CkqelMLjkMfJuEM9y8asagt74Y1ES8zXqzbhVFFA4lXO',
        password: '',
        verified: true,
        bot: false,
        permission: true,
        created_at: new Date(),
        updated_at: new Date(),
    };
};

async function identities(limit = 30) {
    let identities_array = [];
    await times(limit)(() => {
        identities_array.push(identity(limit));
    });
    return identities_array;
}

module.exports = identities;
