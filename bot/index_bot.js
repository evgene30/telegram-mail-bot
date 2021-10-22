require("dotenv").config();
const {Telegraf, Markup} = require("telegraf");
const commands = require("./commands");
const bot = new Telegraf(process.env.tokenBot);
const connectDB = require("../data/connectDB");
const registerNo = require("./noRegister");
const registerUser = require("./validUser");
const newUser = require("./newUser");
const startGetMail = require("../getmail/getmail");
const smtpMailServer = require("../setmail/setMail");
const {rwUsersJSON} = require('../bot/rwUsersJSON');


module.exports = function botControl() {
    console.log("Starting bot...");

    bot.start(async (ctx) => {
        if (registerUser(ctx.message.from.id)) {
            try {
                return await ctx.replyWithHTML(
                    `Hello <b>${
                        ctx.message.from.first_name
                            ? ctx.message.from.first_name
                            : ctx.message.from.username
                    }!</b>  👍 I am your <b>SendMailPost</b>. What are we doing?`,
                    Markup.inlineKeyboard([
                        [
                            Markup.button.callback("Restart index_bot", "restart"),
                            Markup.button.callback("Help commands", "help"),
                            Markup.button.callback("Send email", "send"),
                            Markup.button.callback("Delete User", "del")
                        ],
                    ])
                );
            } catch (e) {
                console.error(e);
            }
        }
        return registerNo(ctx);
    });

    bot.help((ctx) => {
        if (registerUser(ctx.message.from.id)) {
            return ctx.reply(commands.command);
        }
        return registerNo(ctx);
    });

    bot.on("sticker", (ctx) => ctx.reply("Your humor makes me happy 👍"));

    bot.command("sendmail", async (ctx) => {
        if (registerUser(ctx.message.from.id)) {
            try {
                return await ctx.reply(
                    "Send new email?",
                    Markup.inlineKeyboard([
                        [Markup.button.callback("Send email", "send")],
                    ])
                );
            } catch (e) {
                console.error(e);
            }
        }
        return registerNo(ctx);
    });

    actionBot("restart");
    actionBot("help");
    actionBot("send");
    actionBot("reg");
    actionBot("del");

    function actionBot(name) {
        bot.action(name, async (ctx) => {
            try {
                await ctx.answerCbQuery();
                switch (name) {
                    case "restart":
                        if (registerUser(ctx.from.id)) {
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
                        }
                        return registerNo(ctx);
                    case "help":
                        await ctx.reply(commands.command);
                        break;
                    case "del":
                        if (registerUser(ctx.from.id)) {
                            rwUsersJSON([])
                            return ctx.reply(`Your deleted!`);
                        }
                        return registerNo(ctx);
                    case "reg":
                        if (!registerUser(ctx.from.id)) {
                            const user = new newUser(
                                ctx.from.id,
                                ctx.from.first_name,
                                ctx.from.username
                            );
                            connectDB.setUsers(user);
                            rwUsersJSON([user])
                            // startGetMail();
                            return ctx.reply(
                                `Your register! 👍 ${commands.command}`
                            );
                        }
                        return ctx.reply(commands.command);

                    case "send":
                        if (registerUser(ctx.from.id)) {
                            ctx.reply("Enter mail format: заголовок письма | почта на которую отправляем | текст письма. Разделитель '|' - обязательно!");

                            bot.on("text", async (ctx) => {
                                if (ctx.message.text.length > 3) {
                                    const massiveMessage = ctx.message.text.split('|');
                                    const mail = {
                                        username: ctx.from.username,
                                        handle: massiveMessage[0],
                                        email: massiveMessage[1],
                                        text: massiveMessage[2],
                                    };
                                    smtpMailServer(mail);
                                    return setTimeout(() => ctx.reply(`Success! 👍 ${commands.command}`), 1000);
                                } else {
                                    return ctx.reply(
                                        "Error. Format: заголовок письма | почта на которую отправляем | текст письма. Разделитель '|' - обязательно!"
                                    );
                                }
                            });
                        }
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    bot.launch()
    //     .then(() => {
    //     process.once("SIGINT", () => bot.stop("SIGINT"));
    //     process.once("SIGTERM", () => bot.stop("SIGTERM"));
    // })

};

