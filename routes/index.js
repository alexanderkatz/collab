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

		//Current user, to be used to display a list of the user's current skills on the skills page.
		var currUser = req.user;
		var Skill = req.db.models.skill;
		var User = req.db.models.user;

		// Get currUser's skills, and log them to the console?
		User.findOne({ where: { email: currUser.email }}).then(function(user) {
			user.getSkills().then(function(skillArray){
				var skills = [];
				for (var i = 0; i < skillArray.length; i++) {
					skills.push(skillArray[i].name);
					// console.log(skillArray[i].name); //TODO: build name array, send to view.
				};
				res.render('skills.ejs',{
					title: 'Skills',
					skills: skills
				});
			});
		});
	});

	// TODO: THIS TOO WILL GO IN THE SEARCH ROUTE
	app.post('/addSkill', function(req, res){
		
		// Current User
		var currUser = req.user;
		var Skill = req.db.models.skill;
		var User = req.db.models.user;

		// Before building a skill we need to check if it exists

		var newSkill = Skill.build ({name: req.body.skill});	
		newSkill.save().then(function() {
			console.log("currUser: "+currUser);
			User.findOne({ where: { email: currUser.email }})
				.then(function(user) {
				user.addSkill(newSkill); //TODO: eliminate possibility of adding duplicate elements, which currently occurs (check user id = 3)
			});
			res.redirect("skills");	
		}).catch(function(err) { 
			console.log(err);
		});
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

	// Function to print key/val pairs
	function getKeys(obj){
	    var keys = [];
	    for(var key in obj){
	        keys.push(key);
	        console.log(key+": "+obj[key]);
	    }
	    console.log("----------------------------");
	}

	// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/');
	}
	
// End of exports
}