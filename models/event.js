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
            allowNull: false,
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
        start_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_activated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
    },
    {
        timestamps: false,
    });
};
