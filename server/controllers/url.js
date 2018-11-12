const isURL     = require("is-url");
const Keys      = require("../models/keys");
const Urls      = require("../models/urls");

const domain    = "localhost:3001/";

const url = {
    shorten: async (req, res) => {
        const longUrl   = req.body.longUrl ? (req.body.longUrl).trim() : ""; // Original URL
        const alias     = req.body.alias ? (req.body.alias).trim() : ""; // Custom short key a.k.a alias
        const apiKey    = req.body.apiKey; // Unique API key for registered users

        if(isURL(longUrl)) {
            if(apiKey) { // ToDo Validate API key
                /**
                 * Registered users
                 * - Unique key each time
                 * - Custom alias option
                 */
                if(alias) { // When alias parameter is enabled
                    if(isUrlSafe(alias)) { // Check if the alias is URL safe
                        saveUrl(res, longUrl, alias);
                    }
                    else {
                        return res.status(400).send({status: "INVALID_ALIAS"});
                    }
                }
                else {
                    let newShortCode = await getShortCode(res);
                    saveUrl(res, longUrl, newShortCode);
                }
            }
            else {
                /**
                 * Site visitors
                 * - Get keys generated by other non-registered users if available else generate new key
                 * - No custom alias
                 */
                let existingKey = await getExistingKey(longUrl);

                if(existingKey.length > 0) {
                    let keyObj = existingKey[0];

                    // Return the existing short URL
                    return res.status(200).send({
                        shortUrl: `${domain}${keyObj.shortCode}`,
                        longUrl: keyObj.longUrl,
                        status: "SUCCESS"
                    });
                }
                else {
                    // Generate a new short URL
                    let newShortCode = await getShortCode(res);
                    saveUrl(res, longUrl, newShortCode);
                }
            }
        }
        else {
            return res.status(400).send({status: "INVALID_URL"});
        }
    },
    redirect: async (req, res) => {
        const shortCode = req.params.id;

        if(!isUrlSafe(shortCode)) {
            // Redirect to 404
            return res.status(404).redirect("/");
        }

        try {
            let url = await Urls.findOne({shortCode: shortCode});

            if(!url) {
                // Redirect to 404
                return res.status(404).end();
            }
            // Redirect to original URL
            res.redirect(url.longUrl);
        }
        catch(error) {
            console.log(error);
            return res.status(500).send({ status: "FAILED" });
        }
    }
};


/**
 * Function to save the new shortened URL
 * @param res
 * @param longUrl
 * @param shortCode
 * @returns {Promise<*|void>}
 */
async function saveUrl(res, longUrl, shortCode) {
    const shortUrl = `${domain}${shortCode}`;

    const url = new Urls({
        shortCode: shortCode,
        longUrl: longUrl
    });

    try {
        let newURL = await url.save();

        return res.status(200).send({
            shortUrl: shortUrl,
            longUrl: newURL.longUrl,
            status: "SUCCESS"
        });
    }
    catch (error) {
        console.log(error);
        if(error.name === "MongoError" && error.code === 11000) {
            return res.status(400).send({status: "DUPLICATE"});
        }
        return res.status(500).send({status: "FAILED"});
    }
}

/**
 * Function to test if the custom alias is URL safe
 * @param shortCode
 * @returns {boolean}
 */
function isUrlSafe(shortCode) {
    const charSet = /^[a-zA-Z0-9_-]*$/;
    return charSet.test(shortCode);
}

/**
 * Function to get unique short codes
 * from Keys table/Collection
 * @param res
 * @returns {Promise<*>}
 */
async function getShortCode(res) {
    try {
        let shortCode = await Keys.findOneAndUpdate({isUsed: false}, {isUsed: true});

        if(!shortCode) { // When available keys run out
            return res.status(500).send({status: "FAILED"});
        }
        return shortCode.key;
    }
    catch (error) {
        console.log(error);
        return res.status(500).send({status: "FAILED"});
    }
}

/**
 * Function to randomly get existing URL data for non-registered users
 * @param longURL
 * @returns {Promise<*>}
 */
async function getExistingKey(longURL) {
    try {
        return await Urls.aggregate([
            {
                $match: {
                    longUrl: longURL,
                }
            },
            {
                $sample: {size: 1}
            }
        ]);
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = url;