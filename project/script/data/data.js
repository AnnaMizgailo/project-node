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
function ifExists(login){
    const keys = Object.keys(users);
    for (const key of keys){
        if(key == login){
            return true;
        }
    }
    return false;
}
function addNewUser(obj){
    const {login, password, role, image} = obj;
    if(!ifExists(login)){
        if(login && password && role){
            users[login] = {
                password: password,
                role: role
            };
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
    if(ifExists(login)){
        if(password == users[login].password){
            return {login: login, ...users[login]};
        }
    }
    return false;
}

module.exports = {returnListOfItems, addNewUser, checkUser};