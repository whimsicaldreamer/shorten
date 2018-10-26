const isURL     = require("is-url");
const Keys      = require("../models/keys");
const Urls      = require("../models/urls");

const url = {
    shorten: (req, res) => {
        const longUrl = req.body.longUrl ? (req.body.longUrl).trim() : "";
        const alias = req.body.alias ? (req.body.alias).trim() : "";

        if(isURL(longUrl)) {
            if(!alias) {
                Keys.findOneAndUpdate({isUsed: false}, {isUsed: true})
                    .then(response => {
                        const shortCode = response.key;
                        saveUrl(shortCode, longUrl, res);
                    })
                    .catch(error => {
                        console.log(error);
                        return res.status(500).send({status: "FAILED"});
                    })
            }
            else {
                if(isUrlSafe(alias)) {
                    saveUrl(alias, longUrl, res);
                }
                else {
                    return res.status(400).send({status: "INVALID_ALIAS"});
                }
            }
        }
        else {
            return res.status(400).send({status: "INVALID_URL"});
        }
    },
    redirect: (req, res) => {
        const shortCode = req.params.id;

        if(!isUrlSafe(shortCode)) {
            // Redirect to 404
            return res.status(404).redirect("/");
        }

        Urls.findOne({shortCode: shortCode})
            .then(response => {
                if(response) {
                    // Redirect to original URL
                    res.redirect(response.longUrl);
                }
                else {
                    // Redirect to 404
                    return res.status(404).end();
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(500).send({ status: "FAILED" });
            })
    }
};


function saveUrl(shortCode, longUrl, res) {
    const shortUrl = `localhost:3001/${shortCode}`;

    const newURL = new Urls({
        shortCode: shortCode,
        longUrl: longUrl
    });
    newURL.save()
        .then(() => {
            return res.status(200).send({
                shortUrl: shortUrl,
                longUrl: longUrl,
                status: "SUCCESS"
            });
        })
        .catch(error => {
            console.log(error);
            if(error.name === "MongoError" && error.code === 11000) {
                return res.status(400).send({status: "DUPLICATE"});
            }
            return res.status(500).send({status: "FAILED"});
        })
}

function isUrlSafe(shortCode) {
    const charSet = /^[a-zA-Z0-9_-]*$/;
    return charSet.test(shortCode);
}

module.exports = url;