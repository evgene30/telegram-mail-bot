const usersJSON = require("../data/users.json");

module.exports = registerUser = (userId) => {
    return usersJSON.filter(item => item.id === userId).join('');
};
