const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoDb = require("./config/mongoDB");
const port = process.env.PORT || 3001;

// Controllers
const urlController = require("./controllers/url");

// Parsers
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// APIs
app.post("/api/url", urlController.shorten);
app.get("/:id", urlController.redirect);


// Start server
app.listen(port, () => console.log(`Server running on port ${port}...`));