const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;
const notifier = require("mail-notifier");
const { nanoid } = require("nanoid");
const https = require("https");
const userMail = "evgene.fe@gmail.com";
const mailPass = "Evgen206774999";
const token = "2088050898:AAEhUpYW8covVpjktBSVMFeBbAc8qnsA400";
const idBot = "98887119";
const imap = {
    user: userMail,
    password: mailPass,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
};

app.get('/', (req, res) => {
    res.end('<h1>Hello Word</h1>')
    notifier(imap)
        .on("mail", (mail) => {
            let mails = new Mail(mail.headers.from, mail.date, mail.text);
            sendBotMessage(token, idBot, mails);
        })
        .start();
})

app.listen(PORT, () => {
    console.log("Server has been started...");

    // notifier(imap)
    //     .on("mail", (mail) => {
    //         let mails = new Mail(mail.headers.from, mail.date, mail.text);
    //         sendBotMessage(token, idBot, mails);
    //     })
    //     .start();
});

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
