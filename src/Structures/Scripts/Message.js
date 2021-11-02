const { Message } = require('discord.js');

module.exports = Object.defineProperties(Message.prototype, {
	translate: {
		value: async function (key, args) {
			const guildData = await this.client.mongodb.findGuildData(this.guild.id);
			const language = (await this.client.translations).get(guildData.language);
			if (!language) return 'Invalid language was set.';
			return language(key, args);
		},
	},
});
