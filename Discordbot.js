const Discord = require('discord.js');
const client = new Discord.Client();
const { LanguageTool } = require('language-tool-node');

const languageTool = new LanguageTool({ language: 'en-US' });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', async (message) => {
  if (message.content.startsWith('!fix')) {
    const text = message.content.slice('!fix'.length).trim();
    const correctedText = await correctGrammar(text);
    message.channel.send(`Fixed Grammar: ${correctedText}`);
  }
});

async function correctGrammar(text) {
  try {
    const { matches } = await languageTool.check({ text });
    const correctedText = LanguageTool.correct(text, matches);
    return correctedText;
  } catch (error) {
    console.error('Error correcting grammar:', error);
    return 'An error occurred while correcting grammar.';
  }
}

// Replace 'YOUR_BOT_TOKEN' with your actual bot token
client.login('YOUR_BOT_TOKEN');
