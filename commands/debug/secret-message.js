const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('secret-message')
		.setDescription('Sends a debug ephemeral message in this channel'),
	async execute(interaction) {
		await interaction.reply({ content:"Te amo :heart:", ephemeral: true });
	},
};