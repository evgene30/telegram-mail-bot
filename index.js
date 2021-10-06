const notifier = require("mail-notifier");
const {nanoid} = require('nanoid')

const imap = {
    user: "evgene.fe@gmail.com",
    password: "Evgen206774999",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {rejectUnauthorized: false},
};

notifier(imap).on("mail", (mail) => {
    let mails = new Mail(mail.headers.from, mail.date, mail.text);
    console.log(mails)
}).start();


class Mail {
    constructor(headers, date, text) {
        this.id = nanoid();
        this.headers = headers;
        this.date = date.toLocaleString();
        this.text = text.replace(/\r?\n|\r/g, " ").replace(/[-]/g, '').replace(/\s+/g, " ").trim();
    }
}




