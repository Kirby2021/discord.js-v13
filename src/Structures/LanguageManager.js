const i18next = require('i18next');
const Backed = require('i18next-fs-backend');
const path = require('path');
const fs = require('fs').promises;

const Logger = require('./Logger');
const logger = new Logger();

module.exports = async () => {
	const { namespaces, languages } = await dirWalk(
		path.resolve(__dirname, '../Assets/Languages/'),
	);

	i18next.use(Backed);
	await i18next.init({
		backend: {
			loadPath: path.resolve(
				__dirname,
				'../Assets/Languages/{{lng}}/{{ns}}.json',
			),
		},
		debug: false,
		fallbackLng: 'en-US',
		initImmediate: false,
		interpolation: { escapeValue: false },
		load: 'all',
		ns: namespaces,
		preload: languages,
	});

	logger.log('READY', 'Loaded Language!');
	return new Map(languages.map((item) => [item, i18next.getFixedT(item)]));
};

async function dirWalk(dir, namespaces = [], foldername = '') {
	const files = await fs.readdir(dir);
	const languages = [];

	for (const file of files) {
		const stat = await fs.stat(path.join(dir, file));
		// If the stat are directory
		if (stat.isDirectory()) {
			// Reads if the file includes "-".
			const isLanguage = file.includes('-');
			if (isLanguage) languages.push(file);

			const folder = await dirWalk(
				path.join(dir, file),
				namespaces,
				isLanguage ? '' : `${file}/`,
			);
			namespaces = folder.namespaces;
		} else {
			namespaces.push(`${foldername}${file.substr(0, file.length - 5)}`);
		}
	}
	return { namespaces: [...new Set(namespaces)], languages };
}
