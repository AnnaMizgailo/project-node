const express = require("express");
const {deleteItem, listOfRetailersItems, addPurchase, returnListOfObjectsByNames} = require("../data/data");
const {returnModifyingListOfUsers, addNewUser, checkUser, addItemToCartById, deleteItemFromCartById, complainOnRetailer, deleteUserById, banUser, unbanUser} = require("../data/users");
const {returnListOfItems, returnListOfPurchases, addReview, changeItem, returnReviews, deleteRating, addRating, getListOfItemsBySubname, returnListOfFilteredItems, addNewItem} = require("../data/items");

const router = express.Router();


let currentUser;
let items = returnListOfItems();

router
    .get("/", (_, res) =>{

        res.render("items.hbs", {items: items, currentUser});
    })
    .get("/user/sign-in", (req, res) =>{//войти в аккаунт
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
    .get("/user/personal-cabinet", (_, res) =>{//открывает страницу с личным кабинетом
        res.render("personal-info.hbs", {currentUser});
    })
    .get("/user/moderate", (_, res) =>{//открывает страницу с списком юзеров
        let users = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {users: users});
    })
    .get("/user/cart", (_, res)=>{//открыть вкладку с корзиной
        if(!currentUser || currentUser.role !== "customer"){
            res.status(500).send("Вам туда не надо :)");
        }
        const cart_items = returnListOfObjectsByNames(currentUser.cart_items);
        res.status(200).render("cart.hbs", {cart_items: cart_items});
    })
    .get("/filter", (req, res)=>{//фильтр
        const category = req.query.category;
        items = returnListOfFilteredItems(category);
        res.render("items.hbs", {items: items, currentUser});
    })
    .get("/search", (req, res)=>{//поиск товара
        const searchBar = req.query.str;
        items = getListOfItemsBySubname(searchBar);
        res.render("items.hbs", {items: items, currentUser});
    })
    .get("/customer/purchases", (_, res) =>{//просто для hbs, отображение покупок
      let purchases = returnListOfPurchases(currentUser.items);
      res.status(200).render("purchases.hbs", {items: purchases});
    })
    .get("/item/show/reviews", (req, res) =>{//показать отзывы на товар
        const id = req.query.id;
        const response = returnReviews(items[id].itemName);
        res.status(200).send(response);
      })
    .get("/item/modify", (_, res) =>{//изменить инфу о товаре
        const retailerItems = listOfRetailersItems(currentUser.login);
        res.status(200).render("put-item.hbs", {items: retailerItems});
      })
    .get("/user/sign-out", (_, res)=>{//выйти из аккаунта
        currentUser = {};
        res.status(200).send("Вы вышли!");
      });

module.exports = router, currentUser;