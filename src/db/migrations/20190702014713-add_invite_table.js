'use strict';

const uuidv4 = require('uuid/v4');

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'invites',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                inviter_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'set null',
                },
                invited_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'set null',
                },
                inviter_amount: {
                    type: Sequelize.DECIMAL(
                        max_decimal_range,
                        min_decimal_range
                    ),
                },
                invited_amount: {
                    type: Sequelize.DECIMAL(
                        max_decimal_range,
                        min_decimal_range
                    ),
                },
                invite_code: {
                    type: Sequelize.STRING(255),
                },
                inviter_txnHash: {
                    type: Sequelize.STRING(255),
                },
                invited_txnHash: {
                    type: Sequelize.STRING(255),
                },
                times: {
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
