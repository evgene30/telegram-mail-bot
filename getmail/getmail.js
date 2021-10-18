require("dotenv").config();
const notifier = require("mail-notifier");
const {nanoid} = require("nanoid");
const https = require("https");
const imap = {
    user: process.env.mail,
    password: process.env.pass,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {rejectUnauthorized: false},
};

module.exports = function startGetMail() {
    const n = notifier(imap);
    n.on("end", () => n.start()) // session closed
        .on("mail", (mail) => {
            let mails = new Mail(mail.headers.from, mail.date, mail.text);
            sendBotMessage(process.env.tokenBot, process.env.idBot, mails);
        })
        .start();
};

function sendBotMessage(token, id, message) {
    let url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${message.headers}, ${message.date}, ${message.text}`;
    try {
        https.get(url);
    } catch (e) {
        console.error(e);
    }
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
