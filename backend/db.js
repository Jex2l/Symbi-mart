const mongoose = require("mongoose");

const MongoURI = "mongodb+srv://pateljeel3105:WiuNQCCFF3iyJFj0@symbimart.zua6hsz.mongodb.net/?retryWrites=true&w=majority&appName=symbimart";

const connect = () => {
  mongoose.connect(MongoURI, () => {
    console.log("Connected to mongo successfully");
  });
};

if (!connect) {
  console.log("Not connected to mongo");
}

module.exports = connect;