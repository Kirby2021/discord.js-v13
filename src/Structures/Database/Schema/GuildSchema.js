const { Schema, model } = require('mongoose');
const config = require('../../../Assets/JSON/config.json');

const guildSchema = Schema({
	guildId: String,
	// Prefix
	prefix: { type: String, default: config.client.prefix },
	// Language
	language: { type: String, default: 'en-US' },
	// Other
});

module.exports = model('guild-data', guildSchema, 'guild-data');
