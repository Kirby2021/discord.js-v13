const Command = require('../../Structures/Command');

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			userPerms: ['MANAGE_GUILD'],
			botPerms: [],
			aliases: ['lang', 'setlang', 'setlanguage'],
			description: "Change the bot's language",
			usage: '<Language>',
			category: 'Configuration',
			guildOnly: true,
			ownerOnly: false,
			nsfw: false,
			args: true,
			disabled: false,
		});
	}

	async run(message, args) {
		const guildData = await this.client.mongodb.findGuildData(message.guild.id);
		const language = this.client.languages.find(
			(lang) =>
				lang.name === args[0].toLowerCase() ||
				lang.aliases.includes(args[0].toLowerCase()),
		);

		if (guildData) {
			if (language) {
				await this.client.mongodb.updateGuild(
					{ guildId: message.guild.id },
					{ language: language.name },
				);

				return message.reply({
					content: await message.translate(
						'Configuration/setlang:LANGUAGE_CHANGED',
						{ LANGUAGE: language.nativeName },
					),
				});
			} else {
				message.reply({
					content: await message.translate(
						'Configuration/setlang:LANGUAGE_NOTFOUND',
						{
							LANGUAGE: this.client.languages
								.map((lang) => lang.nativeName)
								.join(', '),
						},
					),
				});
			}
		} else {
			await guildSchema.create({ guildId: message.guild.id });
			return message.reply({
				content: await message.translate(
					'Configuration/setlang:LANGUAGE_NODATABASE',
				),
			});
		}
	}
};
