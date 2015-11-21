var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
// Require for Passport
var passport = require('passport');
var flash = require('connect-flash');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

require('./config/passport')(passport);



// var Sequelize = require('sequelize');
// var configdb = require('./config/database');
// var sequelize = new Sequelize(configdb.dbname,configdb.user,configdb.password,configdb.connection);
// var User = require('./models/user')(sequelize);
// var Skill = require('./models/skill')(sequelize);
// User.belongsToMany(Skill,{through: 'UserSkill'});
// Skill.belongsToMany(User,{through: 'UserSkill'});

// sequelize.sync();
// User.create({
//   'email':'Phil@Hellmuth.com',
//   'password':'idiotguy '
// },function(err,user) {
//     console.log("Errors: "+err);
//     console.log("User: "+user);
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret:'collab', resave:'false', saveUninitialized:'false' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index')(app, passport);
var users = require('./routes/users');
// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
