module.exports = function(sequelize, DataTypes) {
    var Account = sequelize.define(
        'Account',
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
            name: {
                type: DataTypes.STRING,
            },
            first_name: {
                type: DataTypes.STRING,
            },
            last_name: {
                type: DataTypes.STRING,
            },
            birthday: {
                type: DataTypes.DATE,
            },
            address: {
                type: DataTypes.STRING(255),
            },
            gender: {
                type: DataTypes.STRING(255),
            },
            // eth_wallet_address: {
            //     type: DataTypes.STRING(255),
            // },
            // owner_private_key: {
            //     type: DataTypes.STRING(255),
            // },
            // wallet_private_key: {
            //     type: DataTypes.STRING(255),
            // },
            active_key: {
                type: DataTypes.STRING(255),
            },
            posting_key: {
                type: DataTypes.STRING(255),
            },
            memo_key: {
                type: DataTypes.STRING(255),
            },
            permission: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            tableName: 'accounts',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
            underscored: true,
            classMethods: {
                associate: function(models) {
                    Account.belongsTo(models.User, {
                        onDelete: 'CASCADE',
                        foreignKey: {
                            allowNull: false,
                        },
                    });
                },
            },
        }
    );

    Account.Instance.prototype.toJSON = self => {
        return {
            UserId: self.UserId,
            name: self.name,
            first_name: self.first_name,
            last_name: self.last_name,
            birthday: self.birthday,
            address: self.address,
            gender: self.gender,
            // owner_private_key: self.owner_private_key,
            active_key: self.active_key,
            posting_key: self.posting_key,
            memo_key: self.memo_key,
            permission: self.permission,
        };
    };

    return Account;
};
