'use strict';

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('searchHistories', 'table_name', {
                type: Sequelize.STRING(255),
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
