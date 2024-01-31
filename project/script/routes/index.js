const getRouter = require("./get"); //т.к. экспорт без фигурных, можем писать так module.exports = getRouter;
const postRouter = require("./post");
const deleteRouter = require("./delete");
const putRouter = require("./put");
const {returnListOfItems} = require("../data/items");
function handler(request, response) {
  switch (request.method) {
    case "GET":
        getRouter(request, response);
        break;
    case "POST":
        postRouter(request, response);
        break;
    case "DELETE":
        deleteRouter(request, response);
        break;
    case "PUT":
        putRouter(request, response);
        break;
    default:
        response.status(404).send("<h1>Not found</h1>");
  }
}

module.exports = handler;