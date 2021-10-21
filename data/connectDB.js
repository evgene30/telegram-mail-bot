const {MongoClient} = require("mongodb");
const fs = require('fs');
require("dotenv").config();
const uri =
    `mongodb+srv://admin:${process.env.DATA_ADMINPASS}@cluster1.ov6cn.mongodb.net/telegramDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connectDB = {
    getUsers: () =>
        client.connect(async (err) => {
            try {
                const collection = await client
                    .db("telegramDB")
                    .collection("users");
                const users = await collection.find({}).toArray();
                const data = JSON.stringify(users);
                fs.writeFileSync("./data/users.json", data);
                await client.close();
            } catch (err) {
                console.log(err);
            }
        }),

    setUsers: (object) =>
        client.connect(async (err) => {
            try {
                const collection = await client
                    .db("telegramDB")
                    .collection("users");
                await collection.insertOne(object);
                await client.close();
            } catch (err) {
                console.log(err);
            }
        }),

    deleteUser: (object_id) =>
        client.connect(async (err) => {
            try {
                const collection = await client
                    .db("telegramDB")
                    .collection("users");
                await collection.deleteOne(object_id);
                await client.close();
            } catch (err) {
                console.log(err);
            }
        }),
};

module.exports = connectDB;

// connectDB.deleteUser({id:"3422424"})
// connectDB.getUsers()
















