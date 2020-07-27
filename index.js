'use strict';

const discord = require('discord.js');
const { token } = require('./secret.json');
const SetGame = require('./Set');

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
    {name: PREFIX + 'ping', value: 'pong!', inline: true},
    {name: PREFIX + 'newgame [minutes] [easy?]', value: 'Starts a new game.', inline: true},
    {name: PREFIX + 'board', value: 'Shows the board, if there is one.', inline: true},
    {name: PREFIX + 'time', value: 'Shows the remaining time left in the game.', inline: true}
  );

const games = {};

client.on('ready', () => {
  console.log(`Client connected as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.length > 2 && msg.content.substring(0, 2).toUpperCase() === PREFIX) {
    try {
      const args = msg.content.substring(2).toLowerCase().split(' ');
      switch (args[0]) {
        case 'ping':
          msg.reply('pong!');
          break;
        case 'help':
          msg.channel.send('', HELP_EMBED);
          break;
        case 'test':
          msg.channel.send(new SetGame(true, 1, msg.channel).board[0].toEmote());
          break;
        case 'newgame':
          if (games.hasOwnProperty(msg.channel.id) && !games[msg.channel.id].isGameDone()) {
            msg.reply('Can\'t start a new game, one is already in progress.');
          } else {
            const [_, time, diff] = args;
            const minutes = parseInt(time);
            if (minutes) {
              games[msg.channel.id] = new SetGame(diff === 'easy', minutes, msg.channel);
              games[msg.channel.id].printBoard();
            } else {
              msg.reply(`\`${time}\` is not a valid time. Time must be between 1 and 5 minutes.`);
            }
          }
          break;
        case 'board':
          if (games.hasOwnProperty(msg.channel.id)) {
            if (games[msg.channel.id].isGameDone()) {
              msg.reply('The game is already over.');
            } else {
              games[msg.channel.id].printBoard();
            }
          } else {
            msg.reply('No game is currently running.');
          }
          break;
        case 'time':
          if (games.hasOwnProperty(msg.channel.id)) {
            if (games[msg.channel.id].isGameDone()) {
              msg.reply('The game is already over.');
            } else {
              msg.channel.send(games[msg.channel.id].getMMSS());
            }
          } else {
            msg.reply('No game is currently running.');
          }
          break;
        default:
          throw new Error('Unknown command');
      }
    } catch(err) {
      const embed = new discord.MessageEmbed()
        .setTitle('Uh oh, something went wrong!')
        .setDescription(err.message)
        .setColor(14294044);
      msg.reply('', embed);
      console.error(err);
    }
  }
});

client.login(token);
