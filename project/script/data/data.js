const path = require("path");
const fs = require("fs");
let dataFromUsers = fs.readFileSync(path.join(__dirname, "./users.json"),{encoding: "utf-8"});
let dataFromItems = fs.readFileSync(path.join(__dirname, "./items.json"),{encoding: "utf-8"});



let items = {
    ...JSON.parse(dataFromItems)
};
let users = {
    ...JSON.parse(dataFromUsers)
};
function restoreJson(){
    fs.writeFileSync(path.join(__dirname, "./users.json"), JSON.stringify(users), {encoding: "utf-8"});
    fs.writeFileSync(path.join(__dirname, "./items.json"), JSON.stringify(items), {encoding: "utf-8"});
}
function returnListOfItems(){
    const keys = Object.keys(items);
    listOfItems = [];
    for(const key of keys){
        const itemObj = {
            itemName: key,
            itemImg: items[key].img,
            price: +items[key].price,
            retailer: items[key].retailer, 
            rating: +items[key].rating,
            sales: +items[key].sales
        };
        listOfItems.push(itemObj);
    }
    return listOfItems;
}
function returnModifyingListOfUsers(){
    const keys = Object.keys(users);
    listOfUsers = [];
    let id = 0;
    for(const key of keys){
        if(users[key].role !== "moderator"){
            const itemObj = {
                id: ++id,
                login: key,
                image: users[key].image,
                role: users[key].role
            };
            listOfUsers.push(itemObj);
        }
        
    }
    return listOfUsers;
}
function ifUserExists(login){
    const keys = Object.keys(users);
    for (const key of keys){
        if(key == login){
            return true;
        }
    }
    return false;
}
function ifItemExists(name){
    const keys = Object.keys(items);
    for (const key of keys){
        if(key == name){
            return true;
        }
    }
    return false;
}
function addNewUser(obj){
    const {login, password, role, image} = obj;
    if(!ifUserExists(login)){
        if(login && password && role){
            users[login] = {
                password: password,
                role: role
            };
            if(role == "moderator"){
                users[login].moderate = true;
            }else if(role == "retailer"){
                users[login].retail = true;
            }else{
                users[login].shop = true;
            }
        if(image !== ""){
            users[login].image = image;
        }
            restoreJson();
            return "Аккаунт создан!";
        }
        return "Заполните все поля!";
    }
    return "Такой логин уже используется!";
}
function checkUser(login, password){
    if(ifUserExists(login)){
        if(password == users[login].password){
            return {login: login, ...users[login]};
        }
    }
    return false;
}
function addNewItem(obj){
    const {name, price, category, retailer} = obj;
    if(!ifItemExists(name) && name && price && category){
        items[name] = {
            price: +price,
            category: category,
            retailer: retailer,
            sales: 0,
            rating: 0
        };
        restoreJson();
        return "Товар добавлен!";
    }
    return "Произошла ошибка!";
}

module.exports = {returnListOfItems, addNewUser, checkUser, addNewItem, returnModifyingListOfUsers};