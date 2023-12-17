const path = require("path");
const fs = require("fs");
const { ifError } = require("assert");
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
    let id = 0;
    listOfItems = [];
    for(const key of keys){
        const itemObj = {
            id: id++,
            itemName: key,
            itemImg: items[key].image,
            price: +items[key].price,
            retailer: items[key].retailer, 
            rating: +items[key].rating,
            sales: +items[key].sales,
            category: items[key].category,
            reviews: items[key].reviews,
            numOfReviews: items[key].reviews.length
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
                id: id++,
                login: key,
                image: users[key].image,
                role: users[key].role, 
                banned: users[key].banned
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
function ifItemInArray(array, name){
    for(let i = 0; i < array.length; i++){
        if(array[i] == name){
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
                role: role,
                banned: false
            };
            if(role == "moderator"){
                users[login].moderate = true;
            }else if(role == "retailer"){
                users[login].retail = true;
                users[login].items = [];
            }else{
                users[login].shop = true;
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
function checkUser(login, password){
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
function addNewItem(obj){
    const {name, price, category, retailer, image} = obj;
    if(!ifItemExists(name) && name && price && category){
        items[name] = {
            price: +price,
            category: category,
            retailer: retailer,
            sales: 0,
            rating: 0,
            image: image, 
            reviews: []
        };
        users[retailer].items.push(name);
        restoreJson();
        return "Товар добавлен!";
    }
    return "Произошла ошибка!";
}
function deleteUserById(id, array){
    const name = array[id].login;
    delete users[name];
    restoreJson();
}
function banUser(id, array){
    const name = array[id].login;
    users[name].banned = true;
    restoreJson();
}
function unbanUser(id, array){
    const name = array[id].login;
    users[name].banned = false;
    restoreJson();
}
function addItemToCartById(id, array, login){
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
function deleteItemFromCartById(id, login){
    users[login].cart_items.splice(id, 1);
    restoreJson();
    return "Товар удален из корзины!";
}
function returnListOfObjectsByNames(arrayOfNames){
    let listOfObjects = [];
    for(let i = 0; i < arrayOfNames.length; i++){
        let obj = items[arrayOfNames[i]];
        obj.id = +i;
        listOfObjects.push({itemName: arrayOfNames[i], ...obj});
    }
    return listOfObjects;
}
function returnListOfPurchases(array){
    let list = [];
    for(let i = 0; i < array.length; i++){
        let obj = items[array[i].name];
        obj.id = +i;
        obj.isReviewed = array[i].isReviewed;
        obj.isRated = array[i].isRated;
        list.push(obj);
    }
    return list;
}
function addPurchase(itemName, userName){
    items[itemName].sales +=1;
    let purchase = {
        name: itemName,
        isReviewed: false,
        isRated: false
    }
    users[userName].items.push(purchase);
    restoreJson();
}
function returnListOfFilteredItems(category){
    let array = returnListOfItems();
    if(category==""){
        return array;
    }
    for(let i = 0; i < array.length; i++){
        if(array[i].category !== category){
            array.splice(i, 1);
            i--;
        }
    }
    return array;
}
function getListOfItemsBySubname(subname){
    let array = returnListOfItems();
    let listOfItems = [];
    for(let i = 0; i < array.length; i++){
        if(array[i].itemName.toLowerCase().includes(subname.toLowerCase())){
            listOfItems.push(array[i]);
        }
    }
    return listOfItems;
}

function addReview(name, review, login){
    if(review == ""){
        return false;
    }
    let obj = {
        user: login,
        review: review
    }
    items[name].reviews.push(obj);
    restoreJson();
    return true;
}
function addRating(name){
    items[name].rating += 1;
    restoreJson();
}
function deleteRating(name){
    items[name].rating -= 1;
    restoreJson();
}
function returnReviews(name){
    let string = "";
    if(items[name].reviews.length < 1){
        return "Пока отзывов на этот товар нет";
    }
    for(let i = 0; i<items[name].reviews.length; i++){
        string += items[name].reviews[i].user + "📝:" + items[name].reviews[i].review + `\n`;
    }
    return string;
}
function listOfRetailersItems(retailer){
    retailersItems = [];
    for(let i = 0; i<users[retailer].items.length; i++){
        let obj = items[users[retailer].items[i]];
        obj.id = +i;
        obj.itemName = users[retailer].items[i]
        obj.numOfReviews = items[users[retailer].items[i]].reviews.length;
        retailersItems.push(obj);
    }
    return retailersItems;
}
function deleteItem(name, login){
    delete items[name];
    for(let i = 0; i < users[login].items.length; i++){
        if(name == users[login].items[i]){
            users[login].items.splice(i, 1);
        }
    }
    restoreJson();
    return "Товар удален из базы!";
}
function changeItem(name, newPrice){
    if(items[name].price == newPrice){
        return "Введите новую информацию!";
    }
    items[name].price = newPrice;
    restoreJson();
    return "Информация о товаре изменена!";
}

module.exports = {changeItem, deleteItem, listOfRetailersItems, returnReviews, deleteRating, returnListOfPurchases, addReview, addRating, getListOfItemsBySubname, returnListOfFilteredItems, addPurchase, deleteItemFromCartById, returnListOfItems, addNewUser, checkUser, addNewItem, returnModifyingListOfUsers, deleteUserById, banUser, unbanUser, addItemToCartById, returnListOfObjectsByNames};