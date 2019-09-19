import { Map } from 'immutable';

module.exports = function(sequelize, DataTypes) {
    var Interest = sequelize.define(
        'Interest',
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
            //@action: this is a string of like or post or repost or stock or import or task...
            action: {
                type: DataTypes.STRING(255),
                defaultValue: 'upvote',
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
            isPrivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isCorrect: {
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
            tableName: 'interests',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    Interest.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                    Interest.belongsTo(models.Label, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Interest.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            color: self.color,
            action: self.action,
            url: self.url,
            meta: self.meta,
            isPrivate: self.isPrivate,
            isCorrect: self.isCorrect,
            valid: self.valid,
            permission: self.permission,
        };
    };

    Interest.Instance.prototype.toMap = self => {
        return Map({
            id: self.id,
            LabelId: self.LabelId,
            UserId: self.UserId,
            color: self.color,
            action: self.action,
            url: self.url,
            meta: self.meta,
            isPrivate: self.isPrivate,
            isCorrect: self.isCorrect,
            valid: self.valid,
        });
    };

    return Interest;
};
