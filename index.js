const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const { Telegraf } = require("telegraf");
const notifier = require("mail-notifier");
const { nanoid } = require("nanoid");
const https = require("https");
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

app.listen(PORT, () => {
    console.log("Server has been started...");
    startGetMail();
    botControl();
});

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
    bot.start((ctx) => ctx.reply("Welcome"));
    bot.help((ctx) => ctx.reply("Send me a sticker"));
    bot.on("sticker", (ctx) => ctx.reply("👍"));
    bot.hears("@mail", (ctx) => ctx.reply("I send your mail..."));
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
