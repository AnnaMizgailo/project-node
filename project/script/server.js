const path = require("path");
const express = require("express");
const {getListOfItemsBySubname, returnListOfFilteredItems, addPurchase, deleteItemFromCartById, returnListOfItems, addNewUser, checkUser, addNewItem, returnModifyingListOfUsers, deleteUserById, banUser, unbanUser, addItemToCartById, returnListOfObjectsByNames} = require("./data/data");

const app = express();

app.use(express.json());

//искать комменты по сделанному в этом скрипте, а также в data.js, cart.hbs и index.html


app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

let currentUser;
let items = returnListOfItems();

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
        res.status(200).render("items.hbs", {items: items, currentUser});
    })
    .get("/user/sign-in", (req, res) =>{
        const login = req.query.login;
        const password = req.query.password;
        const user = checkUser(login, password);
        if(!user){
            res.status(500).send("Пользователь не найден либо забанен");
            return;
        }
        currentUser = user;
        res.status(200).render("items.hbs", {items: items, currentUser});
    })
    .get("/user/personal-cabinet", (_, res) =>{
        res.render("personal-info.hbs", {currentUser});
    })
    .post("/retailer/add/item", (req, res) =>{
        let item = req.body;
        item.retailer = currentUser.login;
        const response = addNewItem(item);
        if(response !== "Товар добавлен!"){
            res.status(500).send(response);
            return;
        }
        items = returnListOfItems();
        res.status(200).send(response);
    })
    .get("/user/moderate", (_, res) =>{
        let users = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {users: users});
    })
    .delete("/user/moderate/delete", (req, res) =>{
        const id = req.query.id;
        const array = returnModifyingListOfUsers();
        deleteUserById(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })
    .put("/user/moderate/ban", (req, res)=>{
        const id = req.body.id;
        const array = returnModifyingListOfUsers();
        banUser(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })
    .put("/user/moderate/unban", (req, res)=>{
        const id = req.body.id;
        const array = returnModifyingListOfUsers();
        unbanUser(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })
    .post("/user/add/cart", (req, res)=>{
        const id = req.body.id;
        const arrayOfItems = returnListOfItems();
        const login = currentUser.login;
        const response = addItemToCartById(id, arrayOfItems, login);
        res.status(200).send(response);
    })
    .get("/user/cart", (_, res)=>{
        if(!currentUser || currentUser.role !== "customer"){
            res.status(200).send("Вам туда не надо :)");
        }
        let cart_items = returnListOfObjectsByNames(currentUser.cart_items);
        res.status(200).render("cart.hbs", {cart_items: cart_items});
    })
    .delete("/user/delete/cart", (req, res) =>{
        const id = req.query.id;
        const login = currentUser.login;
        const response = deleteItemFromCartById(id, login);
        res.status(200).send(response);

    })
    .delete("/user/pay/cart", (req, res) =>{
        const id = req.query.id;
        const login = currentUser.login;
        const name = currentUser.cart_items[id];
        deleteItemFromCartById(id, login);
        addPurchase(name, login);
        res.status(200).send("Поздравляем с покупкой!");

    })
    .get("/filter", (req, res)=>{
        const category = req.query.category;
        items = returnListOfFilteredItems(category);
        res.render("items.hbs", {items: items, currentUser});
    })
    .get("/search", (req, res)=>{
        const searchBar = req.query.str;
        let items = getListOfItemsBySubname(searchBar);
        res.render("items.hbs", {items: items, currentUser});
    })
    .use((_, res)=>{
        res.status(404).send("<h1>Not found</h1>");
    })
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });