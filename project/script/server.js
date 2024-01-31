const path = require("path");
const express = require("express");
const handler = require("./routes/index");
const crypto = require("crypto");
const session = require("express-session");

const app = express();
app.use(express.json());

    

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

const authInit = () => 
    session({
        secret: crypto.randomBytes(32).toString("hex"),
        resave: false,
        saveUninitialized: true
    });

app    
    .use(authInit())
    .use(handler)
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });