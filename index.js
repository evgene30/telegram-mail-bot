const http = require("http");
const PORT = 3000;
const DATA = require("./data/db.json")
const botControl = require("./bot/bot");
const startGetMail = require("./getmail/getmail");


const server = http.createServer((req, res) => {
    console.log('Server request');
    console.log(req.url, req.method);
    res.setHeader("Content-Type", "application/json; charset=utf-8");


    botControl(); // bot control
    // startGetMail(); // get mail (env)


    const data = JSON.stringify(DATA);
    res.end(data);

})

server.listen(PORT, 'localhost', (error) => {
    error ? console.log(error) : console.log(`Listening port ${PORT}`)
})

