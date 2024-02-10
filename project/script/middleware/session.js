const session = require("express-session");
const crypto = require("crypto");

const authInit = () => 
    session({
        secret: crypto.randomBytes(32).toString("hex"),
        resave: false,
        saveUninitialized: true
    });

module.exports = {authInit};