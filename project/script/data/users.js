const path = require("path");
const fs = require("fs");
let dataFromUsers = fs.readFileSync(path.join(__dirname, "./users.json"),{encoding: "utf-8"});
//парсим инфу из json для товаров и юзеров
let users = {
    ...JSON.parse(dataFromUsers)
};

function restoreJson(){ //для обновления данных о пользователе в процессе сессии
    fs.writeFileSync(path.join(__dirname, "./users.json"), JSON.stringify(users), {encoding: "utf-8"});
}
function ifItemInArray(array, name){//а этот элемент есть в массиве?
    for(let i = 0; i < array.length; i++){
        if(array[i] == name){
            return true;
        }
    }
    return false;
}
function returnUserByLogin(login){
    return users[login];
}
function returnModifyingListOfUsers(){//списочек юзеров для админа на мониторинг
    const keys = Object.keys(users);
    listOfUsers = [];
    let id = 0;
    for(const key of keys){
        if(users[key].role !== "moderator"){ //проверка на модератора, потому что модератор не может забанить модератора!!!
            const itemObj = {
                id: id++,
                login: key,
                image: users[key].image,
                role: users[key].role, 
                banned: users[key].banned
            };
            if(users[key].role == "retailer"){
                itemObj.numOfComplains = users[key].numOfComplains;
            }
            listOfUsers.push(itemObj);
        }
    }
    return listOfUsers;
}
function ifUserExists(login){//а ты вообще есть?
    const keys = Object.keys(users);
    for (const key of keys){
        if(key == login){
            return true;
        }
    }
    return false;
}

function addNewUser(obj){//добавление нового юзера
    const {login, password, role, image} = obj;
    if(!ifUserExists(login)){
        if(login && password && role){
            users[login] = {
                password: password,
                role: role,
                banned: false
            };
            if(role == "moderator"){
                users[login].moderate = true; //.moderate для модератора, чтобы было удобнее с hbs
            }else if(role == "retailer"){
                users[login].retail = true; //.retail для продавца просто потому что для hbs 
                users[login].items = [];
                users[login].numOfComplains = 0;
            }else{
                users[login].shop = true; //.shop для покупателя для hbs
                users[login].cart_items = [];
                users[login].items = [];
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
function checkUser(login, password){ //проверяем пользователя при авторизации
    if(ifUserExists(login)){
        if(users[login].banned == true){
            return false;
        }
        if(password == users[login].password){
            return {login: login, ...users[login]};
        }
    }
    return false;
}

function deleteUserById(id, array){//удаляем юзера по айдишнику
    const name = array[id].login;
    delete users[name];
    restoreJson();
}
function banUser(id, array){//забанить юзера
    const name = array[id].login;
    users[name].banned = true;
    restoreJson();
}
function unbanUser(id, array){//разбанить 
    const name = array[id].login;
    users[name].banned = false;
    restoreJson();
}
function complainOnRetailer(name){//пожаловаться на недобросовестного продавца:(
    users[name].numOfComplains += 1;
    restoreJson();
    return "Жалоба отправлена!";
}
function deleteItemFromCartById(id, login){//удаляем по айдишнику товар из корзины
    users[login].cart_items.splice(id, 1);
    restoreJson();
    return "Товар удален из корзины!";
}

function addItemToCartById(id, array, login){//добавляем по айдишнику товар в корзину
    if(users[login].role == "customer"){
        const item = array[id].itemName;
        if(ifItemInArray(users[login].cart_items, item)){
            return "Товар уже в корзине!";
        }
        users[login].cart_items.push(item);
        restoreJson();
        return "Товар успешно добавлен!";
    }
    return "Вы не являетесь покупателем!";
    
}
module.exports = {returnUserByLogin, users, returnModifyingListOfUsers, addNewUser, checkUser, addItemToCartById, deleteItemFromCartById, complainOnRetailer, deleteUserById, banUser, unbanUser};