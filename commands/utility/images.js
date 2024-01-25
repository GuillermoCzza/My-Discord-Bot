const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios'); //To make a request for the images
const { imageSearchKey } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('images')
		.setDescription('Sends images to this channel')
		.addStringOption(search =>
			search
				.setName("search")
				.setDescription("what to search for")
				.setRequired(true)
		)
		.addNumberOption(amount =>
			amount
				.setName('amount')
				.setDescription('amount of images to send (max 10)')
		)
		.addNumberOption(page =>
			page
				.setName('page')
				.setDescription('page of results to start from (max 10)')
		),
	async execute(interaction) {
		const query = interaction.options.getString("search");
		let amount = interaction.options.getNumber("amount");
		if (!amount) { amount = 1; }
		if (amount > 10) { amount = 10; }
		let page = interaction.options.getNumber("page");
		if (!page) { page = 0; }
		if (page > 10) { page = 10; }

		await interaction.deferReply();
		try {
			const response = await axios.get(`https://www.googleapis.com/customsearch/v1?cx=745c600e8ed73423f&num=${amount}&q=${query}&safe=off&searchType=image&start=${10 * page}&key=${imageSearchKey}`);
			const items = response.data.items;

			//build the embed
			const imageEmbed = new EmbedBuilder();
			//add image URL to embed and send it
			for (const index in items) {
				imageEmbed.setTitle(query + " " + index);
				imageEmbed.setImage(items[index].link);
				if (index == 0) {
					await interaction.editReply({ embeds: [imageEmbed] });
				} else {
					await interaction.followUp({ embeds: [imageEmbed] });
				}
			}
		} catch (error) {
			await interaction.editReply("An error has occurred");
			console.error(error);
		}


	},
};