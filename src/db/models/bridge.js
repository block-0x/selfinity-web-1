import data_config from '@constants/data_config';
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    var Bridge = sequelize.define(
        'Bridge',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'cascade',
                onDelete: 'set null',
            },
            amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            gasTokenPrice: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            toAddress: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            txnHashPrivate: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            txnHashMain: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            country_code: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            meta: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            isPending: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isPrivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            valid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            permission: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'bridges',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,

            classMethods: {
                associate: function(models) {
                    Bridge.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Bridge.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            UserId: self.UserId,
            amount: self.amount,
            toAddress: self.toAddress,
            meta: self.meta,
            country_code: self.country_code,
            txnHash: self.txnHash,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            createdAt: self.createdAt,
            updatedAt: self.updatedAt,
        };
    };

    return Bridge;
};
