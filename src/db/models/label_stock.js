import { Map } from 'immutable';

module.exports = function(sequelize, DataTypes) {
    var LabelStock = sequelize.define(
        'LabelStock',
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
            tableName: 'labelStocks',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    LabelStock.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                    LabelStock.belongsTo(models.Label, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    LabelStock.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,

            Label: self.Label.toJSON(self.Label),
            User: self.User.toJSON(self.User),
        };
    };

    LabelStock.Instance.prototype.toMap = self => {
        return {
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,

            Label: self.Label.toJSON(self.Label),
            User: self.User.toJSON(self.User),
        };
    };

    return LabelStock;
};
