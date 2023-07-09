const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();

const prefix = '!';

const grammarlyApiKeys = new Map();

function getGrammarlyApiKey(userId) {
  return grammarlyApiKeys.get(userId);
}

client.on('ready', () => {
  console.log('Bot is ready.');
});

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === 'fixgrammar') {
    const userId = message.author.id;
    const grammarlyApiKey = getGrammarlyApiKey(userId);

    if (!grammarlyApiKey) {
      message.channel.send('Sorry, your Grammarly API key is not set. Contact the bot administrator.');
      return;
    }

    const sentence = args.join(' ');

    try {
      const response = await axios.post('https://api.grammarly.com/v1/check', {
        text: sentence
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grammarlyApiKey}`
        }
      });

      const correctedText = response.data.result.text;
      message.channel.send(`Corrected Sentence: ${correctedText}`);
    } catch (error) {
      console.error('Error occurred while fixing grammar:', error);
      message.channel.send('Sorry, an error occurred while fixing the grammar.');
    }
  } else if (command === 'setapikey') {
    const apiKey = args[0];

    grammarlyApiKeys.set(message.author.id, apiKey);

    message.channel.send('Grammarly API key set successfully!');
  }
});

client.login('YOUR_DISCORD_BOT_TOKEN');
