const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('message-test')
		.setDescription('Sends a debug message in this channel'),
	async execute(interaction) {
		const channel = interaction.channel;
		channel.send('Test!');
		interaction.reply("si no mando este mensaje discord me reta (son dos métodos distintos)");
	},
};