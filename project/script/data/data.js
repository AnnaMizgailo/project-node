const path = require("path");
const fs = require("fs");
const {users} = require("./users");
const {items} = require("./items");


function restoreJson(){ //для обновления данных о пользователе в процессе сессии
    fs.writeFileSync(path.join(__dirname, "./users.json"), JSON.stringify(users), {encoding: "utf-8"});
    fs.writeFileSync(path.join(__dirname, "./items.json"), JSON.stringify(items), {encoding: "utf-8"});
}


function returnListOfObjectsByNames(arrayOfNames){//вернуть список объектов по массиву с названиями(нужно для отображения характеристик у корзины и листа покупок пользователя)
    let listOfObjects = [];
    for(let i = 0; i < arrayOfNames.length; i++){
        let obj = items[arrayOfNames[i]];
        obj.id = +i;
        listOfObjects.push({itemName: arrayOfNames[i], ...obj});
    }
    return listOfObjects;
}

function addPurchase(itemName, userName){//оплатить товар
    items[itemName].sales +=1;
    let purchase = {
        name: itemName,
        isReviewed: false,
        isRated: false
    }
    users[userName].items.push(purchase);
    restoreJson();
}

function listOfRetailersItems(retailer){//для вкладки "Мои товары" в конструкторе продавца
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
function deleteItem(name, login){//удалить товар
    delete items[name];
    for(let i = 0; i < users[login].items.length; i++){
        if(name == users[login].items[i]){
            users[login].items.splice(i, 1);
        }
    }
    restoreJson();
    return "Товар удален из базы!";
}



module.exports = {deleteItem, listOfRetailersItems, addPurchase, returnListOfObjectsByNames};