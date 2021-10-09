const { Telegraf, Markup } = require("telegraf");
const notifier = require("mail-notifier");
const { nanoid } = require("nanoid");
const https = require("https");
const { text } = require("telegraf/typings/button");
const dataUser = {
    mail: "evgene.fe@gmail.com",
    pass: "difzrofpmtkenuaq",
    tokenBot: "2088050898:AAEhUpYW8covVpjktBSVMFeBbAc8qnsA400",
    idBot: "98887119",
};
const bot = new Telegraf(dataUser.tokenBot);
const imap = {
    user: dataUser.mail,
    password: dataUser.pass,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
};

startGetMail(); // получать письма из почты (автоматически)
botControl(); // управление ботом

function startGetMail() {
    const n = notifier(imap);
    n.on("end", () => n.start()) // session closed
        .on("mail", (mail) => {
            let mails = new Mail(mail.headers.from, mail.date, mail.text);
            sendBotMessage(dataUser.tokenBot, dataUser.idBot, mails);
        })
        .start();
}

function botControl() {
    bot.start((ctx) =>
        ctx.reply(
            `Привет ${
                ctx.message.from.first_name
                    ? ctx.message.from.first_name
                    : "аноним"
            }! 👍`
        )
    );
    bot.help((ctx) => ctx.reply(text.comands));
    // bot.on("sticker", (ctx) => ctx.reply("👍"));
    // bot.hears("@mail", (ctx) => ctx.reply("I send your mail..."));
    bot.launch();
    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

function sendBotMessage(token, id, message) {
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${message.headers}, ${message.date}, ${message.text}`;
    https.get(url);
}

class Mail {
    constructor(headers, date, text) {
        this.id = nanoid();
        this.headers = headers;
        this.date = date.toLocaleString();
        this.text = text
            .replace(/\r?\n|\r/g, " ")
            .replace(/[-]/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }
}
