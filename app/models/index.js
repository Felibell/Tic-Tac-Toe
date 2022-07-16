const dbConfig = require ("../config/db.config");

const mongoose = require ("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.records = require("./records.model")(mongoose);

module.exports = db;