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
		res.redirect('/users/'+req.user.username);
	});


	//
	app.get('/users/:username', isLoggedIn, function(req,res){
		var Skill = req.db.models.skill;
		var User = req.db.models.user;
		var username = req.params.username;
		var currUserName = req.user.username;

		User.findOne({ where: { username: username }}).then(function(user) {
			if (user){
				user.getSkills({order: ['name']}).then(function(skillArray){
					var skills = [];
					// store skill names in skills array
					for (var i = 0; i < skillArray.length; i++) {
						skills.push(skillArray[i].name);
					};
					// if currUserName is the same as requested, give user admin view
					var admin = false;
					if (currUserName == username){
						admin = true
					}
					res.render('profile.ejs',{
						title: 'Profile',
						admin: admin,
						skills: skills,
						username : user.username,
						email: user.email,
						blurb: user.blurb
					});
				});
			}
			else{
				console.log("User does not exist");
			}
		});
	});

	// EDIT PROFILE
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
						blurb : user.blurb
					});
				});
			}
			else{
				console.log("User does not exist");
			}
		});
	})

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// SEARCH
	app.get('/search', isLoggedIn, function(req,res){
		console.log("req.body.search "+req.query.search);
		var Skill = req.db.models.skill;
		var searchTerm = req.query.search;
		Skill.findOne({where: {name: searchTerm} }).then(function(skill) {
			if(!skill){ 
				res.render('searchresults.ejs',{
					title: 'Results',
					users: [""],
					skill: searchTerm
				});
				return;
			}
			skill.getUsers().then(function(users) {
				var usernames = [];
				// store skill names in skills array
				for (var i = 0; i < users.length; i++) {
					usernames.push(users[i].username);
					console.log(usernames[i]);
				}
				res.render('searchresults.ejs',{
					title: 'Results',
					users: usernames,
					skill: skill.name
				});
			});
		}).catch(function(err) { //TODO: this will only execute when some error we have yet to encounter occurs. What should we do in this case?
			console.log(err);
			res.render('searchresults.ejs',{
				title: 'Results',
				users: ["An error has occured!!"],
				skill: searchTerm
			});
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
		  .findOne({where: {name: req.body.skillName}})
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

	app.post('/editBlurb', function(req, res){
		var userID = req.user.id;
		var User = req.db.models.user;
		var blurb = req.body.blurb;

		User.findById(userID)
		  .then(function(user) {
			user.blurb = blurb;
			user.save()
			  .then(function() { res.redirect("editprofile"); });
		})
	})

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
