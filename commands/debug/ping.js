const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong, then edits its own message!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('Pong again!');
	},
};