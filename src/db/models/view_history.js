module.exports = function(sequelize, DataTypes) {
    var ViewHistory = sequelize.define(
        'ViewHistory',
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
                field: 'user_id',
            },
            ContentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                field: 'content_id',
            },
            residence_time: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            meta: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
        },
        {
            tableName: 'viewHistories',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    ViewHistory.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'user_id',
                            allowNull: false,
                        },
                    });
                    ViewHistory.belongsTo(models.Content, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'content_id',
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    ViewHistory.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            UserId: self.UserId,
            ContentId: self.ContentId,
            residence_time: self.residence_time,
            meta: self.meta,
        };
    };

    return ViewHistory;
};
