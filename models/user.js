module.exports = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: true,
        },
        fin_account: {
            type: DataTypes.STRING(45),
            allowNull: true,
            unique: true,
        },
    },
    {
        timestamps: false,
    });
};
