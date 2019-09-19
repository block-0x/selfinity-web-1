import { Map } from 'immutable';
import data_config from '@constants/data_config';

module.exports = function(sequelize, DataTypes) {
    var Label = sequelize.define(
        'Label',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            title: {
                type: DataTypes.STRING,
                defaultValue: '',
                unique: true,
                validate: {
                    min: data_config.label_title_min_limit,
                    max: data_config.label_title_max_limit,
                },
            },
            vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('vector') ||
                        this.getDataValue('vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'vector',
                            JSON.stringify(
                                Array.apply(
                                    null,
                                    Array(data_config.w2v_size)
                                ).map(function() {
                                    return 0;
                                })
                            )
                        );
                    } else {
                        this.setDataValue('vector', JSON.stringify(value));
                    }
                },
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
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            sum_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            sum_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
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
            tableName: 'labels',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    Label.hasMany(models.Labeling);
                    Label.hasMany(models.Interest);
                    Label.hasMany(models.HomeLabel);
                    Label.hasMany(models.LabelStock);
                    Label.belongsToMany(models.Content, {
                        through: 'Labeling',
                        foreignKey: 'label_id',
                        otherKey: 'content_id',
                    });
                    Label.belongsToMany(models.User, {
                        through: 'Interest',
                        foreignKey: 'label_id',
                        otherKey: 'user_id',
                    });
                    Label.belongsToMany(models.User, {
                        through: 'HomeLabel',
                        foreignKey: 'label_id',
                        otherKey: 'user_id',
                    });
                    Label.belongsToMany(models.User, {
                        through: 'LabelStock',
                        foreignKey: 'label_id',
                        otherKey: 'user_id',
                    });
                },
            },
        }
    );

    Label.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            title: self.title,
            score: self.score,
            pure_score: self.pure_score,
            sum_score: self.sum_score,
            sum_pure_score: self.sum_pure_score,
            count: self.count,
            vector:
                self.vector ||
                Array.apply(null, Array(data_config.w2v_size)).map(() => 0),
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            updated_at: self.updated_at,
            created_at: self.created_at,
            Labelings: !!self.Labelings
                ? self.Labelings.map(val => {
                      return val.toJSON(val);
                  })
                : [],
            LabelStocks: !!self.LabelStocks
                ? self.LabelStocks.map(val => {
                      return val.toJSON(val);
                  })
                : [],
        };
    };

    Label.Instance.prototype.toMap = self => {
        return Map({
            id: self.id,
            title: self.title,
            score: self.score,
            pure_score: self.pure_score,
            sum_score: self.sum_score,
            sum_pure_score: self.sum_pure_score,
            count: self.count,
            vector: self.vector,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            updated_at: self.updated_at,
            created_at: self.created_at,
            Labelings: !!self.Labelings
                ? self.Labelings.map(val => {
                      return val.toJSON(val);
                  })
                : [],
            LabelStocks: !!self.LabelStocks
                ? self.LabelStocks.map(val => {
                      return val.toJSON(val);
                  })
                : [],
        });
    };

    return Label;
};
