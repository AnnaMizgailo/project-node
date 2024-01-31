const express = require("express");
const {deleteItem, listOfRetailersItems, addPurchase, returnListOfObjectsByNames} = require("../data/data");
const {returnModifyingListOfUsers, addNewUser, checkUser, addItemToCartById, deleteItemFromCartById, complainOnRetailer, deleteUserById, banUser, unbanUser} = require("../data/users");
const {returnListOfItems, returnListOfPurchases, addReview, changeItem, returnReviews, deleteRating, addRating, getListOfItemsBySubname, returnListOfFilteredItems, addNewItem} = require("../data/items");
const {currentUser} = require("./get");
const router = express.Router();

router
    .delete("/user/moderate/delete", (req, res) =>{//удалить юзера
        const id = req.query.id;
        const array = returnModifyingListOfUsers();
        deleteUserById(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })
    .delete("/user/delete/cart", (req, res) =>{//удалить товар из корзины
        const id = req.query.id;
        const login = currentUser.login;
        const response = deleteItemFromCartById(id, login);
        res.status(200).send(response);

    })
    .delete("/user/pay/cart", (req, res) =>{//оплатить товар в корзине
        const id = req.query.id;
        const login = currentUser.login;
        const name = currentUser.cart_items[id];
        deleteItemFromCartById(id, login);
        addPurchase(name, login);
        res.status(200).send("Поздравляем с покупкой!");

    })
    .delete("/delete/item", (req, res) =>{//удалить товар
        const id = +req.query.id;
        const response = deleteItem(currentUser.items[id], currentUser.login);
        items = returnListOfItems();
        res.status(200).send(response);
      });
      
module.exports = router;