"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var jwt_midware_1 = require("../middleware/jwt_midware");
var order_model_1 = require("../models/order_model");
var order_products_handler_1 = __importDefault(require("./order_products_handler"));
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_id, result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                user_id = undefined;
                //const status = req.query.status as Order['status'] | undefined;
                if (req.query.user_id) {
                    user_id = Number(req.query.user_id);
                    if (isNaN(user_id)) {
                        res.status(400);
                        res.json("Failed to index orders, " + new Error('Invalid query parameter: user_id'));
                        return [2 /*return*/];
                    }
                    if (user_id != user.id) {
                        res.status(403);
                        res.json("Failed to index orders, " + new Error('Acces denied.'));
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, order_model_1.OrderStore.index(user_id /*, status*/)];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500).json("Failed to get order, " + error_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var active = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_id, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                user_id = undefined;
                if (req.query.user_id) {
                    user_id = Number(req.query.user_id);
                    if (isNaN(user_id)) {
                        res.status(400);
                        res.json("Failed to index active orders, " + new Error('Invalid query parameter: user_id'));
                        return [2 /*return*/];
                    }
                    if (user_id != user.id) {
                        res.status(403);
                        res.json("Failed to index orders, " + new Error('Acces denied.'));
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, order_model_1.OrderStore.index(user_id, 'ACTIVE')];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json("Failed to index active orders, " + error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var complete = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, user_id, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                user_id = undefined;
                if (req.query.user_id) {
                    user_id = Number(req.query.user_id);
                    if (isNaN(user_id)) {
                        res.status(400);
                        res.json("Failed to index completed orders, " + new Error('Invalid query parameter: user_id'));
                        return [2 /*return*/];
                    }
                    if (user_id != user.id) {
                        res.status(403);
                        res.json("Failed to index orders, " + new Error('Acces denied.'));
                        return [2 /*return*/];
                    }
                }
                return [4 /*yield*/, order_model_1.OrderStore.index(user_id, 'COMPLETE')];
            case 1:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json("Failed to index completed orders, " + error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, order_id, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = res.locals.user;
                order_id = Number(req.params.order_id);
                if (isNaN(order_id)) {
                    res.status(400);
                    res.json("Failed to get order, " + new Error('Invalid order id.'));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_model_1.OrderStore.show(order_id)];
            case 1:
                result = _a.sent();
                if (result) {
                    if (result.user_id != user.id) {
                        res.status(403);
                        res.json("Failed to get order, " + new Error('Access denied.'));
                        return [2 /*return*/];
                    }
                    res.json(result);
                    return [2 /*return*/];
                }
                res.status(404);
                res.json("Failed to get order, " + new Error('Not found.'));
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500);
                res.json("Failed to get order, Internal " + error_4);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var products, user, activeOrders, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                products = req.body.products;
                user = res.locals.user;
                return [4 /*yield*/, order_model_1.OrderStore.index(user.id, 'ACTIVE')];
            case 1:
                activeOrders = _a.sent();
                if (activeOrders.length > 0) {
                    res.status(405);
                    res.json("Failed to create order, " + new Error('You already have an active order.'));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_model_1.OrderStore.create({
                        user_id: user.id,
                        products: products,
                        status: 'ACTIVE'
                    })];
            case 2:
                result = _a.sent();
                res.status(201).send(result);
                return [2 /*return*/];
            case 3:
                error_5 = _a.sent();
                res.status(500);
                res.json("Failed to create order, Internal " + error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var patch = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var value, order_id, user, order, result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                value = req.body;
                order_id = Number(req.params.order_id);
                user = res.locals.user;
                if (isNaN(order_id)) {
                    res.status(400);
                    res.json("Failed to patch order, " + new Error('Invalid order id.'));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_model_1.OrderStore.show(order_id)];
            case 1:
                order = _a.sent();
                if (!order) {
                    res.status(404);
                    res.json("Failed to patch order, " + new Error('Not found.'));
                    return [2 /*return*/];
                }
                if (user.id != order.user_id) {
                    res.status(403);
                    res.json("Failed to patch order, " + new Error('Access denied.'));
                    return [2 /*return*/];
                }
                try {
                    if (value.id)
                        throw new Error('Cant patch order ID.');
                    if (value.user_id)
                        throw new Error('Cant patch user ID.');
                    if (value.products)
                        throw new Error('Use order products endpoint.');
                    if (!value.status)
                        throw new Error('Nothing to patch.');
                    if (value.status != 'ACTIVE' && value.status != 'COMPLETE')
                        throw new Error('Invalid status, allowed: (ACTIVE | COMPLETE).');
                    if (value.status == 'ACTIVE' && order.status == 'COMPLETE')
                        throw new Error("Can't reopen a completed order");
                }
                catch (error) {
                    res.status(406);
                    res.json("Failed to patch order, " + error);
                    return [2 /*return*/];
                }
                return [4 /*yield*/, order_model_1.OrderStore.patch(order_id, value)];
            case 2:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                res.status(500);
                res.json("Failed to patch order, Internal " + error_6);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var routes = express_1["default"].Router();
routes.get('/', jwt_midware_1.verifyToken, index);
routes.get('/complete', jwt_midware_1.verifyToken, complete);
routes.get('/active', jwt_midware_1.verifyToken, active);
routes.post('/', jwt_midware_1.verifyToken, create);
routes.get('/:order_id', jwt_midware_1.verifyToken, show);
routes.patch('/:order_id', jwt_midware_1.verifyToken, patch);
routes.use('/:order_id/products', order_products_handler_1["default"]);
exports["default"] = routes;
