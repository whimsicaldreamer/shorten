const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const mongoDb = require("./config/mongoDB");
const port = process.env.PORT || 3001;

// Controllers
const urlController = require("./controllers/url");

// Parsers
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// APIs
app.post("/api/url", urlController.shorten);
app.get("/api/:id", urlController.redirect);

app.get('*', (req, res) => {
    return res.status(404).send({ status: "NOT_FOUND" });
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}...`));