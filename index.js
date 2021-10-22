const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const botStart = require("./bot/index_bot");
const startGetMail = require("./getmail/getmail");


app.get('/', (req, res) => {
    res.send('App run...')
    botStart(); // bot control
})

app.listen(port, () => {
    console.log(`Server app listening at http://localhost:${port}`);

})





