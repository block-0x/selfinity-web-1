'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('contents', 'isCheering', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('contents', 'isBetterOpinion', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('upvotes', 'isBetterOpinion', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
