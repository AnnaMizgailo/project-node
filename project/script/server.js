const path = require("path");
const express = require("express");
const handler = require("./routes/index");
const {authInit} = require("./middleware/session");

const app = express();
app.use(express.json());

    

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));


app    
    .use(authInit())
    .use(handler)
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });