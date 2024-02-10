const express = require("express");
const {deleteItem, addPurchase} = require("../data/data");
const {returnUserByLogin, returnModifyingListOfUsers, deleteItemFromCartById, deleteUserById} = require("../data/users");
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
        const login = req.session.username;
        const response = deleteItemFromCartById(id, login);
        res.status(200).send(response);

    })
    .delete("/user/pay/cart", (req, res) =>{//оплатить товар в корзине
        const id = req.query.id;
        const login = req.session.username;
        const name = returnUserByLogin(req.session.username).cart_items[id];
        deleteItemFromCartById(id, login);
        addPurchase(name, login);
        res.status(200).send("Поздравляем с покупкой!");

    })
    .delete("/delete/item", (req, res) =>{//удалить товар
        const id = +req.query.id;
        const response = deleteItem(returnUserByLogin(req.session.username).items[id], req.session.username);
        res.status(200).send(response);
      });
      
module.exports = router;