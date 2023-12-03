const path = require("path");
const express = require("express");
const {returnListOfItems, addNewUser, checkUser} = require("./data/data");

const app = express();

app.use(express.json());


app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

let currentUser;
const items = returnListOfItems();

app
    .get("/", (_, res) =>{
        res.render("items.hbs", {items: items, currentUser});
    })
    .post("/user/sign-up", (req, res) =>{
        const user = req.body;
        const ans = addNewUser(user);
        if(ans != "Аккаунт создан!"){
            res.status(500).send(ans);
            return;
        }
        currentUser = req.body;
        authorized = true;
        res.status(200).render("items.hbs", {items: items, currentUser});
    })
    .get("/user/sign-in", (req, res) =>{
        const login = req.query.login;
        const password = req.query.password;
        const user = checkUser(login, password);
        if(!user){
            res.status(500).send("Пользователь не найден");
            return;
        }
        currentUser = user;
        authorized = true;
        res.status(200).render("items.hbs", {items: items, currentUser});
    })
    .get("/user/personal-cabinet", (_, res) =>{
        res.render("personal-info.hbs", {currentUser});
    })
    .use((_, res)=>{
        res.status(404).send("<h1>Not found</h1>");
    })
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });