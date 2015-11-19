module.exports = {
	'connection': {
  		host: 'localhost',
  		dialect: 'mysql',

  		pool: {
	    	max: 5,
	    	min: 0,
		    idle: 10000
  		},
	},

	'user': 'root',
	'dbname': 'collab',
	'password': 'shimon'
};