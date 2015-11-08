var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.render('index', {
		title: 'Collab'
	});
});

/* GET home page. */
router.get('/userlist', function (req, res, next) {
	// Get db connection
	var connection = req.connection;
	var userlist = [];
	// Query
	connection.query('SELECT * from users', function (err, rows, fields) {
		if (!err) {
			for (r in rows) {
				userlist.push(rows[r].first_name);
				console.log("user pushed");

			}
			// Render userlist
			res.render('userlist', {
				title: 'Userlist',
				"userlist": userlist
			});
		} else {
			console.log('Error while performing Query.');
			console.log(err);
		}
	});
});

module.exports = router;