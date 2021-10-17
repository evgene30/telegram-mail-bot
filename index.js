const botControl = require("./bot/bot");
const startGetMail = require("./getmail/getmail");
const express = require("express");
const app = express();

app.set("port", process.env.PORT || 5000);


app.get("/", function (request, response) {
    const result = "App is running";
    botControl(); // bot control
    response.send(result);
}).listen(app.get("port"), function () {
    console.log(
        "App is running, server is listening on port ",
        app.get("port")
    );
});
