const { Client, Collection, Permissions } = require('discord.js');

const Util = require('./Util');
const Logger = require('./Logger');
const Database = require('./Database/Util');
const DatabaseConnection = require('./Database/Connection');

require('./Scripts/index');

module.exports = class MainClient extends Client {
	constructor(options = {}) {
		super({
			allowedMentions: { parse: ['users', 'roles'] },
			intents: 32767,
			partials: ['USER', 'GUILD_MEMBER', 'MESSAGE'],
		});

		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();
		this.slashCommands = new Collection();
		this.events = new Collection();

		this.utils = new Util(this);
		this.mongodb = new Database(this);
		this.database = new DatabaseConnection(this);
		this.logger = new Logger();

		this.translations = require('./LanguageManager')();
		this.config = require('../Assets/JSON/config.json');
		this.languages = require('../Assets/Languages/language-meta.json');
	}

	/**
	 *
	 * @param {object} options
	 * @description To validate the configuration file
	 */
	validate(options) {
		const logger = new Logger();
		if (typeof options.client !== 'object') {
			throw new TypeError(logger.log('ERR', 'Options type must be an object!'));
		}
		if (!options.client.token) {
			logger.log(
				'ERR',
				'You need to specify Discord Bot token for the client!',
			);
		}
		this.token = options.client.token;
		if (!options.client.prefix) {
			logger.log('ERR', 'You need to specify the prefix for the client!');
		}
		if (typeof options.client.prefix !== 'string') {
			throw new TypeError(logger.log('ERR', 'Prefix type must be a string!'));
		}
		if (!options.defaultPerms) {
			logger.log(
				'ERR',
				'You need to specify the default permissions for the client!',
			);
		}
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	async start(token = this.token) {
		this.utils.loadCommands();
		this.utils.loadSlashCommands();
		this.utils.loadEvents();

		await super.login(token);
	}
};
