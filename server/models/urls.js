const mongoose = require("mongoose");

const urlsSchema = mongoose.Schema({
    shortCode: {
        type: String,
        unique: true,
        required: [true, "Short URL is required"]
    },
    longUrl: {
        type: String,
        required: [true, "Long URL is required"]
    },
    created_at: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now
    }
});

module.exports = mongoose.model("Urls", urlsSchema);