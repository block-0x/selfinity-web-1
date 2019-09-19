'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('identities', 'facebook_id', {
                type: Sequelize.STRING(126),
                unique: true,
            }),
            queryInterface.addColumn('identities', 'instagram_id', {
                type: Sequelize.STRING(126),
                unique: true,
            }),
            queryInterface.addColumn('identities', 'twitter_id', {
                type: Sequelize.STRING(126),
                unique: true,
            }),
            queryInterface.addColumn('identities', 'invited_code', {
                type: Sequelize.STRING(255),
            }),
            queryInterface.addColumn('users', 'invite_code', {
                type: Sequelize.STRING(126),
                unique: true,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
