const Parser = require("rss-parser");
const parser = new Parser();
const GUIDsPath = __dirname + "/./already-sent-items-guids.json";
const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const config = require(__dirname + "/../config.json");

module.exports = {
	lookForRSSNews: async function(updatesChannels) {
		const regexWhitelist = JSON.parse(fs.readFileSync(__dirname + "/./term-regex-whitelist.json")).map(str => new RegExp(str, "i"));

		const sentItemsGUIDs = JSON.parse(fs.readFileSync(GUIDsPath)); //requiring here and not above to save memory when not executing this method
		//get the rss feed
		let nyaaRSSfeed;
		try {
			nyaaRSSfeed = await parser.parseURL(config.RSSFeedSite);
		} catch (exception) {
			console.error("Couldn't reach the site.");
			return;
		}

		//save it if it's something of interest that hasn't been sent before
		const worthwileItems = [];
		for (const item of nyaaRSSfeed.items) {
			if (notAlreadySent(item) && isWorthwile(item)) {
				worthwileItems.push(item);
			}
		}

		//send saved articles to channels
		const embedList = [];
		for (const channel of updatesChannels) {
			for (const item of worthwileItems) {
				sentItemsGUIDs.push(item.guid);
				embedList.push(itemEmbed(item));
			}
			if (embedList.length != 0) {
				channel.send({ embeds: embedList });
				fs.writeFileSync(GUIDsPath, JSON.stringify(sentItemsGUIDs), 'utf-8');
			}
		}

		//this checks if a rss feed item matches any of the whitelisted terms
		function isWorthwile(item) {
			for (const regex of regexWhitelist) {
				if (regex.test(item.title)) {
					return true;
				}
			}
			return false;
		}

		//this checks if a rss feed item has already been sent
		function notAlreadySent(item) {
			return !sentItemsGUIDs.includes(item.guid);
		}

		//this creates the embed for each item of interest
		function itemEmbed(item) {
			const embed = new EmbedBuilder();
			embed.setTitle(item.title);
			embed.setURL(item.link);

			return embed;
		}
	}
};