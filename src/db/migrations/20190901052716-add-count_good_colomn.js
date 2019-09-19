'use strict';

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('contents', 'cheering_count', {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            }),
            queryInterface.addColumn('contents', 'good_opinion_count', {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            }),
            queryInterface.addColumn('upvotes', 'isCheering', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('upvotes', 'isBetterAnswer', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('requests', 'bid_amount', {
                type: Sequelize.DECIMAL(max_decimal_range, min_decimal_range),
                defaultValue: 0,
            }),
            queryInterface.addColumn('requests', 'hasPendingSuccessfulBid', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
