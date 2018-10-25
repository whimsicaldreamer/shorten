const mongoose = require("mongoose");

const keysSchema = mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: [true, "Key is required"]
    },
    isUsed: {
        type: Boolean,
        default: false,
        required: [true, "Taken is required"]
    }
});

module.exports = mongoose.model("Keys", keysSchema);