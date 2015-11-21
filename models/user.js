// app/models/user.js
// load the things we need

var bcrypt   = require('bcrypt-nodejs');
var Sequelize = require('sequelize');
var Skill = require('./skill');
// schema ========================================
module.exports = function(sequelize) {
  var User = sequelize.define('user', {
    email: Sequelize.STRING,
    password: Sequelize.STRING
  }, 
  {
    freezeTableName: true, // Model tableName will be the same as the model name
    classMethods: {
      generateHash : function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
      },      
    },
    instanceMethods: {      
      validPassword : function(password) {
        return bcrypt.compareSync(password, this.password);
      }
    },
    getterMethods: {
      someValue: function() {
        return this.someValue;
      }
    },
    setterMethods: {
      someValue: function(value) {
        this.someValue = value;
      }
    }
  });

// methods ======================

User.findByEmail = function(email, cb){
  var queryParameters = {email:email};
  console.log(queryParameters);
  var query = User.find({ where: {'email':email} });
  query.then(function (user) {
    cb(null, user);
  });
  query.catch(function (err) {
    cb(err);
  });
};


/*
// generating a hash
User.generateHash = function(password) {
    console.log("generateHash");
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
*/

return User;
};