import data_config from '@constants/data_config';
import reward_config from '@constants/reward_config';

module.exports = function(sequelize, DataTypes) {
    var RequestUpVote = sequelize.define(
        'RequestUpVote',
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
            last_payout_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            last_payout_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            answer_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'answer_score',
                        !!this.getDataValue('score')
                            ? this.getDataValue('score') *
                              reward_config.default_answer_reward_ratio
                            : 0
                    );
                },
            },
            answer_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'answer_pure_score',
                        !!this.getDataValue('pure_score')
                            ? this.getDataValue('pure_score') *
                              reward_config.default_answer_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_answer_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_answer_score',
                        !!this.getDataValue('last_payout_score')
                            ? this.getDataValue('last_payout_score') *
                              reward_config.default_answer_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_answer_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_answer_pure_score',
                        !!this.getDataValue('last_payout_pure_score')
                            ? this.getDataValue('last_payout_pure_score') *
                              reward_config.default_answer_reward_ratio
                            : 0
                    );
                },
            },
            voter_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'voter_score',
                        !!this.getDataValue('score')
                            ? this.getDataValue('score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            voter_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'voter_pure_score',
                        !!this.getDataValue('pure_score')
                            ? this.getDataValue('pure_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_voter_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_voter_score',
                        !!this.getDataValue('last_payout_score')
                            ? this.getDataValue('last_payout_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_voter_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_voter_pure_score',
                        !!this.getDataValue('last_payout_pure_score')
                            ? this.getDataValue('last_payout_pure_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
                set: function(value) {
                    const s = this.getDataValue('score') || 0,
                        ps = this.getDataValue('pure_score') || 0,
                        ls = this.getDataValue('last_payout_score') || 0,
                        lps = this.getDataValue('last_payout_pure_score') || 0,
                        hasPendingPayout = s > ls || ps > lps;
                    if (!hasPendingPayout)
                        this.setDataValue('last_payout_at', new Date());
                },
            },
            hasPendingPayout: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                set: function(value) {
                    const s = this.getDataValue('score') || 0,
                        ps = this.getDataValue('pure_score') || 0,
                        ls = this.getDataValue('last_payout_score') || 0,
                        lps = this.getDataValue('last_payout_pure_score') || 0,
                        hasPendingPayout = s > ls || ps > lps;
                    this.setDataValue('hasPendingPayout', hasPendingPayout);
                },
            },
            deadline_cashout_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            max_accepted_payout: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            last_score_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
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
            tableName: 'requestUpvotes',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    RequestUpVote.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    RequestUpVote.belongsTo(models.Request, {
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

    RequestUpVote.Instance.prototype.toJSON = self => {
        return {
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            pure_score: self.pure_score,
            last_payout_score: self.last_payout_score,
            last_payout_pure_score: self.last_payout_pure_score,
            answer_score: self.answer_score,
            answer_pure_score: self.answer_pure_score,
            last_payout_answer_score: self.last_payout_answer_score,
            last_payout_answer_pure_score: self.last_payout_answer_pure_score,
            voter_score: self.voter_score,
            voter_pure_score: self.voter_pure_score,
            last_payout_voter_score: self.last_payout_voter_score,
            last_payout_voter_pure_score: self.last_payout_voter_pure_score,
            max_accepted_payout: self.max_accepted_payout,
            hasPendingPayout: self.hasPendingPayout,
            deadline_cashout_at: self.deadline_cashout_at,
            last_payout_at: self.last_payout_at,
            last_score_at: self.last_score_at,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,

            // User: self.User.toJSON() || null,
            // Request: self.Content.toJSON() || null,
        };
    };

    RequestUpVote.Instance.prototype.toMap = self => {
        return Map({
            VoterId: self.VoterId,
            VotedId: self.VotedId,
            score: self.score,
            pure_score: self.pure_score,
            answer_score: self.answer_score,
            answer_pure_score: self.answer_pure_score,
            voter_score: self.voter_score,
            voter_pure_score: self.voter_pure_score,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            ...self,
            // User: self.User.toJSON() || null,
            // Request: self.Content.toJSON() || null,
        });
    };
    return RequestUpVote;
};
