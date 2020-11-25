module.exports = (sequelize, DataTypes) => {
     var event = sequelize.define('event', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            autoIncrement : true,
            primaryKey:true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
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
            allowNull: false,
        },
        start_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        end_datetime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        is_activate: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        timestamps:false,
    });
    event.associate = function(models) {
        event.belongsTo(models.user, {
            foreignKey : "user_id"
        })
    };

    return event;
}
