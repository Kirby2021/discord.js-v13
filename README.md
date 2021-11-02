# Discord.js v13 with Language system
Yes, this is a Discord.js with a language system. Currently only support 2 languages `(Indonesia & English)`,
but you can add the language anytime/anywhere wherever you want. And its already have a **Set-language** Command,
so if you already have the mongodb uri and want to try to change the language to Indonesia/Language, you can do that! Enjoy!!

# Requirements
- [Node.js ^16.x](https://nodejs.org/en/)

# Adding Language
If you're wondering how to add more language, you can go to [this directory](https://github.com/PaizTralala/discord.js-v13/tree/main/src/Assets/Languages),
edit the `language-meta.json`, Just add like the example of my previous language (English/Indonesia) and you can make a new folder, dont forget to write `-`, because
it searches up the language folder name that includes `-`, 
> If you're still experiencing some trouble/errors related to this repository, you can DM me on Discord Paiz#0617


# Setup
Clone the package:
```
git clone https://github.com/PaizTralala/discord.js-v13
```
You need [git](https://git-scm.com/downloads) installed

To install the package:
```
npm install
```
If you got any `error according to the node fetch`, do
`npm install node-fetch@2.6.1`,
But if you're using ES6, it's fine to not downgrade the version
Because the new version of node-fetch requires ES6

You can find this in `Assets/config.example.json`
Dont forget to change the name to `config.json`
```
{
	"client": {
		"token": "YOUR_BOT_TOKEN",
		"prefix": "YOUR_BOT_PREFIX",
		"owners": ["YOUR_OWNER_ID"]
	},
	"apiToken": {
		"alexFlipNote": "YOU_CAN_GET_IN_https://api.alexflipnote.dev/"
	},
	"defaultPerms": ["SEND_MESSAGES", "VIEW_CHANNEL"],
	"color": {
		"invis": "#2F3136"
	},
	"links": {
		"botInvite": "YOUR_BOT_INVITE_LINK",
		"supportInvite": "YOUR_SUPPORT_SERVER_LINK"
	},
	"database": {
		"mongoURI": "MONGODB_URI"
	}
}
```
If you're done with the `config.json` setup, you can just do `node .`
# Credits
[MenuDocs](https://www.youtube.com/c/MenuDocs) (Handler)
[Spiderjockey02](https://github.com/Spiderjockey02) (Language system)
