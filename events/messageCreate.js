const { Events } = require('discord.js');
const path = require('path');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		if (!message.author.bot) { //only check for forbidden words if the author isn't a bot

			//get banned terms file path
			const guildId = message.guildId;
			const filePath = path.join(__dirname, '../bannedTerms/' + guildId + '.json');

			//require file
			const bannedTerms = require(filePath);

			//test the message for each regex and delete it if matches
			const content = message.content;
			bannedTerms.forEach(regexStr => {
				const regex = RegExp(regexStr, "i");
				const found = content.match(regex);
				if (found != null) {
					const channel = message.channel;
					const author = message.author;
					message.delete();
					channel.send('Deleted a message from user ' + author.username + ' for usage of the term "' + found + '".');
				}
			});
		}

	},
};