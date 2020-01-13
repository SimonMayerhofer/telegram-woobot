# Serverless Telegram Bot to work with WooCommerce shops

Create serverless Telegram Bot with DB to keep track of events in your WooCommerce store using Netlify Functions and FaunaDB

[![Netlify Status](https://api.netlify.com/api/v1/badges/ed75e298-c088-459c-8e77-fe196eca9dab/deploy-status)](https://app.netlify.com/sites/telegram-woobot/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SimonMayerhofer/telegram-woobot)

## Getting Started

* Getting Telegram Bot token and FaunaDB key
* Deploy to Netlify
* Hooking up the Bot

## Getting Telegram Bot token and FaunaDB key
On Telegram, create a new Telegram bot by talking to [@botfather](https://telegram.me/botfather) and thereafter getting the token for the Telegram Bot.

On FaunaDb site, create a collection with the name ```user``` (optionally, generate an index for the collection and specifying the term for the **userId** to be unique). Head to the security section and generate a FaunaDB key for the collection.

## Deploy to Netlify

Deploy to Netlify either by linking to this repository manually or by clicking the Deploy to netlify.

Thereafter, fill in the environment variables ```TELEGRAM_BOT_TOKEN```, ```FAUNA_SECRET_KEY``` with the token and the secret key obtained respectively

## Hooking up the Bot

Once the above are done, you need to specify and tell telegram where your bot should direct the messages it received to. Do so by simply visiting this url
```
https://api.telegram.org/bot{your_bot_token}/setWebhook?url={url_of_the_Netlify_Function}
```
Afterwhich, YOU ARE DONE!🎉🎉

Try typing ```/start``` to your bot and watch as the user ID of the Telegram user is stored inside your FaunaDB

## Extending Telegram Bot Functionality

This bot uses telegraf.js for its Telegram Bot functionality. Head to its [website](https://telegraf.js.org/#/) to find out how to extend the functionality of the bot you have created :)

## Local Development

To locally test and develop the bot follow these steps:

1. Create a new Telegram Bot and a new FaunaDB database for testing.
2. Create `.env` file and enter your bot token + secret key:
   ```
   TELEGRAM_BOT_TOKEN_DEV=your_dev_bot_token
   FAUNA_SECRET_KEY_DEV=your_dev_secret_key
   ```
3. Setup Netlify CLI for Netlify Dev server ([more info](https://github.com/netlify/cli/blob/master/docs/netlify-dev.md))
   ```bash
   # Install the Netlify CLI
   npm install netlify-cli -g
   # Login to Netlify
   netlify login
   # Link to site on Netlify
   netlify link
   ```
4. Start Netlify Dev server
   ```
   netlify dev --live
   ```
5. Run dev script. This script updates your bot webhook to your local Netlify Dev server.
   ```
   npm run dev
   ```
