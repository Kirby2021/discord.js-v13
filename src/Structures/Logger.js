const chalk = require('chalk');
const moment = require('moment');

module.exports = class Logger {
	log(type, content) {
		const time = `[${moment().format('HH:mm:ss')}]`;

		switch (type) {
			case 'READY':
				console.log(chalk.blue(`[${type.toUpperCase()}] ${time} : ${content}`));
				break;

			case 'WARN':
				console.log(
					chalk.yellow(`[${type.toUpperCase()}] ${time} : ${content}`),
				);
				break;

			case 'CMD':
				console.log(
					chalk.whiteBright(`[${type.toUpperCase()}] ${time} : ${content}`),
				);
				break;

			case 'ERR':
				console.log(chalk.red(`[${type.toUpperCase()}] ${time} : ${content}`));
				break;
			default:
				throw new TypeError(`[LOGGER] Cannot find type ${chalk.red(type)}!`);
		}
	}
};
