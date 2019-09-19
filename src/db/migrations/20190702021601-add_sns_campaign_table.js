'use strict';

const uuidv4 = require('uuid/v4');

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'snsCampaigns',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'set null',
                },
                amount: {
                    type: Sequelize.DECIMAL(
                        max_decimal_range,
                        min_decimal_range
                    ),
                },
                url: {
                    type: Sequelize.STRING(255),
                },
                provider: {
                    type: Sequelize.STRING(255),
                },
                times: {
                    type: Sequelize.INTEGER,
                },
                likes: {
                    type: Sequelize.INTEGER,
                },
                reposts: {
                    type: Sequelize.INTEGER,
                },
                meta: {
                    type: Sequelize.STRING(255),
                },
                isPrivate: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                valid: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                permission: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            },
            {
                engine: 'InnoDB ROW_FORMAT=DYNAMIC',
            }
        );
    },

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
