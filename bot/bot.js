require("dotenv").config();
const {Telegraf, Markup} = require("telegraf");
const commands = require("./commands");
const newUser = require("./newUser");
const bot = new Telegraf(process.env.tokenBot);
const connectDB = require("../data/connectDB");
const usersJSON = require("../data/users.json");


const registerUser = (userId) => {
    return usersJSON.filter(item => item.id === userId).join('');
};

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
                            Markup.button.callback("Restart bot", "restart"),
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
                    case "del":
                        if (registerUser(ctx.from.id)) {
                            connectDB.deleteUser({id: ctx.from.id})
                            setTimeout(() => connectDB.getUsers(), 1000)
                            return ctx.reply(`Your deleted!`);
                        }
                        return registerNo(ctx);
                        break;
                    case "reg":
                        if (!registerUser(ctx.from.id)) {
                            const user = new newUser(
                                ctx.from.id,
                                ctx.from.first_name,
                                ctx.from.username
                            );
                            connectDB.setUsers(user);
                            setTimeout(() => connectDB.getUsers(), 1000)
                            return ctx.reply(
                                `Your register! 👍 ${commands.command}`
                            );
                        }
                        return ctx.reply(commands.command);
                        break;
                    case "send":
                        const massiveSendMail = {
                            firm: "",
                            email: "",
                            text: "",
                        };

                        await ctx.reply("Enter firm name:");

                        bot.on("text", async (ctx) => {
                            if (ctx.message.text.length > 3) {
                                massiveSendMail.firm = ctx.message.text;
                            } else {
                                return ctx.reply(
                                    "Error: name less than > 3 characters..."
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

    function registerNo(ctx) {
        try {
            return ctx.replyWithHTML(
                `Hello. Your no register!`,
                Markup.inlineKeyboard([
                    [Markup.button.callback("Register", "reg")],
                ])
            );
        } catch (e) {
            console.error(e);
        }
    }

    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
