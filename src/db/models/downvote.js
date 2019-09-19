import { Map } from 'immutable';
import CONTENT_TYPE from '@entity/ContentType';
import SUBMIT_TYPE from '@entity/SubmitType';
import data_config from '@constants/data_config';

module.exports = function(sequelize, DataTypes) {
    var DownVote = sequelize.define(
        'DownVote',
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
                    model: 'contents',
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
            tableName: 'downvotes',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    DownVote.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    DownVote.belongsTo(models.Content, {
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

    DownVote.Instance.prototype.toJSON = self => {
        return {
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            pure_score: self.pure_score,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
        };
    };

    DownVote.Instance.prototype.toMap = self => {
        return Map({
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
        });
    };

    return DownVote;
};
