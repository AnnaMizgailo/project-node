const path = require("path");
const express = require("express");
const formidable = require("formidable")
const {addNewItem} = require("../data/data")
const { addNewUser, addItemToCartById} = require("../data/users");
const {returnListOfItems} = require("../data/items");
const router = express.Router();

router
    .post("/user/sign-up", (req, res) =>{//для создания аккаунта
        let user = {};
        let form = new formidable.IncomingForm({//ненавижу формы, но без них не загрузить аватарку! 
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
                image: files.avatarImgName[0].originalFilename
            };
            }
            const ans = addNewUser(user);
            if(ans != "Аккаунт создан!"){
                res.status(500).send(ans);
                return;
            }
            req.session.username = user.login;
            req.session.auth = true;
            
            res.status(200).send("ok");
        });
        
    })
    .post("/retailer/add/item", (req, res) =>{//добавить товар
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
            item.retailer = req.session.username;
            const response = addNewItem(item);
            if(response !== "Товар добавлен!"){
                res.status(500).send(response);
                return;
            }
            res.status(200).send(response);
        });
    })
    .post("/user/add/cart", (req, res)=>{//добавить товар в корзину
        const id = req.body.id;
        const arrayOfItems = returnListOfItems();
        if(!req.session.auth){
          res.status(500).send("Сначала зарегистрируйтесь!");
          return;
        }
        const login = req.session.username;
        const response = addItemToCartById(id, arrayOfItems, login);
        res.status(200).send(response);
    });
module.exports = router;