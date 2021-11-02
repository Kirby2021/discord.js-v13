const guildSchema = require('./Schema/GuildSchema');
// const AFKSchema = require('./Schema/AFKSchema');
// const warnSchema = require('./Schema/WarnSchema');

module.exports = class Database {
	constructor(client) {
		this.client = client;
	}

	/**
	 * * Database function (Searching a guild data)
	 */
	async findGuildData(guildId) {
		const guildData = await guildSchema.findOne({ guildId });
		if (!guildId)
			return console.log(
				this.client.logger.log('You need to provide the guildId!', 'ERR'),
			);
		if (!guildData) return guildSchema.create({ guildId });

		return guildData;
	}

	/**
	 * * Database function (Updating guild data)
	 */
	async updateGuild(findObj, updateObj) {
		const guildData = await guildSchema.findOneAndUpdate(findObj, updateObj);

		return guildData;
	}
};
