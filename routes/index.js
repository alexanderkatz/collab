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
			user : req.user
		});
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
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

		// app.post('/login', function(req, res, next) {
		//   passport.authenticate('local-login', function(err, user, info) {
		//     if (err) { return next(err); }
		//     if (!user) { return res.redirect('/'); }
		//     req.logIn(user, function(err) {
		//       if (err) { return next(err); }
		//       return res.redirect("/profile");
		//     });
		//   })(req, res, next);
		// });

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