import data_config from '@constants/data_config';
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    var BidTransaction = sequelize.define(
        'BidTransaction',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            request_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'requests',
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
            },
            toAddress: {
                type: DataTypes.STRING(255),
            },
            fromAddress: {
                type: DataTypes.STRING(255),
            },
            meta: {
                type: DataTypes.STRING(255),
            },
            country_code: {
                type: DataTypes.STRING(255),
            },
            txnHashBid: {
                type: DataTypes.STRING(255),
            },
            txnHashResult: {
                type: DataTypes.STRING(255),
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
            tableName: 'bidTransactions',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,

            classMethods: {
                associate: function(models) {
                    BidTransaction.belongsTo(models.Request, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    BidTransaction.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            RequestId: self.RequestId,
            amount: self.amount,
            toAddress: self.toAddress,
            fromAddress: self.fromAddress,
            meta: self.meta,
            country_code: self.country_code,
            txnHashBid: self.txnHashBid,
            txnHashResult: self.txnHashResult,
            isPending: self.isPending,
            isSuccess: self.isSuccess,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            createdAt: self.createdAt,
            updatedAt: self.updatedAt,
        };
    };

    return BidTransaction;
};
