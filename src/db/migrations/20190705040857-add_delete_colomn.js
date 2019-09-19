'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('identities', 'delete_password_token', {
                type: Sequelize.STRING(255),
            }),
            queryInterface.addColumn('identities', 'isDelete', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
