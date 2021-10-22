require("dotenv").config();
const nodemailer = require("nodemailer");


module.exports = smtpMailServer = (mail) => {
    // блок авторизации пользователя
    const transporter = nodemailer.createTransport({
        service: "gmail", // тип почты (если gmail)
        auth: {
            user: process.env.mail, // адрес почты
            pass: process.env.pass, // пароль от почты
        },
    });
    // блок отправки сообщений
    transporter.sendMail(
        {
            from: `${mail.username} <${process.env.mail}>`, // от кого письмо, подпись отправителя
            to: `${mail.email}`, // адрес куда отправляем
            subject: `${mail.handle}`, // заголовок письма
            html: `${mail.text}`, // текст письма, можно передать как в виде простого текста так форматированного из html тегов (и стилей)
        },
        function (err) {
            if (err) {
                console.log(err && err.stack);
            }
            return console.log("Success!");
        }
    );
};

