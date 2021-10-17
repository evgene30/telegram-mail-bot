const botControl = require("./bot/bot");
const startGetMail = require("./getmail/getmail");
const express = require("express");
const app = express();
const DATA = require("./data/db.json")

app.set("port", process.env.PORT || 5000);

app.get("/", function (request, response) {
    botControl(); // bot control
    response.send(DATA); // response JSON
}).listen(app.get("port"), function () {
    console.log(
        "App is running, server is listening on port ",
        app.get("port")
    );
});
