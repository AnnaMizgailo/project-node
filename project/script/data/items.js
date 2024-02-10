const path = require("path");
const fs = require("fs");
let dataFromItems = fs.readFileSync(path.join(__dirname, "./items.json"),{encoding: "utf-8"});
//парсим инфу из json для товаров и юзеров
let items = {
    ...JSON.parse(dataFromItems)
};

function restoreJson(){ //для обновления данных о пользователе в процессе сессии
    fs.writeFileSync(path.join(__dirname, "./items.json"), JSON.stringify(items), {encoding: "utf-8"});
}

function returnListOfItems(){//возвращаем массив товаров для начальной страницы с каталогами
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
function ifItemExists(name){//а ты вообще есть?
    const keys = Object.keys(items);
    for (const key of keys){
        if(key == name){
            return true;
        }
    }
    return false;
}
function ifItemInArray(array, name){//а этот элемент есть в массиве?
    for(let i = 0; i < array.length; i++){
        if(array[i] == name){
            return true;
        }
    }
    return false;
}

function returnListOfPurchases(array){//вернуть список покупок
    let list = [];
    for(let i = 0; i < array.length; i++){
        let obj = items[array[i].name];
        obj.id = +i;
        obj.isReviewed = array[i].isReviewed;
        obj.isRated = array[i].isRated;
        obj.isComplained = array[i].isComplained;
        list.push(obj);
    }
    return list;
}
function returnListOfFilteredItems(category){//вернуть отфильтрованный по категории список товаров
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
function getListOfItemsBySubname(subname){//для searchBar вернуть товары по субстроке
    let array = returnListOfItems();
    let listOfItems = [];
    for(let i = 0; i < array.length; i++){
        if(array[i].itemName.toLowerCase().includes(subname.toLowerCase())){
            listOfItems.push(array[i]);
        }
    }
    return listOfItems;
}
function addRating(name){//отметочка "Нравится"
    items[name].rating += 1;
    restoreJson();
}
function deleteRating(name){//отметочка "Не нравится"
    items[name].rating -= 1;
    restoreJson();
}
function returnReviews(name){//вернуть список отзывов на товар
    let string = "";
    if(items[name].reviews.length < 1){
        return "Пока отзывов на этот товар нет";
    }
    for(let i = 0; i<items[name].reviews.length; i++){
        string += items[name].reviews[i].user + "📝:" + items[name].reviews[i].review + `\n`;
    }
    return string;
}
function changeItem(name, newPrice){//изменить товар
    if(items[name].price == newPrice){
        return "Введите новую информацию!";
    }
    items[name].price = newPrice;
    restoreJson();
    return "Информация о товаре изменена!";
}
function addReview(name, review, login){//отзывы на товары!
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
module.exports = {ifItemExists, returnListOfItems, items, ifItemInArray,  returnListOfPurchases, addReview, changeItem, returnReviews, deleteRating, addRating, getListOfItemsBySubname, returnListOfFilteredItems};