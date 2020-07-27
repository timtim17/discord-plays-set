'use strict';

const cardEmotes = require('./emotes.json');

const STYLE = ['solid', 'striped', 'outline'];
const SHAPE = ['diamond', 'squiggle', 'oval'];
const COLOR = ['red', 'purple', 'green'];
const COUNT = [1, 2, 3];
const EASY_CARDS = 9; // easy game has 9 cards
const NORMAL_CARDS = 12;
const TIME_WARNS = [30, 10];

class SetGame {
  constructor(isEasy, minutes, channel) {
    if (minutes < 1 || minutes > 5) {
      throw new Error('Minutes out of range. Must be at least 1 minute and no more than 5.');
    }
    this.board = [];
    this.isEasy = isEasy;
    this.remainingSeconds = minutes * 60;
    this.timer = setInterval(this.advanceTimer.bind(this), 1000);
    this.channel = channel;
    this.setCount = 0;

    this.fillBoard();
  }

  fillBoard() {
    this.board = [];
    for (let i = 0; i < (this.isEasy ? EASY_CARDS : NORMAL_CARDS); i++) {
      this.board.push(this.generateRandomCard());
    }
  }

  generateRandomCard() {
    const style = this.isEasy ? 'solid' : pickRandom(STYLE);
    const shape = pickRandom(SHAPE);
    const color = pickRandom(COLOR);
    const count = pickRandom(COUNT);
    const card = new SetCard(style, shape, color, count);
    if (this.board.reduce((acc, cur) => acc || cur.toString() === card.toString(), false)) {
      // card already on board, rerandom
      return this.generateRandomCard();
    } else {
      return card;
    }
  }

  advanceTimer() {
    this.remainingSeconds -= 1;
    if (this.remainingSeconds <= 0) {
      this.channel.send(`**__Time's Up!__** You found ${this.setCount} Sets!`);
      clearInterval(this.timer);
    } else if (TIME_WARNS.includes(this.remainingSeconds)) {
      this.channel.send(`**${this.remainingSeconds} seconds left!**`);
    }
  }

  isGameDone() {
    return this.remainingSeconds <= 0;
  }

  getMMSS() {
    let seconds = ("0" + this.remainingSeconds % 60).slice(-2);
    let minutes = Math.floor(this.remainingSeconds / 60);
    return minutes + ":" + seconds;
  }

  async printBoard() {
    for (let i = 0; i < this.board.length; i += 3) {
      await this.channel.send(`[${i} - ${i + 2}]`);
      let result = '';
      for (let j = i; j < Math.min(this.board.length, i + 3); j++) {
        result += this.board[j].toEmote();
      }
      await this.channel.send(result);
    }
  }

  pick(one, two, three) {
    if (one < 0 || one >= this.board.length
      || two < 0 || two >= this.board.length
      || three < 0 || three >= this.board.length) {
        this.channel.send('Make sure all your card numbers are on the board!');
      } else {
        let oneCard = this.board[one];
        let twoCard = this.board[two];
        let threeCard = this.board[three];
        this.channel.send(oneCard.toEmote() + twoCard.toEmote() + threeCard.toEmote())
          .then(() => {
            if (isASet(oneCard, twoCard, threeCard)) {
              this.channel.send("**SET!**\n---");
              this.setCount++;
              this.board[one] = this.generateRandomCard();
              this.board[two] = this.generateRandomCard();
              this.board[three] = this.generateRandomCard();
              this.printBoard();
            } else {
              this.channel.send("**Not a Set :(**");
            }
          })
          .catch(err => this.channel.send(`**__Error:__** ${err.message}`));
      }
  }
}

class SetCard {
  constructor(style, shape, color, count) {
    this.style = style;
    this.shape = shape;
    this.color = color;
    this.count = count;
    this.emote = cardEmotes[`${style}_${shape}_${color}`];
  }

  toString() {
    return `${this.style}-${this.shape}-${this.color}-${this.count}`;
  }

  toEmote() {
    let result = cardEmotes.card_left;
    switch (this.count) {
      case 1:
        result += cardEmotes.card_blank + this.emote + cardEmotes.card_blank;
        break;
      case 2:
        result += this.emote + cardEmotes.card_blank + this.emote;
        break;
      case 3:
        result += this.emote + this.emote + this.emote;
        break;
      default:
        throw new Error('Invalid count for card - ' + this.count);
    }
    return result + cardEmotes.card_right;
  }
}

/**
 * Picks a random item out of the given array
 * @param {any[]} array - The array to pick an item out of
 * @return {any} The item randomly picked
 */
function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Checks if the given card are a set, that is for all properties they are all unique or all the
 * same across the cards.
 * @param {...SetCard} var_args - Cards to check if they are a Set or not
 */
function isASet() {
  const cardProps = [...arguments].map(card => card.toString().split('-'));
  for (let i = 0; i < cardProps[0].length; i++) {
    let props = new Set(cardProps.reduce((acc, cur) => [...acc, cur[i]], []));
    if (props.size > 1 && props.size < arguments.length) {
      return false;
    }
  }
  return true;
}

module.exports = SetGame;
