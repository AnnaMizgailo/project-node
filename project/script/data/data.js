const path = require("path");
const fs = require("fs");
let dataFromUsers = fs.readFileSync(path.join(__dirname, "./users.json"),{encoding: "utf-8"});
let dataFromItems = fs.readFileSync(path.join(__dirname, "./items.json"),{encoding: "utf-8"});


let users = {
    ...JSON.parse(dataFromUsers)
};
let items = {
    ...JSON.parse(dataFromItems)
};
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

module.exports = {returnListOfItems};