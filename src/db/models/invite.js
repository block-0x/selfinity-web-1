import data_config from '@constants/data_config';
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    var Invite = sequelize.define(
        'Invite',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            InvitedId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'invited_id',
                onUpdate: 'cascade',
                onDelete: 'set null',
            },
            InviterId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'inviter_id',
                onUpdate: 'cascade',
                onDelete: 'set null',
            },
            inviter_amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
            },
            invited_amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
            },
            invite_code: {
                type: DataTypes.STRING(255),
            },
            inviter_txnHash: {
                type: DataTypes.STRING(255),
            },
            invited_txnHash: {
                type: DataTypes.STRING(255),
            },
            times: {
                type: DataTypes.INTEGER,
            },
            meta: {
                type: DataTypes.STRING(255),
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
            tableName: 'invites',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,

            classMethods: {
                associate: function(models) {
                    Invite.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'inviter_id',
                            allowNull: false,
                        },
                    });
                    Invite.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'invited_id',
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Invite.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            InvitedId: self.InvitedId,
            InviterId: self.InviterId,
            invited_amount: self.invited_amount,
            inviter_amount: self.inviter_amount,
            invite_code: self.invite_code,
            inviter_txnHash: self.inviter_txnHash,
            invited_txnHash: self.invited_txnHash,
            times: self.times,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
        };
    };

    return Invite;
};
