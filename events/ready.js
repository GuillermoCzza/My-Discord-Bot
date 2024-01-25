const { Events } = require('discord.js');
const CronJob = require('cron').CronJob;
const config = require(__dirname + "/../config.json");
const path = require('path');
const fs = require('fs');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		const RSSFolderPath = path.join(process.cwd(), "/RSS_news_discord_messenger/");

		const updatesChannelsIDsPath = RSSFolderPath + "updates-channels.json";
		const sentItemsGUIDsPath = RSSFolderPath + "already-sent-items-guids.json";
		const termRegexWhitelistPath = RSSFolderPath + "term-regex-whitelist.json";

		//if not yet existing (for example, if repo has just been downloaded), create the database .json files with empty arrays
		if (!fs.existsSync(updatesChannelsIDsPath)) {
			fs.writeFileSync(updatesChannelsIDsPath, '[]');
		}
		if (!fs.existsSync(sentItemsGUIDsPath)) {
			fs.writeFileSync(sentItemsGUIDsPath, '[]');
		}
		if (!fs.existsSync(termRegexWhitelistPath)) {
			fs.writeFileSync(termRegexWhitelistPath, '[]');
		}


		const updatesChannelsIDs = require(updatesChannelsIDsPath);

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