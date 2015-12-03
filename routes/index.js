module.exports = function(app,passport){

	/* GET home page. */
	app.get('/', function(req, res, next) {
	  res.render('index', { 
	  	title: 'Express',
	  	failureFlash : true, // allow flash messages
		message: req.flash('errMessage')
	  });
	});

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			title: 'Profile',
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// SEARCH
	app.get('/search', function(req,res){
		res.render('search.ejs',{
			title: 'Search'
		});
	});

	// SKILLS -- TODO: THIS GOES IN THE SEARCH ROUTE
	app.get('/skills', function(req,res){
		res.render('skills.ejs',{
			title: 'Skills'
		});
	});
	// TODO: THIS TOO WILL GO IN THE SEARCH ROUTE
	app.post('/addSkill', function(req, res){
		//console.log(req.user.id); req.user.id corresponds to the user id which we will want to insert the skill for.
		//console.log(req.db); req.db is the sequelize
		var User = req.db.models.user;
		console.log("req.user.id: "+req.user.id)
		User.findByID(req.user.id, function(user){
			console.log('inside of callback function');
			console.log(user);
		});
		//var Skill = req.db.models.skill;
		//var newSkill = Skill.build ({name: req.body.skill});	
		//newSkill.save().then(function() {done (null, newSkill);}).catch(function(err) { done(null, false, req.flash('errMessage', err));});
		//currUser.addSkill([newSkill]);
	});
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('errMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));


	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/');
	}
	
// End of exports
}