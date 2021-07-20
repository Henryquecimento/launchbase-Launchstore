const express = require("express");
const nunjucks = require("nunjucks");
const routers = require("./routes");
const session = require("./app/middlewares/session");
const methodOverride = require("method-override");

const server = express();

server.use(session);
server.use(express.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(methodOverride("_method"));
server.use(routers);

server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
  express: server,
  autoescape: false,
  noCache: true,
});

server.listen(5500, function () {
  console.log("Server is running normally");
});
