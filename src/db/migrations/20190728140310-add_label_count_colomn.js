'use strict';

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('labels', 'count', {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            }),
            queryInterface.addColumn('labels', 'sum_pure_score', {
                type: Sequelize.DECIMAL(max_decimal_range, min_decimal_range),
                defaultValue: 0,
            }),
            queryInterface.addColumn('labels', 'sum_score', {
                type: Sequelize.DECIMAL(max_decimal_range, min_decimal_range),
                defaultValue: 0,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
