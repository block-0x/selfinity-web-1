'use strict';

const uuidv4 = require('uuid/v4');

const max_decimal_range = 65;
const min_decimal_range = 4;

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(
            'accessTokens',
            {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                identity_id: {
                    type: Sequelize.INTEGER,
                    references: {
                        model: 'identities',
                        key: 'id',
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                },
                client_id: {
                    type: Sequelize.STRING(255),
                },
                token: {
                    type: Sequelize.STRING(255),
                },
                expired_at: {
                    type: Sequelize.DATE,
                },
                meta: {
                    type: Sequelize.STRING(255),
                },
                isOneTime: {
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

    down: (queryInterface, Sequelize) => {
        throw new Error('The initial migration is not revertable');
    },
};
