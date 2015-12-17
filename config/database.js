module.exports = {
	'connection': {
  		host: 'sql.cs.oberlin.edu',
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
