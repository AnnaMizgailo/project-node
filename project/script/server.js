const path = require("path");
const express = require("express");
const formidable = require("formidable")
const {addReview, addRating, getListOfItemsBySubname, returnListOfFilteredItems, addPurchase, deleteItemFromCartById, returnListOfItems, addNewUser, checkUser, addNewItem, returnModifyingListOfUsers, deleteUserById, banUser, unbanUser, addItemToCartById, returnListOfObjectsByNames} = require("./data/data");

const app = express();

app.use(express.json());

app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

let currentUser;
let items = returnListOfItems();
    

app
    .get("/", (_, res) =>{
        res.render("items.hbs", {items: items, currentUser});
    })
    .post("/user/sign-up", (req, res) =>{
        let user = {};
        let form = new formidable.IncomingForm({
            multiples: true,
            keepExtensions: true,
            maxFileSize: 1 * 1024 * 1024,
            uploadDir: "./public/uploads",
            allowEmptyFiles: true,
            minFileSize: 0
          });

          form.on("fileBegin", (_, file) => {
            file.filepath = path.join(form.uploadDir, file.originalFilename);
          });
          form.parse(req, (err, fields, files) => {
            if (err) {
              res.status(400).send(err);
              return;
            }
            if (files && fields) {
              user = {
                login: fields.login[0],
                password: fields.password[0],
                role: fields.role[0],
                image: files.avatarImgName[0].originalFilename | "",
              };
            }
            const ans = addNewUser(user);
            if(ans != "Аккаунт создан!"){
                res.status(500).send(ans);
                return;
            }
            currentUser = user;
            res.status(200).send("ok");
          });
          
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
        let item = {};
        let form = new formidable.IncomingForm({
            multiples: true,
            keepExtensions: true,
            maxFileSize: 1 * 1024 * 1024,
            uploadDir: "./public/uploads",
          });

          form.on("fileBegin", (_, file) => {
            file.filepath = path.join(form.uploadDir, file.originalFilename);
          });
          form.parse(req, (err, fields, files) => {
            if (err) {
              res.status(400).send(err);
              return;
            }
            if (files && fields) {
              item = {
                name: fields.name[0],
                price: fields.price[0],
                category: fields.category[0],
                image: files.itemImgName[0].originalFilename,
              };
            }
            item.retailer = currentUser.login;
            const response = addNewItem(item);
            if(response !== "Товар добавлен!"){
                res.status(500).send(response);
                return;
            }
            items = returnListOfItems();
            res.status(200).send(response);
          });
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
        items = getListOfItemsBySubname(searchBar);
        res.render("items.hbs", {items: items, currentUser});
    })
    .get("/customer/purchases", (_, res) =>{
      let purchases = returnListOfObjectsByNames(currentUser.items);
      res.status(200).render("purchases.hbs", {items: purchases});
    })
    .put("/item/add/review", (req, res)=>{
      const reviewInfo = req.body;
      const id = reviewInfo.id;
      const review = reviewInfo.review;
      console.log(reviewInfo);
      if(!addReview(items[id].itemName, review)){
        res.status(404).send("Введите отзыв!");
        return;
      }
      res.status(200).send("Отзыв добавлен!");
    })
    .put("/item/set/rating", (req, res) =>{
      const id = req.body.id;
      addRating(items[id].itemName);
      res.status(200).send("Мы рады, что вам понравился товар!");
    })
    .use((_, res)=>{
        res.status(404).send("<h1>Not found</h1>");
    })
    .listen(3000, ()=>{
        console.log("Слушаем порт 3000");
    });