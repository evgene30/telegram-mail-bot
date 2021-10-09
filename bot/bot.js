require("dotenv").config();
const {Telegraf, Markup} = require("telegraf");
const bot = new Telegraf(process.env.tokenBot);



module.exports = function botControl() {
    bot.start((ctx) =>
        ctx.reply(
            `Привет ${
                ctx.message.from.first_name
                    ? ctx.message.from.first_name
                    : "аноним"
            }! 👍`
        )
    );
    bot.help((ctx) => ctx.reply("hello"));
    // bot.on("sticker", (ctx) => ctx.reply("👍"));
    // bot.hears("@mail", (ctx) => ctx.reply("I send your mail..."));
    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

