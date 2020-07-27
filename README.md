# Discord Plays Set!

![screenshot](https://i.imgur.com/D8Z7B9f.png)

Small little bot to allow users in a [Discord](https://discord.com) channel to play the game of
[Set!](https://setgame.com) together.

## What is Set?

Set! is a game by [Set Enterprises Inc.](https//setgame.com). A board of cards is laid out, each
with various shapes. Each card has four properties: the fill style (solid, striped, or outline),
shape (oval, squiggle, or diamond), color (red, green, or purple), and count (1, 2, or 3 shapes).
The goal is to make as many Sets as possible - groups of three cards where for each property, the
cards are *either* all unique or all the same.

## Invite Link

**Status:** Not currently up.

https://discord.com/oauth2/authorize?client_id=737141757317349376&scope=bot&permissions=67584

## How to Run

Install with `yarn` (or your Node package manager of choice) and execute `npm run start` to start
the bot. A Discord API key is required - copy the format in [`secret_example.json`](secret_example.json)
and save it in the project root as `secret.json`.

### Some Basic Comands
|Command | Description | Example|
|--------|-------------|--------|
|S!newgame [minutes] [easy?]|Start a new game for the channel.|`S!newgame 1 easy`|
|S!refresh|Refresh the board and re-randomize the cards|`S!refresh`|
|S!pick # # #|Pick the cards at the given numbers to check if they are a Set|`S!pick 0 1 8`|
|S!board|See the board|`S!board`|
|S!count|See the number of Sets you've found so far|`S!count`|
|S!time|See the time remaining|`S!time`|

## Credits

The game of Set! was designed by [Set Enterprises Inc.](https//setgame.com). These graphics are from
an assignment used in the University of Washington's [CSE 154: Web Development](https://cs.uw.edu/154).

#### Disclaimer

This is a Discord version of the game of Set, which is also used as a homework assignment in
CSE 154. **This is not a solution for that assignment.** The code for this Discord bot is completely
different from the code that would be needed to complete that assignment. If you are a student looking
for a solution... just uh... do your homework. (⚆_⚆)
