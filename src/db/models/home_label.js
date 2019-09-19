import data_config from '@constants/data_config';
import { Map } from 'immutable';

const end_at_init = new Date().setMonth(new Date().getMonth() + 1);

module.exports = function(sequelize, DataTypes) {
    var HomeLabel = sequelize.define(
        'HomeLabel',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            LabelId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'labels',
                    key: 'id',
                },
                field: 'label_id',
            },
            UserId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'user_id',
            },
            meta: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            url: {
                type: DataTypes.STRING,
                defaultValue: '',
            },
            color: {
                type: DataTypes.STRING,
                defaultValue: '#FFA500',
            },
            score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            start_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            end_at: {
                type: DataTypes.DATE,
                defaultValue: end_at_init,
            },
            repeat_span: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            remind: {
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
            tableName: 'homeLabels',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    HomeLabel.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                    HomeLabel.belongsTo(models.Label, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    HomeLabel.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            color: self.color,
            url: self.url,
            meta: self.meta,
            score: self.score,
            pure_score: self.pure_score,
            start_at: self.start_at,
            end_at: self.end_at,
            repeat_span: self.repeat_span,
            remind: self.remind,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            Label: self.Label ? self.Label.toJSON(self.Label) : [],
        };
    };

    HomeLabel.Instance.prototype.toMap = self => {
        return Map({
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            color: self.color,
            url: self.url,
            meta: self.meta,
            score: self.score,
            pure_score: self.pure_score,
            start_at: self.start_at,
            end_at: self.end_at,
            repeat_span: self.repeat_span,
            remind: self.remind,
            isPrivate: self.isPrivate,
            valid: self.valid,
        });
    };

    return HomeLabel;
};
