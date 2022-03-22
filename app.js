require('dotenv').config();
const tmi = require("tmi.js");
const mongoose = require('mongoose');
const Quote = require("./schemas/Quote.js");
const Channel = require("./schemas/Channel")
const { channel } = require('tmi.js/lib/utils');

mongoose.connect('mongodb://localhost:27017/quoteBot');

let channels = [];

Channel.find({}, (err,dbChannels) => {
	if(err) return handleError(err)
	channels = dbChannels.map((channel) => {
		return channel.channelName;
	});
	console.log(channels);
});

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'quotebotsk',
		password: process.env.TWITCH_OAUTH_TOKEN
	},
	channels: ["fahros"]
});
client.connect();

client.on('message', (channel, tags, message, self) => {
	if(self || !message.startsWith('!')) return;
	const channelName = channel;
	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(command === 'quote') {
		Quote.find(({channel: channelName}), (err, quotes) => {
			if(err) return handleError(err);
			if(quotes.length < 1) return;
			let max = quotes.length
			let quoteIndex = Math.floor(Math.random() * max);
			
			let foundQuote = quotes[quoteIndex].quote;
			let date = quotes[quoteIndex].date;

			let dateString = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`
			client.say(channel, `"${foundQuote}" ${dateString}`);
		})
	}else if(command === 'addquote'){
		let quote = args.join(" ");
		let newQuote = new Quote({quote: quote, channel:channel});
		newQuote.save();
		client.say(channel, `${quote} has been added to quotes`);
	}
});