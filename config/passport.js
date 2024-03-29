var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var configDB = require('./database');
var Sequelize = require('sequelize');
var sequelize = new Sequelize(configDB.dbname,configDB.user,configDB.password,configDB.connection);


var User = sequelize.import('../models/user');
User.sync();

// // load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id).then(function(user){
			done(null, user);
		}).catch(function(e){
			done(e, false);
		});
    });


	// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
			User.findOne({ where: { email: email }})
				.then(function(user) {

					if (!user) {
						done(null, false, req.flash('errMessage', 'Unknown user'));
					} else if (!user.validPassword(password)) {
						done(null, false, req.flash('errMessage', 'Wrong password'));
					} else {
						done(null, user);
					}
				})
				.catch(function(e) {
					console.log(e.toString());

					done(null, false, req.flash('errMessage',e.name + " " + e.message));
				});
	}));



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
		//  Whether we're signing up or connecting an account, we'll need
		//  to know if the email address is in use.

		var email = req.body.email;

		User.findOne({ where: { email: email }})
			.then(function(existingUser) {
				// check to see if there's already a user with that email
				if (existingUser){
					return done(null, false, req.flash('errMessage', 'That email is already taken.'));
				}
				// check to see if there's already a user with that username
				User.findOne({where:{ username:username }})
					.then(function(existingUser){
						if (existingUser){
							return done(null, false, req.flash('errMessage', 'That username is already taken.'));
						}
						else {
							// create the user
							var newUser = User.build ({email: email, username : username, password: User.generateHash(password)});
							newUser.save().then(function() {done (null, newUser);}).catch(function(err) { done(null, false, req.flash('errMessage', err));});
						}
					})
					.catch(function (e) {
						done(null, false, req.flash('errMessage',e.name + " " + e.message));
					})
			})
			.catch(function (e) {
				done(null, false, req.flash('errMessage',e.name + " " + e.message));
			})

    }));

// End of module.exports
};
