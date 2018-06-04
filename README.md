# Space Boat
Discord.js Multifunction bot primarily made for the [Space Engine Discord Server](https://discordapp.com/spaceengine)
## Planned features
 - ~~Moderation features such as mute, kick, ban, "roleremove", and some other role addition commands.~~
 - ~~Logging functionality to log user actions such as leaving and entering the server, information of which is stored in a logging channel.~~
 - Role stasis, where if a user leaves the server and comes back less than a week after, their roles remain. (mainly to prevent someone from getting rid of their roles)
 - An "experience" and autorole system.
 - An adaptable "Starboard", where a channel can be made into a starboard, that listens to a set of channels given to it, and the "starring" of messages in said channel.

## Getting the official bot on your server
This is currently unavailable as the bot is still highly in development! For now, you can try out the bot by installing it yourself, as shown below!

## Installation and Running of the bot.
This bot requires [node.js](https://nodejs.org/en/download/), [git](https://git-scm.com/downloads), and [yarn](https://yarnpkg.com/en/docs/install). 

To download the **stable** version of the bot; i.e. the version the official bot is running, run the following in a terminal:
```bash
git clone https://github.com/Votyn/SpaceBoat.git
```
To download the **indev** version of the bot that I am currently working on, you have to clone from the `dev` branch:
```bash
git clone -b dev https://github.com/Votyn/SpaceBoat.git
```
Having downloaded the bot, download the node dependencies:
```bash
yarn install
```
Then to start the bot (This uses `nodemon`):
```bash
yarn start
```
If you want to run it in the background with `screen` you can use `yarn background` instead.
