'use strict';

const uuidv4 = require('uuid/v4');

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'bridges',
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
                gasTokenPrice: {
                    type: Sequelize.DECIMAL(
                        max_decimal_range,
                        min_decimal_range
                    ),
                },
                toAddress: {
                    type: Sequelize.STRING(255),
                },
                meta: {
                    type: Sequelize.STRING(255),
                },
                country_code: {
                    type: Sequelize.STRING(255),
                },
                txnHashPrivate: {
                    type: Sequelize.STRING(255),
                },
                txnHashMain: {
                    type: Sequelize.STRING(255),
                },
                isPending: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
                },
                isSuccess: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false,
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

    down: function(queryInterface, Sequelize) {
        throw new Error('The initial migration is not revertable');
    },
};
