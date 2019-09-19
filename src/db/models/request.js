import { Map } from 'immutable';
import CONTENT_TYPE from '@entity/ContentType';
import SUBMIT_TYPE from '@entity/SubmitType';
import {
    sanitize_html_text,
    clean_text_from_sanitize,
} from '@network/sanitize';
import reward_config from '@constants/reward_config';
import data_config from '@constants/data_config';

const sanitize_body = (request, options, callback) => {
    if (!request) return callback(null, options);
    if (request.get('body') == '') return callback(null, options);
    try {
        request.set('body', sanitize_html_text(request.get('body')));
        return callback(null, options);
    } catch (err) {
        return callback(err);
    }
};

const clean_body = (request, options, callback) => {
    if (!request) return callback(null, options);
    if (request.body == '' || !request.body) return callback(null, options);
    try {
        request.body = clean_text_from_sanitize(request.body, true, true, true);
        return callback(null, options);
    } catch (err) {
        return callback(err);
    }
};

module.exports = function(sequelize, DataTypes) {
    var Request = sequelize.define(
        'Request',
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
            VoteredId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                field: 'votered_id',
            },
            ContentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                field: 'content_id',
            },
            AssignId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                field: 'assign_id',
            },
            // request sum score(C score)
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
            voters_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'voters_score',
                        !!this.getDataValue('score')
                            ? this.getDataValue('score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            voters_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'voters_pure_score',
                        !!this.getDataValue('pure_score')
                            ? this.getDataValue('pure_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_voters_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_voters_score',
                        !!this.getDataValue('last_payout_score')
                            ? this.getDataValue('last_payout_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_voters_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_voters_pure_score',
                        !!this.getDataValue('last_payout_pure_score')
                            ? this.getDataValue('last_payout_pure_score') *
                              reward_config.default_voter_reward_ratio
                            : 0
                    );
                },
            },
            isResolved: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                //FIXME: not working
                // get: () => {
                //     const val = this.getDataValue('isResolved');
                //     if (!!val) {
                //         return val == 1 || val == true;
                //     } else {
                //         return false;
                //     }
                // },
            },
            isAccepted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                //FIXME: not working
                // get: () => {
                //     const val = this.getDataValue('isAccepted');
                //     if (!!val) {
                //         return val == 1 || val == true;
                //     } else {
                //         return false;
                //     }
                // },
            },
            isAnswered: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            hasPendingSuccessfulBid: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            bid_amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
            },
            url: {
                type: DataTypes.STRING,
                defaultValue: '',
                //unique: true,
            },
            title: {
                type: DataTypes.TEXT('long'),
                // validate: {
                //     min: data_config.title_min_limit,
                //     max: data_config.title_max_limit,
                // },
            },
            body: {
                type: DataTypes.TEXT('long'),
                validate: {
                    min: data_config.request_body_min_limit,
                    // max: data_config.request_body_max_limit,
                },
            },
            locale: {
                type: DataTypes.STRING(255),
            },
            country_code: {
                type: DataTypes.STRING(255),
            },
            meta: {
                type: DataTypes.STRING(255),
                defaultValue: '',
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
            //Status colomn
            isNsfw: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isHide: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            allowEdit: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            allowDelete: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            allowReply: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            allow_votes: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            allow_curation_rewards: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            //Payout colomn
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
            isAssign: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            //global colomn
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
            tableName: 'requests',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            timestamps: true,
            underscored: true,
            hooks: {
                beforeCreate: sanitize_body,
                beforeUpdate: sanitize_body,
                afterFind: clean_body,
            },
            classMethods: {
                associate: function(models) {
                    Request.hasMany(models.BidTransaction, {
                        as: 'BidTransactions',
                        foreignKey: {
                            name: 'request_id',
                            allowNull: false,
                        },
                    });
                    Request.hasMany(models.RequestUpVote, {
                        as: 'UpVotes',
                        foreignKey: {
                            name: 'voted_id',
                            allowNull: false,
                        },
                    });
                    Request.hasMany(models.RequestDownVote, {
                        as: 'DownVotes',
                        foreignKey: {
                            name: 'voted_id',
                            allowNull: false,
                        },
                    });
                    Request.belongsToMany(models.User, {
                        as: 'upvoting_users',
                        through: 'RequestUpVote',
                        foreignKey: 'voted_id',
                        otherKey: 'voter_id',
                    });
                    Request.belongsToMany(models.User, {
                        as: 'downvoting_users',
                        through: 'RequestDownVote',
                        foreignKey: 'voted_id',
                        otherKey: 'voter_id',
                    });
                    Request.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        as: 'Voter',
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    Request.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        as: 'TargetUser',
                        foreignKey: {
                            name: 'votered_id',
                            allowNull: false,
                        },
                    });
                    Request.belongsTo(models.Content, {
                        onDelete: 'CASCADE',
                        as: 'Content',
                        foreignKey: {
                            name: 'content_id',
                            allowNull: true,
                        },
                    });
                    Request.belongsTo(models.Content, {
                        onDelete: 'CASCADE',
                        as: 'AssignContent',
                        foreignKey: {
                            name: 'assign_id',
                            allowNull: true,
                        },
                    });
                },
            },
        }
    );

    Request.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            VoterId: self.VoterId,
            VoteredId: self.VoteredId,
            isResolved: self.isResolved,
            isAccepted: self.isAccepted,
            isAnswered: self.isAnswered,
            score: self.score,
            pure_score: self.pure_score,
            last_payout_score: self.last_payout_score,
            last_payout_pure_score: self.last_payout_pure_score,
            answer_score: self.answer_score,
            answer_pure_score: self.answer_pure_score,
            last_payout_answer_score: self.last_payout_answer_score,
            last_payout_answer_pure_score: self.last_payout_answer_pure_score,
            voters_score: self.voters_score,
            voters_pure_score: self.voters_pure_score,
            last_payout_voters_score: self.last_payout_voters_score,
            last_payout_voters_pure_score: self.last_payout_voters_pure_score,
            bid_amount: self.bid_amount,
            hasPendingSuccessfulBid: self.hasPendingSuccessfulBid,
            url: self.url,
            title: self.title,
            body: self.body,
            locale: self.locale,
            country_code: self.country_code,
            meta: self.meta,
            vector: self.vector,
            isNsfw: self.isNsfw,
            ishide: self.ishide,
            allowEdit: self.allowEdit,
            allowDelete: self.allowDelete,
            allowReply: self.allowReply,
            allow_votes: self.allow_votes,
            allow_curation_rewards: self.allow_curation_rewards,
            max_accepted_payout: self.max_accepted_payout,
            hasPendingPayout: self.hasPendingPayout,
            deadline_cashout_at: self.deadline_cashout_at,
            last_payout_at: self.last_payout_at,
            isAssign: self.isAssign,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            Voter: self.Voter,
            TargetUser: self.TargetUser,
            AssignContent: self.AssignContent,
        };
    };

    Request.Instance.prototype.toMap = self => {
        return Map({
            VoterId: self.VoterId,
            VoteredId: self.VoteredId,
            id: self.id,
            isResolved: self.isResolved,
            isAccepted: self.isAccepted,
            isAnswered: self.isAnswered,
            score: self.score,
            pure_score: self.pure_score,
            last_payout_score: self.last_payout_score,
            last_payout_pure_score: self.last_payout_pure_score,
            answer_score: self.answer_score,
            answer_pure_score: self.answer_pure_score,
            last_payout_answer_score: self.last_payout_answer_score,
            last_payout_answer_pure_score: self.last_payout_answer_pure_score,
            voters_score: self.voters_score,
            voters_pure_score: self.voters_pure_score,
            last_payout_voters_score: self.last_payout_voters_score,
            last_payout_voters_pure_score: self.last_payout_voters_pure_score,
            bid_amount: self.bid_amount,
            hasPendingSuccessfulBid: self.hasPendingSuccessfulBid,
            url: self.url,
            title: self.title,
            body: self.body,
            meta: self.meta,
            isNsfw: self.isNsfw,
            ishide: self.ishide,
            allowEdit: self.allowEdit,
            allowDelete: self.allowDelete,
            allowReply: self.allowReply,
            allow_votes: self.allow_votes,
            allow_curation_rewards: self.allow_curation_rewards,
            pending_payout_value: self.pending_payout_value,
            curator_payout_value: self.curator_payout_value,
            max_accepted_payout: self.max_accepted_payout,
            total_payout_value: self.total_payout_value,
            total_pending_payout_value: self.total_pending_payout_value,
            hasPendingPayout: self.hasPendingPayout,
            cashout_time: self.cashout_time,
            deadline_cashout_time: self.deadline_cashout_time,
            last_payout_at: self.last_payout_at,
            last_score_at: self.last_score_at,
            vector: self.vector,
            isPrivate: self.isPrivate,
            isAssign: self.isAssign,
            valid: self.valid,
            permission: self.permission,
            Voter: self.Voter,
            TargetUser: self.TargetUser,
        });
    };

    Request.Instance.prototype.getPureBody = self => {
        return self.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    };

    Request.Instance.prototype.getType = self => {
        if (self.id) {
            return SUBMIT_TYPE.Edit;
        } else {
            return SUBMIT_TYPE.Story;
        }
    };

    Request.Instance.prototype.getTypeValue = self => {
        if (self.id) {
            return SUBMIT_TYPE.Edit.value;
        } else {
            return SUBMIT_TYPE.Story.value;
        }
    };

    return Request;
};
