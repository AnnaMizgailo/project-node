const express = require("express");
const {listOfRetailersItems, returnListOfObjectsByNames} = require("../data/data");
const {returnUserByLogin, returnModifyingListOfUsers, checkUser} = require("../data/users");
const {returnListOfItems, returnListOfPurchases, returnReviews,  getListOfItemsBySubname, returnListOfFilteredItems} = require("../data/items");

const router = express.Router();
items = returnListOfItems();

router
    .get("/", (req, res) =>{
        res.render("items.hbs", {items: items, currentUser: returnUserByLogin(req.session.username)});
    })
    .get("/user/sign-in", (req, res) =>{//войти в аккаунт
        const login = req.query.login;
        const password = req.query.password;
        const user = checkUser(login, password);
        if(!user){
            res.status(500).send("Пользователь не найден либо забанен");
            return;
        }
        req.session.auth = true;
        req.session.username = user.login;
        res.status(200).render("items.hbs", {items: returnListOfItems(), user});
    })
    .get("/user/personal-cabinet", (req, res) =>{//открывает страницу с личным кабинетом
        if(req.session.auth){
            let login = req.session.username;
            res.render("personal-info.hbs", {currentUser: returnUserByLogin(login)});
            return;
        }
        res.render("personal-info.hbs", {});
    })
    .get("/user/moderate", (_, res) =>{//открывает страницу с списком юзеров
        let users = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {users: users});
    })
    .get("/user/cart", (req, res)=>{//открыть вкладку с корзиной
        if(!req.session.auth || returnUserByLogin(req.session.username).role !== "customer"){
            res.status(500).send("Вам туда не надо :)");
            return;
        }
        const cart_items = returnListOfObjectsByNames(returnUserByLogin(req.session.username).cart_items);
        res.status(200).render("cart.hbs", {cart_items: cart_items});
    })
    .get("/filter", (req, res)=>{//фильтр
        const category = req.query.category;
        items = returnListOfFilteredItems(category);
        res.render("items.hbs", {items: items, currentUser: returnUserByLogin(req.session.username)});
    })
    .get("/search", (req, res)=>{//поиск товара
        const searchBar = req.query.str;
        items = getListOfItemsBySubname(searchBar);
        res.render("items.hbs", {items: items, currentUser: returnUserByLogin(req.session.username)});
    })
    .get("/customer/purchases", (req, res) =>{//просто для hbs, отображение покупок
      let purchases = returnListOfPurchases(returnUserByLogin(req.session.username).items);
      res.status(200).render("purchases.hbs", {items: purchases});
    })
    .get("/item/show/reviews", (req, res) =>{//показать отзывы на товар
        const id = req.query.id;
        const response = returnReviews(returnListOfItems()[id].itemName);
        res.status(200).send(response);
      })
    .get("/item/modify", (req, res) =>{//изменить инфу о товаре
        const retailerItems = listOfRetailersItems(req.session.username);
        res.status(200).render("put-item.hbs", {items: retailerItems});
      })
    .get("/user/sign-out", (req, res)=>{//выйти из аккаунта
        req.session.destroy();
        res.status(200).send("Вы вышли!");
      });

module.exports = router;