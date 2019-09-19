'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn('requests', 'assign_id', {
                type: Sequelize.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),
            queryInterface.addColumn('contents', 'isAssign', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
            queryInterface.addColumn('requests', 'isAssign', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            }),
        ]);
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
