const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const data_config = require('@constants/data_config');

const hashPasswordHook = (identity, options, callback) => {
    if (identity.get('password') == '') return callback(null, options);
    bcrypt.hash(identity.get('password'), 10, (err, hash) => {
        if (err) return callback(err);
        identity.set('password_hash', hash);
        identity.set('password', '');
        return callback(null, options);
    });
};

module.exports = function(sequelize, DataTypes) {
    var Identity = sequelize.define(
        'Identity',
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
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                validate: {
                    min: data_config.email_min_limit,
                    max: data_config.email_max_limit,
                },
            },
            delete_password_token: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            isDelete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            mail_notification_token: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            isMailNotification: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            token: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            email_is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            last_attempt_verify_email: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            phone_number: {
                type: DataTypes.STRING(255),
                unique: true,
                defaultValue: uuidv4(),
            },
            phone_number_is_verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            last_attempt_verify_phone_number: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            phone_code_attempts: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            country_code: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            phone_code: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            account_is_created: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            confirmation_code: {
                type: DataTypes.STRING(255),
                defaultValue: '',
            },
            username: {
                type: DataTypes.STRING(255),
                unique: true,
                defaultValue: '',
                validate: {
                    min: data_config.username_min_limit,
                    // max: data_config.username_max_limit,
                },
            },
            username_booked_at: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            password_hash: {
                type: DataTypes.STRING(255),
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    min: data_config.password_min_limit,
                    //FIXME: when type number as string, error raise 'MaxValidationError'
                    // max: data_config.password_max_limit,
                },
            },
            facebook_id: {
                type: DataTypes.STRING(255),
                defaultValue: null,
                allowNull: true,
                unique: true,
            },
            instagram_id: {
                type: DataTypes.STRING(255),
                defaultValue: null,
                allowNull: true,
                unique: true,
            },
            twitter_id: {
                type: DataTypes.STRING(255),
                defaultValue: null,
                allowNull: true,
                unique: true,
            },
            invited_code: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            verified: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            bot: {
                type: DataTypes.BOOLEAN,
            },
            permission: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            tableName: 'identities',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            hooks: {
                beforeCreate: hashPasswordHook,
                beforeUpdate: hashPasswordHook,
            },

            classMethods: {
                associate: function(models) {
                    Identity.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: true,
                        },
                    });
                    Identity.hasMany(models.AccessToken, {
                        as: 'AccessTokens',
                        foreignKey: {
                            name: 'identity_id',
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Identity.Instance.prototype.authenticate = async (self, password) => {
        const isValid = await bcrypt.compare(password, self.password_hash);
        return isValid;
    };

    Identity.Instance.prototype.toJSON = self => {
        return {
            id: self.id,
            UserId: self.UserId,
            email: self.email,
            delete_password_token: self.delete_password_token,
            isDelete: self.isDelete,
            token: self.token,
            email_is_verified: self.email_is_verified,
            last_attempt_verify_email: self.last_attempt_verify_email,
            phone_number: self.phone_number,
            phone_number_is_verified: self.phone_number_is_verified,
            last_attempt_verify_phone_number:
                self.last_attempt_verify_phone_number,
            phone_code_attempts: self.phone_code_attempts,
            phone_code: self.phone_code,
            country_code: self.country_code,
            username: self.username,
            permission: self.permission,
            account_is_created: self.account_is_created,
            confirmation_code: self.confirmation_code,
            username_booked_at: self.username_booked_at,
            password_hash: self.password_hash,
            password: self.password,
            mail_notification_token: self.mail_notification_token,
            isMailNotification: self.isMailNotification,
            facebook_id: self.facebook_id,
            instagram_id: self.instagram_id,
            twitter_id: self.twitter_id,
            invited_code: self.invited_code,
            verified: self.verified,
            bot: self.bot,
            permission: self.permission,
        };
    };

    Identity.Instance.prototype.last_step = self => {};

    return Identity;
};
