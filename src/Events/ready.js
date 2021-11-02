const Event = require('../Structures/Event');

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			once: true,
		});
	}

	async run() {
		this.client.logger.log('READY', `Logged In As ${this.client.user.tag}`);
		this.client.logger.log(
			'READY',
			`Loaded ${this.client.commands.size} Commands!`,
		);
		this.client.logger.log(
			'READY',
			`Loaded ${this.client.events.size} Events!`,
		);

		// Status
		this.client.user.setActivity(`Created by Paiz#0617 with 💜`, {
			type: 'WATCHING',
		});

		// Load slash command!
		this.client.utils.loadSlashCommands().then(() => {
			this.client.logger.log(
				'READY',
				`Loaded ${this.client.slashCommands.size} Slash Commands!`,
			);
		});
	}
};
