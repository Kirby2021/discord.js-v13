const { connect, connection } = require('mongoose');

const config = require('../../Assets/JSON/config.json');

module.exports = class DatabaseConnection {
	constructor(client) {
		this.client = client;
	}

	init() {
		if (!config.database.mongoURI) {
			this.client.logger.log('ERR', 'Please specify the MongoDB URI!');
			throw new Error('Please specify the MongoDB URI!');
		}

		connect(config.database.mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		connection.on('connected', () => {
			this.client.logger.log('READY', 'Connected to Database!');
		});

		connection.on('disconnected', () => {
			this.client.logger.log('WARN', 'Database connection lost!');
		});

		connection.on('err', () => {
			this.client.logger.log(
				`Database connection occured an error!\n${err.stack}`,
			);
		});
	}
};
