const Event = require('../../Structures/Event');
const {
	Message,
	MessageEmbed,
	MessageActionRow,
	MessageButton,
} = require('discord.js');

module.exports = class extends Event {
	/**
	 *
	 * @param {Message} message
	 *
	 */
	async run(message) {
		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>$`);
		const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}> `);

		if (message.author.bot) return;

		if (message.content.match(mentionRegex)) {
			const authorPrefix = message.member.displayName
				? message.member.displayName
				: message.member.username;

			const mentionedEmbed = new MessageEmbed()
				.setAuthor(
					await message.translate('misc:PREFIX_AUTHOR', { USER: authorPrefix }),
					message.author.displayAvatarURL({ dynamic: true }),
				)
				.setDescription(
					await message.translate('misc:PREFIX_DESCRIPTION', {
						PREFIX: this.client.config.client.prefix,
					}),
				)
				.setColor(this.client.config.color.invis);
			return message.reply({
				embeds: [mentionedEmbed],
				allowedMentions: { repliedUser: false },
			});
		}

		const mainPrefix = message.content.match(mentionRegexPrefix)
			? message.content.match(mentionRegexPrefix)[0]
			: this.client.config.client.prefix;

		const [cmd, ...args] = message.content
			.slice(mainPrefix.length)
			.trim()
			.split(/ +/g);

		const command =
			this.client.commands.get(cmd.toLowerCase()) ||
			this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()));

		if (!message.content.startsWith(mainPrefix)) return;

		try {
			const sender = message.author;
			if (message.channel.type == 'DM') {
				this.client.logger.log(
					'CMD',
					`${sender.tag} [${sender.id}] (DMs) Ran: ${command.name} command!`,
				);
			} else {
				this.client.logger.log(
					'CMD',
					`${sender.tag} [${sender.id}] (${message.guild.id}) Ran: ${command.name} Command!`,
				);
			}
		} catch (err) {
			return;
		}
		// Components
		const commandDisabledComp = new MessageActionRow().addComponents(
			new MessageButton()
				.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
				.setStyle('LINK')
				.setLabel('Click Here!'),
		);

		if (command) {
			if (
				command.ownerOnly &&
				!this.client.utils.checkOwner(message.author.id)
			) {
				return message.reply({
					content: await message.tranlate('misc:COMMAND_OWNERONLY'),
					allowedMentions: { repliedUser: false },
				});
			}

			if (command.guildOnly && !message.guild) {
				return message.reply({
					content: await message.translate('misc:COMMAND_GUILDONLY'),
					allowedMentions: { repliedUser: false },
				});
			}

			if (command.disabled) {
				return message.reply({
					content: await message.translate('misc:COMMAND_DISABLED'),
					allowedMentions: { repliedUser: false },
					components: [commandDisabledComp],
				});
			}

			if (command.nsfw && !message.channel.nsfw) {
				return message.reply({
					content: await message.translate('misc:COMMAND_NSFW'),
					allowedMentions: { repliedUser: false },
				});
			}

			if (command.args && !args.length) {
				return message.reply({
					content: await message.translate('misc:COMMAND_ARGS', {
						USAGE: command.usage,
					}),
					allowedMentions: { repliedUser: false },
				});
			}

			if (message.guild) {
				const userPermCheck = command.userPerms
					? this.client.defaultPerms.add(command.userPerms)
					: this.client.defaultPerms;
				if (userPermCheck) {
					const missing = message.channel
						.permissionsFor(message.member)
						.missing(userPermCheck);

					const grammarCheck = missing.length > 1 ? 's' : '';

					if (missing.length) {
						return message.reply({
							content: await message.translate('misc:COMMAND_USERPERMCHECK', {
								PERMS: this.client.utils.formatArray(
									missing.map(this.client.utils.formatPerms),
								),
								GRAMMAR: grammarCheck,
							}),
							allowedMentions: { repliedUser: false },
						});
					}
				}

				const botPermCheck = command.botPerms
					? this.client.defaultPerms.add(command.botPerms)
					: this.client.defaultPerms;
				if (botPermCheck) {
					const missing = message.channel
						.permissionsFor(message.member)
						.missing(userPermCheck);
					const grammarCheck = missing.length > 1 ? 's' : '';

					if (missing.length) {
						message.reply({
							content: await message.translate('misc:COMMAND_BOTPERMCHECK', {
								PERMS: this.client.utils.formatArray(
									missing.map(this.client.utils.formatPerms),
								),
								GRAMMAR: grammarCheck,
							}),
						});
					}
				}
			}
		}

		try {
			await command.run(message, args);
		} catch (err) {
			console.log(err);
		}
	}
};
