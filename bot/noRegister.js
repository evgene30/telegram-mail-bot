const {Markup} = require("telegraf");

module.exports = function registerNo(ctx) {
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


