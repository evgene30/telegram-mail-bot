const express = require('express');
const app = express();
const port = 3000;
const botStart = require("./bot/index_bot");
const startGetMail = require("./getmail/getmail");


app.get('/', (req, res) => {
    res.send('App run...')
})

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`);
    botStart(); // bot control
})





