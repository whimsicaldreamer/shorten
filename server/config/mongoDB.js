const mongoose = require("mongoose");
const config = require("./env");

mongoose.connect(config.mongoUri, { useNewUrlParser: true }, (err) => {
    if (err) {
        throw err
    } else {
        console.log("MongoDb connected...");
    }
});

module.exports = mongoose;