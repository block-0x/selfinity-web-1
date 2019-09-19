import data_config from '@constants/data_config';

module.exports = function(sequelize, DataTypes) {
    var RequestDownVote = sequelize.define(
        'RequestDownVote',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            VoterId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'voter_id',
            },
            VotedId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'requests',
                    key: 'id',
                },
                field: 'voted_id',
            },
            // vote score(B score)
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
            tableName: 'requestDownvotes',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    RequestDownVote.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    RequestDownVote.belongsTo(models.Request, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'voted_id',
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    RequestDownVote.Instance.prototype.toJSON = self => {
        return {
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            pure_score: self.pure_score,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,

            // User: self.User.toJSON() || null,
            // Request: self.Content.toJSON() || null,
        };
    };

    RequestDownVote.Instance.prototype.toMap = self => {
        return Map({
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            pure_score: self.pure_score,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,

            // User: self.User.toJSON() || null,
            // Request: self.Content.toJSON() || null,
        });
    };
    return RequestDownVote;
};
