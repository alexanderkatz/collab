module.exports = {
	'connection': {
  		host: 'mysql://b4eab3827be983:f2a8814e@us-cdbr-iron-east-03.cleardb.net/heroku_9ee959aeee4b050?reconnect=true',
  		dialect: 'mysql',

  		pool: {
	    	max: 5,
	    	min: 0,
		    idle: 10000
  		},
	},

	'user': 'akatz',
	'dbname': 'akatz',
	'password': 'collap'
};

// module.exports = {
// 	'connection': {
//   		host: 'localhost',
//   		dialect: 'mysql',
//
//   		pool: {
// 	    	max: 5,
// 	    	min: 0,
// 		    idle: 10000
//   		},
// 	},
//
// 	'user': 'root',
// 	'dbname': 'collab',
// 	'password': 'shimon'
// };
