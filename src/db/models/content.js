import { Map } from 'immutable';
import CONTENT_TYPE from '@entity/ContentType';
import SUBMIT_TYPE from '@entity/SubmitType';
import {
    sanitize_html_text,
    clean_text_from_sanitize,
} from '@network/sanitize';
import safe2json from '@extension/safe2json';
import reward_config from '@constants/reward_config';
import data_config from '@constants/data_config';

const sanitize_body = (content, options, callback) => {
    if (!content) return callback(null, options);
    if (content.get('body') == '') return callback(null, options);
    try {
        content.set('body', sanitize_html_text(content.get('body')));
        return callback(null, options);
    } catch (err) {
        return callback(err);
    }
};

const clean_body = (content, options, callback) => {
    if (!content) return callback(null, options);
    if (content.body == '' || !content.body) return callback(null, options);
    try {
        content.body = clean_text_from_sanitize(content.body, true, true, true);
        return callback(null, options);
    } catch (err) {
        return callback(err);
    }
};

module.exports = function(sequelize, DataTypes) {
    var Content = sequelize.define(
        'Content',
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
            ParentId: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'contents',
                    key: 'id',
                },
                field: 'parent_id',
            },
            // content sum score(C score)
            token_amount: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
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
            author_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'author_score',
                        !!this.getDataValue('score')
                            ? this.getDataValue('score') *
                              reward_config.default_author_reward_ratio
                            : 0
                    );
                },
            },
            author_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'author_pure_score',
                        !!this.getDataValue('pure_score')
                            ? this.getDataValue('pure_score') *
                              reward_config.default_author_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_author_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_author_score',
                        !!this.getDataValue('last_payout_score')
                            ? this.getDataValue('last_payout_score') *
                              reward_config.default_author_reward_ratio
                            : 0
                    );
                },
            },
            last_payout_author_pure_score: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
                defaultValue: 0,
                set: function(value) {
                    this.setDataValue(
                        'last_payout_author_pure_score',
                        !!this.getDataValue('last_payout_pure_score')
                            ? this.getDataValue('last_payout_pure_score') *
                              reward_config.default_author_reward_ratio
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
            url: {
                type: DataTypes.STRING,
                defaultValue: '',
                //unique: true,
            },
            title: {
                type: DataTypes.TEXT('long'),
                validate: {
                    min: data_config.title_min_limit,
                    //FIXME: when type number as string, error raise 'MaxValidationError'
                    // max: data_config.title_max_limit,
                },
            },
            body: {
                type: DataTypes.TEXT('long'),
                validate: {
                    min: data_config.body_min_limit,
                    // max: data_config.body_max_limit,
                },
            },
            locale: {
                type: DataTypes.STRING(255),
            },
            country_code: {
                type: DataTypes.STRING(255),
            },
            // path: {
            //     type: DataTypes.STRING(255),
            //     defaultValue: '',
            // },
            meta: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            path: {
                type: DataTypes.STRING(255),
                defaultValue: '/',
            },
            count: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            cheering_count: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            good_opinion_count: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
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
            isStory: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
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
                    console.log(s, ps, ls, lps, hasPendingPayout);
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

            //Opinion Function colomn
            isCheering: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isBetterOpinion: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isBetterAnswer: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isAssign: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            //Wanted colomn
            isOpinionWanted: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            isRequestWanted: {
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
            tableName: 'contents',
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
                    Content.hasMany(models.Labeling);
                    Content.hasMany(models.Request, {
                        as: 'Requests',
                        foreignKey: {
                            name: 'content_id',
                            allowNull: true,
                        },
                    });
                    Content.hasMany(models.Request, {
                        as: 'Assigns',
                        foreignKey: {
                            name: 'assign_id',
                            allowNull: true,
                        },
                    });
                    Content.hasMany(models.UpVote, {
                        foreignKey: {
                            name: 'voted_id',
                            allowNull: false,
                        },
                    });
                    Content.hasMany(models.DownVote, {
                        foreignKey: {
                            name: 'voted_id',
                            allowNull: false,
                        },
                    });
                    Content.hasMany(models.Repost);
                    Content.hasMany(models.Content, {
                        foreignKey: {
                            name: 'parent_id',
                            allowNull: true,
                        },
                        as: 'children_contents',
                    });
                    Content.belongsTo(models.Content, {
                        as: 'ParentContent',
                        // onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'parent_id',
                            allowNull: true,
                        },
                    });
                    Content.belongsToMany(models.User, {
                        as: 'reposting_users',
                        through: 'Repost',
                        foreignKey: 'voted_id',
                        otherKey: 'voter_id',
                    });
                    Content.belongsToMany(models.User, {
                        as: 'upvoting_users',
                        through: 'UpVote',
                        foreignKey: 'voted_id',
                        otherKey: 'voter_id',
                    });
                    Content.belongsToMany(models.User, {
                        as: 'downvoting_users',
                        through: 'DownVote',
                        foreignKey: 'voted_id',
                        otherKey: 'voter_id',
                    });
                    Content.belongsToMany(models.Label, {
                        through: 'Labeling',
                        foreignKey: 'content_id',
                        otherKey: 'label_id',
                    });
                    Content.belongsToMany(models.User, {
                        as: 'watched_users',
                        through: 'ViewHistory',
                        foreignKey: 'content_id',
                        otherKey: 'user_id',
                    });
                    Content.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Content.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            UserId: self.UserId,
            ParentId: self.ParentId,
            token_amount: self.token_amount,
            score: self.score,
            pure_score: self.pure_score,
            sum_score: self.sum_score,
            sum_pure_score: self.sum_pure_score,
            last_payout_score: self.last_payout_score,
            last_payout_pure_score: self.last_payout_pure_score,
            author_score: self.author_score,
            author_pure_score: self.author_pure_score,
            last_payout_author_score: self.last_payout_author_score,
            last_payout_author_pure_score: self.last_payout_author_pure_score,
            voters_score: self.voters_score,
            voters_pure_score: self.voters_pure_score,
            last_payout_voters_score: self.last_payout_voters_score,
            last_payout_voters_pure_score: self.last_payout_voters_pure_score,
            url: self.url,
            path: self.path,
            title: self.title,
            body: self.body,
            meta: self.meta,
            locale: self.locale,
            country_code: self.country_code,
            vector: self.vector,
            isStory: self.isStory,
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
            isCheering: Number.prototype.castBool(self.isCheering),
            isBetterOpinion: Number.prototype.castBool(self.isBetterOpinion),
            isBetterAnswer: Number.prototype.castBool(self.isBetterAnswer),
            isAssign: Number.prototype.castBool(self.isAssign),
            isOpinionWanted: Number.prototype.castBool(self.isOpinionWanted),
            isRequestWanted: Number.prototype.castBool(self.isRequestWanted),
            count: self.count,
            cheering_count: self.cheering_count,
            good_opinion_count: self.good_opinion_count,
            isPrivate: self.isPrivate,
            valid: self.valid,
            permission: self.permission,
            ParentContent: !!self.ParentContent
                ? safe2json(self.ParentContent)
                : null,
            children_contents: !!self.children_contents
                ? self.children_contents.map(val => {
                      return safe2json(val);
                  })
                : null,
            UpVotes: !!self.UpVotes
                ? self.UpVotes.map(val => {
                      return safe2json(val);
                  })
                : null,
            DownVotes: !!self.DownVotes
                ? self.DownVotes.map(val => {
                      return safe2json(val);
                  })
                : null,
            Labelings: !!self.Labelings
                ? self.Labelings.map(val => {
                      return safe2json(val);
                  })
                : null,
            User: !!self.User ? safe2json(self.User) : null,
            Labels: !!self.Labels
                ? self.Labels.map(val => {
                      return safe2json(val);
                  })
                : null,
            Requests: !!self.Requests
                ? self.Requests.map(val => {
                      return safe2json(val);
                  })
                : null,
            Requests: !!self.Assigns
                ? self.Assigns.map(val => {
                      return safe2json(val);
                  })
                : null,
            updated_at: self.updated_at,
            created_at: self.created_at,
        };
    };

    Content.Instance.prototype.toMap = self => {
        return Map({
            UserId: self.UserId,
            ParentId: self.ParentId,
            id: self.id,
            token_amount: self.token_amount,
            score: self.score,
            pure_score: self.pure_score,
            sum_score: self.sum_score,
            sum_pure_score: self.sum_pure_score,
            author_score: self.author_score,
            author_pure_score: self.author_pure_score,
            voters_score: self.voters_score,
            voters_pure_score: self.voters_pure_score,
            url: self.url,
            path: self.path,
            title: self.title,
            body: self.body,
            meta: self.meta,
            mode: 'content',
            isStory: self.isStory,
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
            children_contents: self.children_contents,
            isCheering: Number.prototype.castBool(self.isCheering),
            isBetterOpinion: Number.prototype.castBool(self.isBetterOpinion),
            isBetterAnswer: Number.prototype.castBool(self.isBetterAnswer),
            isAssign: Number.prototype.castBool(self.isAssign),
            isOpinionWanted: Number.prototype.castBool(self.isOpinionWanted),
            isRequestWanted: Number.prototype.castBool(self.isRequestWanted),
            count: self.count,
            cheering_count: self.cheering_count,
            good_opinion_count: self.good_opinion_count,
            isPrivate: Number.prototype.castBool(self.isPrivate),
            valid: self.valid,
            permission: self.permission,
            ...self,
        });
    };

    Content.Instance.prototype.getPureBody = self => {
        return self.body.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
    };

    Content.Instance.prototype.getType = self => {
        if (self.id) {
            return SUBMIT_TYPE.Edit;
        } else if (self.ParentId && !self.isStory) {
            return SUBMIT_TYPE.Comment;
        } else if (self.isStory || !self.ParentId) {
            return SUBMIT_TYPE.Story;
        }
    };

    Content.Instance.prototype.getTypeValue = self => {
        if (self.id) {
            return SUBMIT_TYPE.Edit.value;
        } else if (self.ParentId && !self.isStory) {
            return SUBMIT_TYPE.Comment.value;
        } else if (self.isStory || !self.ParentId) {
            return SUBMIT_TYPE.Story.value;
        }
    };

    return Content;
};
