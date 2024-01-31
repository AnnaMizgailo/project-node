const express = require("express");
const {returnModifyingListOfUsers, addNewUser, checkUser, addItemToCartById, deleteItemFromCartById, complainOnRetailer, deleteUserById, banUser, unbanUser} = require("../data/users");
const {returnListOfItems, returnListOfPurchases, addReview, changeItem, returnReviews, deleteRating, addRating, getListOfItemsBySubname, returnListOfFilteredItems, addNewItem} = require("../data/items");
const {currentUser} = require("./get");
const router = express.Router();

router

    .put("/user/moderate/ban", (req, res)=>{//забанить
        const id = req.body.id;
        const array = returnModifyingListOfUsers();
        banUser(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })
    .put("/user/moderate/unban", (req, res)=>{//отменить бан
        const id = req.body.id;
        const array = returnModifyingListOfUsers();
        unbanUser(id, array);
        const listOfUsers = returnModifyingListOfUsers();
        res.status(200).render("moderate-users.hbs", {listOfUsers: listOfUsers});
    })

    .put("/item/add/review", (req, res)=>{//добавить отзыв на товар
    const reviewInfo = req.body;
    const id = reviewInfo.id;
    const review = reviewInfo.review;
    if(!addReview(currentUser.items[id].name, review, currentUser.login)){
        res.status(404).send("Введите отзыв!");
        return;
    }
    currentUser.items[id].isReviewed = true;
    items = returnListOfItems();
    res.status(200).send("Отзыв добавлен!");
    })
    .put("/item/set/rating", (req, res) =>{//поставить лайк товару
    const id = req.body.id;
    addRating(currentUser.items[id].name);
    currentUser.items[id].isRated = true;
    items = returnListOfItems();
    res.status(200).send("Мы рады, что вам понравился товар!");
    })
    .put("/item/delete/rating", (req, res) =>{//отменить отметку "Нравится"
    const id = req.body.id;
    deleteRating(currentUser.items[id].name);
    currentUser.items[id].isRated = false;
    items = returnListOfItems();
    res.status(200).send("Жалко:(");
    })

    .put("/change/item", (req, res) =>{//изменить данные о товаре
    const id = req.body.id;
    const price = req.body.price;
    const response = changeItem(currentUser.items[id], price);
    items = returnListOfItems();
    res.status(200).send(response);
    })
    .put("/retailer/complain", (req, res)=>{//жалоба на продавца
    const retailer = req.body.retailer;
    const id = req.body.id;
    const response = complainOnRetailer(retailer);
    currentUser.items[id].isComplained = true;
    res.status(200).send(response);
    });
module.exports = router;