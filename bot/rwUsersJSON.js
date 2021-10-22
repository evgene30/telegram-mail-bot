const fs = require("fs");

function rwUsersJSON(data) {
    fs.writeFileSync("./data/users.json", JSON.stringify(data));
}


module.exports = {rwUsersJSON};
