const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Removes a given amount of messages')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of messages to remove')
				.setRequired(true)),
	async execute(interaction) {
		try {
			const amount = interaction.options.getNumber("amount");
			const channel = interaction.channel;
			const messages = await channel.messages.fetch({ limit: amount });
			await interaction.deferReply();
			channel.bulkDelete(messages);
			const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setDescription(`${amount} messages deleted`);
			//send the embed
			await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			await interaction.reply({ ephemeral: true, content: "An error has ocurred while attempting to delete messages" });
			console.error(error);
		}
	},
};