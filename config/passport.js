// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var flash = require('connect-flash');
// load our db
var mysql = require('mysql');
var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'shimon',
 database : 'collab'
});

// expose this function to our app using module.exports
module.exports = function(passport){
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done){
        console.log("serializeUser***************************");
        done(null, user._id);
    });

    // use to deserialize the user
    passport.deserializeUser(function (id, done){
        console.log("deserializeUser*************************");
        var users = db.get('userlist');
        users.findById(id, function(err, user){
            // if there are any errors, return the error
            return done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, localStrategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true    // allows us to pass back the entire request to the callback
    },
    function (req, username, password, done){
        // asynch
        // user findOne wont fire unless data is sent back

        // convert username to lowercase so that you can't have two users
        // with the same subdomain
        username = username.toLowerCase();

        process.nextTick(function(){
            // find a user whose username is the same as the form's username
            // we are checking to see if the user trying to login already exists
        
            // Our code ∆
            // get user collection
            var users = db.get('userlist');
            users.findOne({'username' : username}, function(err, user){
                // if there are any errors, return the error
                if (err){
                    return done(err);
                }
                // check to see if there's already a user with that username
                if (user){
                    console.log("that username is already taken");
                    return done(null, false, req.flash('errMessage', 'that username is already taken'));
                } else {
                    // if there is no user with that username
                    // ∆ create and insert a new user
                    newUser = {
                        'email': req.body.email,
                        'username': username,
                        'password': generatehash(password)
                    }
                    users.insert(newUser, function (err, user){
                        if (err){
                            throw err;
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login',new LocalStrategy({
        // by default local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to passback the entire req to the callback
    },
    function (req, username, password, done){ // callback with username and password from our form
        // find a user whose username is the same as the forms username
        // we are checking to see if the user trying to login already exists

        // convert username to lowercase so that you can't have two users
        // with the same subdomain
        username = username.toLowerCase();

        // Our code ∆
        var users = db.get('userlist'); // get user collection
        users.findOne({ 'username' :  username }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('errMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!isValidPassword(password, user)){ // pass user to isValidPassword
                return done(null, false, req.flash('errMessage', 'Oops! Wrong password.')); // create the errMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, user);
        });
    }));
}

// password auth functions
function generatehash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function isValidPassword(password, user) {
    // get user's password from database to compare to password from form

    return bcrypt.compareSync(password, user.password);
}
