const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//for each server the bot is in
		for (const guild of client.guilds.cache) {
			const guildId = guild.toString().split(",")[0];
			//get banned terms file path
			const filePath = path.join(__dirname, '../bannedTerms/' + guildId + '.json');

			//write file if it doesn't exist
			if (!fs.existsSync(filePath)) {
				fs.writeFileSync(filePath, JSON.stringify([]), 'utf-8');
			}
		}

	},
};