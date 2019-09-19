const data_config = require('@constants/data_config');
const uuidv4 = require('uuid/v4');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        'User',
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            username: {
                type: DataTypes.STRING(255),
                unique: true,
                validate: {
                    min: data_config.username_min_limit,
                    // max: data_config.username_max_limit,
                },
            },
            nickname: {
                type: DataTypes.STRING(255),
                validate: {
                    min: data_config.nickname_min_limit,
                    // max: data_config.nickname_max_limit,
                },
            },
            detail: {
                type: DataTypes.TEXT('long'),
                validate: {
                    min: data_config.detail_min_limit,
                    max: data_config.detail_max_limit,
                },
            },
            picture_small: {
                type: DataTypes.STRING(255),
                defaultValue: '/icons/noimage.svg',
            },
            picture_large: {
                type: DataTypes.STRING(255),
                defaultValue: '/icons/noimage.svg',
            },
            eth_address: {
                type: DataTypes.STRING(255),
            },
            token_balance: {
                type: DataTypes.DECIMAL(
                    data_config.max_decimal_range,
                    data_config.min_decimal_range
                ),
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
            locale: {
                type: DataTypes.STRING(255),
            },
            timezone: {
                type: DataTypes.STRING,
            },
            verified: {
                type: DataTypes.BOOLEAN,
            },
            bot: {
                type: DataTypes.BOOLEAN,
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
            post_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('post_vector') ||
                        this.getDataValue('post_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('post_vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'post_vector',
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
                        this.setDataValue('post_vector', JSON.stringify(value));
                    }
                },
            },
            upvote_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('upvote_vector') ||
                        this.getDataValue('upvote_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('upvote_vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'upvote_vector',
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
                        this.setDataValue(
                            'upvote_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            view_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('view_vector') ||
                        this.getDataValue('view_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('view_vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'view_vector',
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
                        this.setDataValue('view_vector', JSON.stringify(value));
                    }
                },
            },
            follow_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('follow_vector') ||
                        this.getDataValue('follow_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('follow_vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'follow_vector',
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
                        this.setDataValue(
                            'follow_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            follower_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('follower_vector') ||
                        this.getDataValue('follower_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(this.getDataValue('follower_vector'));
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'follower_vector',
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
                        this.setDataValue(
                            'follower_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            label_stock_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('label_stock_vector') ||
                        this.getDataValue('label_stock_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(
                            this.getDataValue('label_stock_vector')
                        );
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'label_stock_vector',
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
                        this.setDataValue(
                            'label_stock_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            request_post_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('request_post_vector') ||
                        this.getDataValue('request_post_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(
                            this.getDataValue('request_post_vector')
                        );
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'request_post_vector',
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
                        this.setDataValue(
                            'request_post_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            request_upvote_vector: {
                type: DataTypes.TEXT('long'),
                get: function() {
                    if (
                        !this.getDataValue('request_upvote_vector') ||
                        this.getDataValue('request_upvote_vector') == ''
                    ) {
                        return Array.apply(
                            null,
                            Array(data_config.w2v_size)
                        ).map(function() {
                            return 0;
                        });
                    } else {
                        return JSON.parse(
                            this.getDataValue('request_upvote_vector')
                        );
                    }
                },
                set: function(value) {
                    if (!value) {
                        this.setDataValue(
                            'request_upvote_vector',
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
                        this.setDataValue(
                            'request_upvote_vector',
                            JSON.stringify(value)
                        );
                    }
                },
            },
            invite_code: {
                type: DataTypes.STRING(255),
                unique: true,
                defaultValue: uuidv4(),
            },
            notification_id: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            sign_up_meta: {
                type: DataTypes.TEXT('long'),
            },
            isPrivate: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            permission: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'users',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    User.hasMany(models.HomeLabel);
                    User.hasMany(models.LabelStock);
                    User.hasMany(models.Interest);
                    User.hasMany(models.UpVote, {
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    User.hasMany(models.DownVote, {
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    User.hasMany(models.Repost);
                    User.hasMany(models.Follow, {
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: false,
                        },
                    });
                    User.hasMany(models.Follow, {
                        foreignKey: {
                            name: 'votered_id',
                            allowNull: false,
                        },
                    });
                    User.hasMany(models.Invite, {
                        foreignKey: {
                            name: 'invited_id',
                            allowNull: false,
                        },
                    });
                    User.hasMany(models.Invite, {
                        foreignKey: {
                            name: 'inviter_id',
                            allowNull: false,
                        },
                    });
                    User.belongsToMany(models.Content, {
                        as: 'repost_contents',
                        through: 'Repost',
                        foreignKey: 'voter_id',
                        otherKey: 'voted_id',
                    });
                    User.belongsToMany(models.Content, {
                        as: 'watched_contents',
                        through: 'ViewHistory',
                        foreignKey: 'user_id',
                        otherKey: 'content_id',
                    });
                    User.belongsToMany(models.Content, {
                        as: 'upvote_contents',
                        through: 'UpVote',
                        foreignKey: 'voter_id',
                        otherKey: 'voted_id',
                    });
                    User.belongsToMany(models.Content, {
                        as: 'downvote_contents',
                        through: 'DownVote',
                        foreignKey: 'voter_id',
                        otherKey: 'voted_id',
                    });
                    User.belongsToMany(models.User, {
                        as: 'Followers',
                        through: 'Follow',
                        foreignKey: 'voter_id',
                        otherKey: 'votered_id',
                    });
                    User.belongsToMany(models.User, {
                        as: 'Follows',
                        through: 'Follow',
                        foreignKey: 'votered_id',
                        otherKey: 'voter_id',
                    });
                    User.belongsToMany(models.Label, {
                        through: 'Interest',
                        otherKey: 'label_id',
                        foreignKey: 'user_id',
                    });
                    User.belongsToMany(models.Label, {
                        through: 'LabelStocks',
                        otherKey: 'label_id',
                        foreignKey: 'user_id',
                    });
                    User.belongsToMany(models.Label, {
                        through: 'HomeLabel',
                        otherKey: 'label_id',
                        foreignKey: 'user_id',
                    });
                    User.belongsToMany(models.Request, {
                        as: 'upvote_requests',
                        through: 'RequestUpVote',
                        foreignKey: 'voter_id',
                        otherKey: 'voted_id',
                    });
                    User.belongsToMany(models.User, {
                        as: 'Requesters',
                        through: 'Request',
                        foreignKey: 'voter_id',
                        otherKey: 'votered_id',
                    });
                    User.belongsToMany(models.User, {
                        as: 'Requesteds',
                        through: 'Request',
                        foreignKey: 'votered_id',
                        otherKey: 'voter_id',
                    });
                    User.belongsToMany(models.Request, {
                        as: 'downvote_requests',
                        through: 'RequestDownVote',
                        foreignKey: 'voter_id',
                        otherKey: 'voted_id',
                    });
                    User.hasMany(models.Content);
                    User.hasMany(models.Reward);
                    User.hasMany(models.Bridge);
                    User.hasMany(models.Request, {
                        as: 'Requests',
                        foreignKey: {
                            name: 'voter_id',
                            allowNull: true,
                        },
                    });
                    User.hasMany(models.Request, {
                        as: 'VotedRequests',
                        foreignKey: {
                            name: 'votered_id',
                            allowNull: true,
                        },
                    });
                    User.hasOne(models.Identity);
                    User.hasOne(models.Account);
                    User.hasMany(models.SnsCampaign);
                    // User.hasMany(models.UserAttribute);
                },
            },
        }
    );

    User.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            username: self.username,
            nickname: self.nickname,
            detail: self.detail,
            picture_small: self.picture_small,
            picture_large: self.picture_large,
            eth_address: self.eth_address,
            token_balance: self.token_balance,
            score: self.score,
            pure_score: self.pure_score,
            locale: self.locale,
            timezone: self.timezone,
            verified: self.verified,
            bot: self.bot,
            vector: self.vector,
            post_vector: self.post_vector,
            upvote_vector: self.upvote_vector,
            view_vector: self.view_vector,
            follow_vector: self.follow_vector,
            follower_vector: self.follower_vector,
            label_stock_vector: self.label_stock_vector,
            request_post_vector: self.request_post_vector,
            request_upvote_vector: self.request_upvote_vector,
            sign_up_meta: self.sign_up_meta,
            invite_code: self.invite_code,
            notification_id: self.notification_id,
            isPrivate: self.isPrivate,
            permission: self.permission,
            created_at: self.created_at,
            updated_at: self.updated_at,
        };
    };

    return User;
};
