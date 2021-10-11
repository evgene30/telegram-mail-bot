const botControl = require("./bot/bot");
const startGetMail = require("./getmail/getmail");

botControl(); // bot control
startGetMail(); // get mail (env)
