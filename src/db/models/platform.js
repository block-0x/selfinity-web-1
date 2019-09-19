const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
import data_config from '@constants/data_config';

module.exports = function(sequelize, DataTypes) {
    var Platform = sequelize.define(
        'Platform',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            totalScore: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            totalPureScore: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            inflateTotalScore: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            inflateTotalPureScore: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
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
            tableName: 'platforms',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,

            classMethods: {
                associate: function(models) {},
            },
        }
    );

    Platform.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            totalSupply: self.totalSupply,
            allowTotalSupply: self.allowTotalSupply,
            totalScore: self.totalScore,
            totalPureScore: self.totalPureScore,
            inflateTotalScore: self.inflateTotalScore,
            inflateTotalPureScore: self.inflateTotalPureScore,
            intervalTotalScore: self.intervalTotalScore,
            intervalTotalPureScore: self.intervalTotalPureScore,
            interval_day: self.interval_day,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            createdAt: self.createdAt,
            updatedAt: self.updatedAt,
        };
    };

    return Platform;
};
