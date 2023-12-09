const { Events } = require('discord.js');
const CronJob = require('cron').CronJob;
const config = require(__dirname + "/../config.json");
const RSSFolderPath = "../RSS_news_discord_messenger/";
const updatesChannelsIDs = require(RSSFolderPath + "updates-channels.json");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		//set up RSS reader
		const updatesChannels = updatesChannelsIDs.map(channelID => client.channels.cache.get(channelID));
		const RSSNewsDiscordMessenger = require(RSSFolderPath + "RSSNewsDiscordMessenger.js");


		const RSSNewsJob = CronJob.from({
			cronTime: config.RSSNewsCronTime,
			onTick: async () => RSSNewsDiscordMessenger.lookForRSSNews(updatesChannels)
		});
		RSSNewsJob.start();


		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};