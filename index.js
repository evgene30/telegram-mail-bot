const http = require("http");
const DATA = require("./data/db.json");
const PORT = 3000;
const botControl = require("./bot/bot");
const startGetMail = require("./getmail/getmail");

const server = http.createServer((req, res) => {
    console.log("Server request");
    console.log(req.url, req.method);
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    const data = JSON.stringify(DATA);
    res.end(data);
});

// botControl(); // bot control

server.listen(PORT, "localhost", (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`);
});
