'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('contents', 'isOpinionWanted', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('contents', 'isRequestWanted', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
