module.exports = (sequelize, DataTypes) => {
    return sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement: true,
            primaryKey: true,
        },
        event_hash: {
            type: DataTypes.STRING(100),
            unique: true,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        invitation_url: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: null,
        },
        event_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_activated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        is_received: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        message: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: '',
        },
        pair_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            unique: true,
        }
    },
    {
        timestamps: false,
    });
};
