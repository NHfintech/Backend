const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env]['dbOptions'];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Event = require('./event')(sequelize, Sequelize);
db.EventAdmin = require('./eventadmin')(sequelize, Sequelize);
db.Guest = require('./guest')(sequelize, Sequelize);
db.BreakDown = require('./breakdown')(sequelize, Sequelize);

db.Event.hasMany(db.Guest, {foreignKey: {name: 'event_id'}});
db.Event.hasMany(db.EventAdmin, {foreignKey: {name: 'event_id'}});
db.Event.hasMany(db.BreakDown, {foreignKey: {name: 'event_id'}});
db.User.hasMany(db.BreakDown, {foreignKey: {name: 'sender_id'}});

module.exports = db;
