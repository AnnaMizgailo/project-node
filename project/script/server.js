const path = require("path");
const express = require("express");
const {returnListOfItems} = require("./data/data");

const app = express();

app.use(express.json());

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app
    .get("/", (_, res) =>{
        const items = returnListOfItems();
        res.render("items.hbs", {items: items});
    })
    .use((_, res)=>{
        res.status(404).send("<h1>Not found</h1>");
    })
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });