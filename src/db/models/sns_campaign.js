import data_config from '@constants/data_config';
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    var SnsCampaign = sequelize.define(
        'SnsCampaign',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            UserId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
            },
            url: {
                type: DataTypes.STRING(255),
            },
            provider: {
                type: DataTypes.STRING(255),
            },
            times: {
                type: DataTypes.INTEGER,
            },
            likes: {
                type: DataTypes.INTEGER,
            },
            reposts: {
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
            tableName: 'snsCampaigns',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,

            classMethods: {
                associate: function(models) {
                    SnsCampaign.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    SnsCampaign.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            UserId: self.UserId,
            amount: self.amount,
            url: self.url,
            provider: self.provider,
            times: self.times,
            likes: self.likes,
            reposts: self.reposts,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
        };
    };

    return SnsCampaign;
};
