const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { default: fetch } = require('node-fetch');
const { promisify } = require('util');
const glob = promisify(require('glob'));
const fs = require('fs').promises;
const path = require('path');

const SlashCommand = require('./SlashCommand');
const Command = require('./Command.js');
const Event = require('./Event');

module.exports = class Util {
	constructor(client) {
		this.client = client;
	}

	/**
	 * @param {input} input
	 */
	isClass(input) {
		return (
			typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class'
		);
	}

	/**
	 * @param {*} function a function to get a directory
	 */
	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	/**
	 * @param {arr} arr Remove a duplicated item within an array
	 */
	removeDuplicates(arr) {
		return [...new Set(arr)];
	}

	/**
	 * @param {arr} arr Remove a duplicated label within an array
	 */
	removeDupedLabel(arr) {
		const uniq = {};
		const arrFiltered = arr.filter(
			(obj) =>
				!uniq[(obj.label, obj.value)] && (uniq[(obj.label, obj.value)] = true),
		);

		return arrFiltered;
	}

	/**
	 *
	 * @param {string} string Capitalise the first letter of a string
	 */
	capitalise(string) {
		return string
			.split(' ')
			.map((str) => str.slice(0, 1).toUpperCase() + str.slice(1))
			.join(' ');
	}

	/**
	 * @param {string} string Not capitalising the first letter of a string
	 */
	notCapitalise(string) {
		return string
			.split(' ')
			.map((str) => str.slice(0, 1).toLowerCase() + str.slice(1))
			.join(' ');
	}

	/**
	 * @param {target} target Checks if the user are owner or not
	 */
	checkOwner(target) {
		return this.client.config.client.owners.includes(target);
	}

	/**
	 * @param {member} member
	 * @param {target} target
	 * @description Checking the member role and the target role position
	 */
	comparePerms(member, target) {
		return member.roles.highest.position < target.roles.highest.position;
	}

	/**
	 * @param {message} message
	 * @param {target} target
	 * @description Checks if the target role are higher than the bot role
	 */
	rolePosition(message, target) {
		return (
			message.guild.member(target).roles.highest.position >
			message.guild.member(this.client.user).roles.highest.position
		);
	}

	/**
	 * @param {arr} arr
	 * @param {maxLen} maxLen
	 * @description Trimming an array if the length are exceeds the limit
	 */
	trimArray(arr, maxLen = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} More...`);
		}
		return arr;
	}

	/**
	 *
	 * @param {id} id
	 * @description A MiniGames function where you can convert the id of a MiniGames to its name
	 */
	togetherFunc(id) {
		const obj = {
			'YouTube Together': '755600276941176913',
			'Betrayal.io': '773336526917861400',
			'Poker Night': '755827207812677713',
			'Fishington.io': '814288819477020702',
			'Chess.io': '832012586023256104',
		};
		let string;

		if (obj['YouTube Together'] === id) string = 'YouTube Together';
		if (obj['Fishington.io'] === id) string = 'Fishington.io';
		if (obj['Betrayal.io'] === id) string = 'Betrayal.io';
		if (obj['Poker Night'] === id) string = 'Poker Night';
		if (obj['Chess.io'] === id) string = 'Chess.io';

		return string;
	}

	/**
	 * @param {bytes} bytes
	 * @description A Function to re-format to its current bytes
	 */
	formatBytes(bytes) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	/**
	 * @param {perm} perm
	 * @description A function to re-format the permission string
	 */
	formatPerms(perm) {
		return perm
			.toLowerCase()
			.replace(/(^|"|_)(\S)/g, (s) => s.toUpperCase())
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Activity');
	}

	/**
	 * @param {message} message
	 * @param {embed} embed
	 * @param {component} component
	 * @description A function that automatically send a tip where it numbers reach 15/25
	 */
	sendTip(message, embed, component) {
		const tips = [`You can type \`/\` to use slash commands!`];

		const num = Math.floor(Math.random() * 100) + 2;
		const randTip = tips[Math.floor(Math.random() * tips.length)];

		if (num >= 15 && num <= 25) {
			return message.channel.send({
				content: `**TIP** | ${randTip}`,
				embeds: [embed],
			});
		} else {
			return message.channel.send({
				embeds: [embed],
			});
		}
	}

	/**
	 * @param {category} category
	 * @param {message} message
	 * @description Checks if the category are "Owner" or "NSFW"
	 */
	categoryCheck(category, message) {
		category = category.toLowerCase();
		switch (category) {
			case 'owner':
				return this.checkOwner(message.author.id);
			case 'nsfw':
				return message.channel.nsfw;
			default:
				return true;
		}
	}

	/**
	 * @param {url} url
	 * @param {key} key
	 * @description A function to fetch Alex api
	 */
	async alexApi(url, key) {
		try {
			const res = await fetch(url.toString(), {
				headers: {
					Authorization: `${key}`,
				},
			});
			return res.headers.get('content-type') === 'application/json'
				? await res.json()
				: await res.buffer();
		} catch (err) {
			console.log('ALEX API ERROR! :', err);
		}
	}

	/**
	 * @param {message} message
	 * @param {toFind} toFind
	 * @description A function to get a member by its ID/Username/Nickname/Tag
	 */
	getMember(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target = message.guild.members.cache.get(toFind);

		if (!toFind) {
			target = message.member;
		}

		if (!target && message.mentions.members)
			target = message.mentions.members.first();

		if (!target && toFind) {
			target = message.guild.members.cache.find((member) => {
				return (
					member.displayName.toLowerCase().includes(toFind) ||
					member.user.tag.toLowerCase().includes(toFind)
				);
			});
		}

		if (!target) {
			this.inlineReply(
				message,
				false,
				null,
				"Im sorry, but i can't find that user!",
			);
		}

		return target;
	}

	/**
	 * @param {message} message
	 * @param {toFind} toFind
	 * @description A function to get a channel by its ID/Name
	 */
	getChannel(message, toFind = '') {
		toFind = toFind.toLowerCase();

		let target = message.guild.channels.cache.get(toFind);

		if (!toFind) {
			target = message.channel;
		}

		if (!target && message.mentions.channels)
			target = message.mentions.channels.first();

		if (!target && toFind) {
			target = message.guild.channels.cache.find((channel) => {
				return channel.name.toLowerCase().includes(toFind.toLowerCase());
			});
		}

		if (!target) {
			this.inlineReply(
				message,
				false,
				null,
				"Im sorry, but i can't find that channel Name/ID!",
			);
		}

		return target;
	}

	/**
	 * @param {message} message
	 * @param {array} array
	 * @param {stringLength} stringLength
	 * @param {title} title
	 * @param {filter} filter
	 * @param {time} time
	 * @description A function to create a embed pages
	 *
	 * @example // an example of the filter
	 * const filter = (interaction) => interaction.user.id === message.author.id;
	 */
	async embedPages(message, array, stringLength, title, filter, time) {
		// Previous & Next button
		const buttonIdPREVIOUS = 'previous-page';
		const buttonIdNEXT = 'next-page';

		const buttonNext = new MessageButton()
			.setCustomId(buttonIdNEXT)
			.setLabel('Next')
			.setStyle('PRIMARY');
		const buttonPrevious = new MessageButton()
			.setCustomId(buttonIdPREVIOUS)
			.setLabel('Previous')
			.setStyle('PRIMARY');

		let index = 0;
		const generateEmbed = (index, array) => {
			const item = array.slice(index, index + stringLength);

			return new MessageEmbed({
				color: this.client.config.color.invis,
				title: `${title} ${index + 1}/${index + item.length}`,
				description: item.join('\n'),
			});
		};

		const canFitOnOnePage = array.length <= stringLength;
		const generatedEmbed = generateEmbed(index, array);

		const row = new MessageActionRow().addComponents([
			buttonPrevious.setDisabled(true),
			buttonNext,
		]);

		const sendMsg = await message.channel.send({
			embeds: [generatedEmbed],
			components: canFitOnOnePage ? [] : [row],
		});

		if (canFitOnOnePage) return;

		const collector = sendMsg.createMessageComponentCollector({
			filter,
			time,
		});

		let currentIndex = 0;
		collector.on('collect', async (interaction) => {
			// * Increase/decrease the current index.
			interaction.customId === buttonIdPREVIOUS
				? (currentIndex -= stringLength)
				: (currentIndex += stringLength);
			// * Reset the timer if the button was clicked.
			collector.resetTimer({ time: 10000, idle: 10000 });

			await interaction.update({
				embeds: [generateEmbed(currentIndex, array)],
				components: [
					new MessageActionRow({
						components: [
							...(currentIndex
								? [buttonPrevious.setDisabled(false)]
								: [buttonPrevious.setDisabled(true)]),
							...(currentIndex + stringLength < array.length
								? [buttonNext.setDisabled(false)]
								: [buttonNext.setDisabled(true)]),
						],
					}),
				],
			});
		});

		collector.on('end', (interaction) => {
			const timedOut = new MessageActionRow().addComponents([
				buttonPrevious.setDisabled(true),
				buttonNext.setDisabled(true),
			]);

			sendMsg.edit({
				embeds: [generatedEmbed],
				components: [timedOut],
			});
		});
	}

	/**
	 * @description A function to load all of the Normal Commands
	 */
	async loadCommands() {
		return glob(`${this.directory}Commands/**/*.js`).then((commands) => {
			for (const commandFile of commands) {
				delete require.cache[commandFile];
				const { name } = path.parse(commandFile);
				const File = require(commandFile);
				if (!this.isClass(File))
					throw new TypeError(`Command ${name} doesn't export a class.`);
				const command = new File(this.client, name.toLowerCase());
				if (!(command instanceof Command))
					throw new TypeError(`Command ${name} doesn't belong in commands.`);
				this.client.commands.set(command.name, command);
				if (command.aliases.length) {
					for (const alias of command.aliases) {
						this.client.aliases.set(alias, command.name);
					}
				}
			}
		});
	}

	/**
	 * @description A function to load all of the Slash Commands
	 */
	async loadSlashCommands() {
		return glob(`${this.directory}/SlashCommands/**/*.js`).then((slashCmd) => {
			for (const slashFile of slashCmd) {
				delete require.cache[slashFile];
				const { name } = path.parse(slashFile);
				const File = require(slashFile);
				if (!this.isClass(File))
					throw new TypeError(`Slash Command ${name} doesn't export a class.`);
				const slash = new File(this.client, name.toLowerCase());
				if (!(slash instanceof SlashCommand))
					throw new TypeError(
						`Slash Command ${name} doesn't belong in slash commands.`,
					);
				this.client.slashCommands.set(slash.name, slash);

				const bool = this.client.slashCommands.get(slash.name);
				bool.devMode
					? this.client.guilds.cache
							.get('724522833937694781')
							.commands.create(slash)
					: this.client.application.commands.create(slash);
			}
		});
	}

	/**
	 * @description A function to load all of the Events
	 */
	async loadEvents() {
		return glob(`${this.directory}Events/**/*.js`).then((events) => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File))
					throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event))
					throw new TypeError(`Event ${name} doesn't belong in Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args) => event.run(...args));
			}
		});
	}
};
