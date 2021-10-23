"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.app = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var express_1 = __importDefault(require("express"));
var products_handler_1 = __importDefault(require("./handlers/products_handler"));
var users_handler_1 = __importDefault(require("./handlers/users_handler"));
var orders_handler_1 = __importDefault(require("./handlers/orders_handler"));
var port = process.env.PORT || 3000;
exports.app = (0, express_1["default"])();
console.log("Started for " + process.env.ENV + " enviroment.");
exports.app.use(express_1["default"].urlencoded({ extended: true }));
exports.app.use(express_1["default"].json());
exports.app.get('/', function (req, res) {
    res.send('Hello World!');
});
exports.app.use('/products', products_handler_1["default"]);
exports.app.use('/users', users_handler_1["default"]);
exports.app.use('/orders', orders_handler_1["default"]);
exports.app.listen(port, function () {
    console.log("listening on port: " + port);
});
