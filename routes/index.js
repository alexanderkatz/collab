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
		//Current user, to be used to display a list of the user's current skills on the skills page.
		res.redirect('/users/'+req.user.email);
	});

	app.get('/editprofile', isLoggedIn, function(req, res) {
		var Skill = req.db.models.skill;
		var User = req.db.models.user;
		var currUserName = req.user.email;

		User.findOne({ where: { email: currUserName }}).then(function(user) {
			if (user){
				user.getSkills({order: ['name']}).then(function(skillArray){
					var skills = [];
					// store skill names in skills array
					for (var i = 0; i < skillArray.length; i++) {
						skills.push(skillArray[i].name);
					};
					res.render('editprofile.ejs',{
						title: 'Profile',
						skills: skills,
						user : user
					});
				});
			}
			else{
				console.log("User does not exist");
			}
		});
	})

	app.get('/users/:username', isLoggedIn, function(req,res){
		var Skill = req.db.models.skill;
		var User = req.db.models.user;
		var username = req.params.username;
		var currUserName = req.user.email;

		User.findOne({ where: { email: username }}).then(function(user) {
			if (user){
				user.getSkills({order: ['name']}).then(function(skillArray){
					var skills = [];
					// store skill names in skills array
					for (var i = 0; i < skillArray.length; i++) {
						skills.push(skillArray[i].name);
					};
					// check if currUserName is the same as requested
					var view = "profile";
					if (currUserName == username){
						view = "adminprofile" 
					} 
					res.render(view + '.ejs',{
						title: 'Profile',
						skills: skills,
						user : user
					});
				});
			}
			else{
				console.log("User does not exist");
			}
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

	app.post('/addSkill', function(req, res){
		
		// Current User
		var currUser = req.user;
		var Skill = req.db.models.skill;
		var User = req.db.models.user;
		
		Skill
		  .findOrCreate({where: {name: req.body.skill}})
		  .spread(function(skill, created) {
		  	User.findOne({ where: { email: currUser.email }})
				.then(function(user) {
					user.addSkill(skill);
				});
			res.redirect("editprofile");	
		}).catch(function(err) { 
			console.log(err);
		});
	});

	app.post('/removeSkill', function(req, res){
		
		// Current User
		//remove the appropriate skill from the user->skill association(table)
		var currUser = req.user;
		var Skill = req.db.models.skill;
		var User = req.db.models.user;

		Skill
		  .findOne({where: {name: req.body.skillremove}})
		  .then(function(skill) {
		  	User.findOne({ where: { email: currUser.email }})
				.then(function(user) {
					user.removeSkill(skill);
				});
			res.redirect("editprofile");	
		}).catch(function(err) { 
			console.log(err);
		});
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

		// console.log("user id: "+req.user.id);
		// passport.deserializeUser(req.user.id, function(user){
		// 	console.log("callback "+user);
		// });