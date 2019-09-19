'use strict';

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('contents', 'token_amount', {
                type: Sequelize.DECIMAL(max_decimal_range, min_decimal_range),
                defaultValue: 0,
            }),
            queryInterface.addColumn('upvotes', 'token_amount', {
                type: Sequelize.DECIMAL(max_decimal_range, min_decimal_range),
                defaultValue: 0,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
