const mongoose = require("mongoose");

const MongoURI = process.env.MONGO_URI;

const connect = () => {
  if (!MongoURI) {
    throw new Error("MONGO_URI is not set. Copy .env.example to .env and fill it in.");
  }

  mongoose
    .connect(MongoURI)
    .then(() => console.log("Connected to mongo successfully"))
    .catch((err) => console.error("Failed to connect to mongo:", err.message));
};

module.exports = connect;
