# Serverless Telegram Bot to work with WooCommerce shops

Create serverless Telegram Bot with DB to keep track of events in your WooCommerce store using Netlify Functions and FaunaDB

[![Netlify Status](https://api.netlify.com/api/v1/badges/ed75e298-c088-459c-8e77-fe196eca9dab/deploy-status)](https://app.netlify.com/sites/telegram-woobot/deploys)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/SimonMayerhofer/telegram-woobot)

## Getting Started

* Getting Telegram Bot token and FaunaDB key
* Deploy to Netlify
* Hooking up the Bot

## Getting Telegram Bot token, FaunaDB key & WooCommerce REST API Keys
On Telegram, create a new Telegram bot by talking to [@botfather](https://telegram.me/botfather) and thereafter getting the token for the Telegram Bot.

On the FaunaDB website, create a database and head to the security section to generate a FaunaDB key for the database.

In your store create a new REST API Key in the WC settings and copy the consumer key + consumer secret.

## Deploy to Netlify

Deploy to Netlify either by linking to this repository manually or by clicking the Deploy to netlify.

Thereafter, fill in the environment variables

* `TELEGRAM_BOT_TOKEN`
* `FAUNA_SECRET_KEY`
* `WC_CONSUMER_KEY`
* `WC_CONSUMER_SECRET`
* `WC_SITE_URL`

## Hooking up the Bot

Once the above are done, you need to specify and tell telegram where your bot should direct the messages it received to. Do so by simply visiting this url
```
https://{your_netlify_domain}/api/updateWebhooks
```
This will notify telegram and updates the webhook. It also creates or updates the necessary webhooks in your shop.

If you want to update the webhooks after a successful deploy automatically, go to your Netlify site settings > Build & deploy and create a new 'Outgoing webhook' notification. Select 'Deploy succeeded' and enter the URL to your `updateWebhooks` function.

Afterwhich, YOU ARE DONE!🎉🎉

Try typing ```/start``` to your bot and see if it works. If everything worked, it'll greet you and tell you that you as the first user are the administrator.

## Set bot command list

If you want to set the command list write `/setcommands` to the bot father and send him this list:
````
start - Start the bot
chatid - Display current chat id
enablenotifications - Enable shop notifications for current chat
disablenotifications - Disable shop notifications for current chat
````

## Available bot commands

* `/start` : Add own user to the database. If first user, role is set to administrator.
* `/chatId` : Print chat ID of current chat.
* `/enableNotifications` : Enable WooCommerce notification (e.g. new orders) for current chat.
* `/disableNotifications` : Disable WooCommerce notification for current chat.

## Extending Telegram Bot Functionality

This bot uses telegraf.js for its Telegram Bot functionality. Head to its [website](https://telegraf.js.org/#/) to find out how to extend the functionality of the bot you have created :)

## Local Development

To locally test and develop the bot follow these steps:

1. Create a new Telegram Bot and a new FaunaDB database for testing.
2. Create `.env` file and enter your bot token + secret key:
   ```
   TELEGRAM_BOT_TOKEN=your_dev_bot_token
   FAUNA_SECRET_KEY=your_dev_secret_key
   WC_CONSUMER_KEY=your_dev_consumer_key
   WC_CONSUMER_SECRET=your_dev_consumer_secret
   WC_SITE_URL=https://www.example.com
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

## Troubleshooting

* "*unable to verify the first certificate*": If you get this message during local development because you're working with a local web-server add `NODE_TLS_REJECT_UNAUTHORIZED=0` to your `.env` file. **Important:** only do this with local web-servers while developing. If you get this message for your production server you have a problem with your SSL certificate. [More Informations](https://stackoverflow.com/q/31673587/2180161).
* If you get 401 errors even though your consumer key secret and everything is properly configured, there is a chance your site is not passing through the authentication headers to PHP in CGI mode. This can be fixed e.g. by adding the following line to the top of your `.htaccess`: `SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1`.
