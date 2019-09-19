import { Map } from 'immutable';

module.exports = function(sequelize, DataTypes) {
    var Labeling = sequelize.define(
        'Labeling',
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
            ContentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                field: 'content_id',
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
            bot: {
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
            tableName: 'labelings',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    Labeling.belongsTo(models.Content, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                    Labeling.belongsTo(models.Label, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Labeling.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            LabelId: self.LabelId,
            ContentId: self.ContentId,
            color: self.color,
            url: self.url,
            meta: self.meta,
            bot: self.bot,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            updated_at: self.updated_at,
            created_at: self.created_at,
            Label: self.Label.toJSON(self.Label),
        };
    };

    Labeling.Instance.prototype.toMap = self => {
        return Map({
            id: self.id,
            LabelId: self.LabelId,
            ContentId: self.ContentId,
            color: self.color,
            bot: self.bot,
            url: self.url,
            meta: self.meta,
            isPrivate: self.isPrivate,
            valid: self.valid,
            updated_at: self.updated_at,
            created_at: self.created_at,
            permission: self.permission,
        });
    };

    return Labeling;
};
