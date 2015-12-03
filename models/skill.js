// app/models/user.js
// load the things we need

//var bcrypt   = require('bcrypt-nodejs');
var Sequelize = require('sequelize');
var User = require('./user');
// schema ========================================
module.exports = function(sequelize) {
  var Skill = sequelize.define('skill', {
    name: {
        type: Sequelize.STRING,
        unique: true
    }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

// methods ======================

return Skill;
};