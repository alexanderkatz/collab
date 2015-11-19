// app/models/user.js
// load the things we need

//var bcrypt   = require('bcrypt-nodejs');
var configDB = require('../config/database.js');
var Sequelize = require('sequelize');
// configuration ========================================
//var sequelize = new Sequelize('collab','root','shimon', configDB.connection);



// define the schema for our user model
module.exports = function(sequelize) {
  console.log("user function executing");
  var User = sequelize.define('user', {
    email: {
        type: Sequelize.STRING,
    },
    password: {
        type: Sequelize.STRING
    }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

// User.sync({force: true}).then(function () {
//   // Table created
//   return User.create({
//     email: 'john@gmail.com',
//     password: 'hancock'
//   });
// });

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