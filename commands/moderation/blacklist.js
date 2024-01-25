const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('blacklist')
		.setDescription('adds (or removes) a term from the blacklist')
		.addStringOption(term =>
			term
				.setName("term")
				.setDescription("term to (un)blacklist")
				.setRequired(true)
		)
		.addBooleanOption(remove =>
			remove
				.setName('remove')
				.setDescription('If true, remove from blacklist instead of adding')
		),
	async execute(interaction) {
		const guildId = interaction.guild.id;
		const filePath = path.join(__dirname, '../../bannedTerms/' + guildId + '.json');
		const term = interaction.options.getString("term").toLowerCase();

		const bannedTerms = require(filePath);
		const index = bannedTerms.indexOf(term);

		if (interaction.options.getBoolean("remove")) {
			//If not in blacklist, don't do anything
			if (index == -1) {
				interaction.reply(`'${term}' not found in blacklist`);
				return;
			}
			bannedTerms.splice(index, 1);
			interaction.reply(`Removed '${term}' from blacklist`);
		} else {
			//If already in blacklist, don't do anything
			if (index != -1) {
				interaction.reply(`'${term}' already in blacklist`);
				return;
			}
			bannedTerms.push(term);
			interaction.reply(`Added '${term}' to blacklist`);
		}

		fs.writeFileSync(filePath, JSON.stringify(bannedTerms), 'utf-8');
	},
};