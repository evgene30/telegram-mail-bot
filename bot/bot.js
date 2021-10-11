require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const commands = require("./commands");
const bot = new Telegraf(process.env.tokenBot);

module.exports = function botControl() {
    bot.start(async (ctx) => {
        try {
            await ctx.replyWithHTML(
                `Hello <b>${
                    ctx.message.from.first_name
                        ? ctx.message.from.first_name
                        : ctx.message.from.username
                }!</b>  👍 I am your <b>SendMailPost</b>. What are we doing?`,
                Markup.inlineKeyboard([
                    [
                        Markup.button.callback("Restart bot", "restart"),
                        Markup.button.callback("Help commands", "help"),
                    ],
                    [Markup.button.callback("Send email", "send")],
                ])
            );
        } catch (e) {
            console.error(e);
        }
    });

    bot.help((ctx) => ctx.reply(commands.command));

    bot.command("sendmail", async (ctx) => {
        try {
            await ctx.reply(
                "Send new email?",
                Markup.inlineKeyboard([
                    [Markup.button.callback("Send email", "send")],
                ])
            );
        } catch (e) {
            console.error(e);
        }
    });

    actionBot("restart");
    actionBot("help");
    actionBot("send");

    function actionBot(name) {
        bot.action(name, async (ctx) => {
            try {
                await ctx.answerCbQuery();
                switch (name) {
                    case "restart":
                        await ctx.replyWithHTML(
                            `Bot was <b>restarted</b>. What are we doing?`,
                            Markup.inlineKeyboard([
                                [
                                    Markup.button.callback(
                                        "Restart bot",
                                        "restart"
                                    ),
                                    Markup.button.callback(
                                        "Help commands",
                                        "help"
                                    ),
                                ],
                                [Markup.button.callback("Send email", "send")],
                            ])
                        );
                        break;
                    case "help":
                        await ctx.reply(commands.command);
                        break;
                    case "send":
                        const massiveSendMail = { firm: "", email: "" };

                        await ctx.reply("Enter firm name:");
                        bot.on("text", async (ctx) => {
                            if (ctx.message.text.length > 3) {
                                massiveSendMail.firm = ctx.message.text;
                            } else {
                                ctx.reply(
                                    "Error: name less than 3 characters..."
                                );
                            }
                        });

                        break;
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
