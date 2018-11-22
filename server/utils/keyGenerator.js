/**
 * A Key Generation Service
 * To keep short keys generated beforehand
 * Can approximately generate 164900000(160 million) unique 6 character codes in each run
 */

console.log("KEY GENERATION SERVICE STARTING...");

const config    = require("../config/env");
const mongoDb   = require("../config/mongoDB");
const Keys      = require("../models/keys");
const Hashids   = require("hashids");
const shortid   = require("shortid");

const saltPadding   = shortid.generate();
const time          = new Date().getTime();
const hashids       = new Hashids(`${time}${config.KGSsalt}${saltPadding}`, 6);

const nKeys         = 50; //Number of keys to generate
let keySet          = [];
let counter         = 1;

while(keySet.length < nKeys) {
    let keyObj = {key: hashids.encode(counter)};

    if(!contains(keySet, keyObj.key)) {
        keySet.push(keyObj);
    }
    counter++;
}

Keys.insertMany(
    keySet,
    {
        ordered: false
    })
    .then(() => {
        console.log(`${keySet.length} Keys generated.`);
        mongoDb.connection.close();
    })
    .catch(error => {
        console.log(error);
        mongoDb.connection.close();
    });


function contains(arr, key) {
    return arr.filter(function (obj) {
        return obj.key === key;
    }).length >= 1;
}