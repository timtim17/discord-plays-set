const discord = require('discord.js');
const { token } = require('./secret.json');

const client = new discord.Client();

const PREFIX = 'S!';
const HELP_EMBED = new discord.MessageEmbed()
  .setTitle('Help')
  .setDescription('Small lil bot boi to play the game of Set! collaboratively with friends in a Discord channel!')
  .setColor(2182061)
  .addFields(
    {name: 'How to play Set!', value: 'Match as many sets of three cards as you can before time runs out! Cards are a set if for each property - color, fill style, shape, and number of shapes - are either all the same or all unique.'},
    {name: 'Credits', value: 'The game of Set! is made by Set Enterprises Inc. over at https://setgame.com. Original art for this game by the University of Washington\'s CSE 154 class, https://cs.uw.edu/154'},
    {name: PREFIX + 'help', value: 'Show this help text.', inline: true},
    {name: PREFIX + 'ping', value: 'pong!', inline: true}
  );

client.on('ready', () => {
  console.log(`Client connected as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.length > 2 && msg.content.substring(0, 2).toUpperCase() === PREFIX) {
    try {
      switch (msg.content.substring(2).toLowerCase()) {
        case 'ping':
          msg.reply('pong!');
          break;
        case 'help':
          msg.channel.send('', HELP_EMBED);
          break;
        default:
          throw new Error('Unknown command');
      }
    } catch(err) {
      const embed = new discord.MessageEmbed()
        .setTitle('Uh oh, something went wrong!')
        .setDescription(err.message)
        .setColor(14294044);
      msg.reply('', embed)
    }
  }
});

client.login(token);
