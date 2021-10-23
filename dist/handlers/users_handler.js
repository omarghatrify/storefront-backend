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
var user_model_1 = require("../models/user_model");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var order_model_1 = require("../models/order_model");
var TOKEN_SECRET = process.env.TOKEN_SECRET;
if (!TOKEN_SECRET)
    throw new Error('TOKEN_SECRET missing!');
var store = user_model_1.UserStore;
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.index()];
            case 1:
                result = _a.sent();
                res.json(result.map(function (u) {
                    delete u.password;
                    return u;
                }));
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(500);
                res.json("Failed to index users, Internal " + error_1);
                return [2 /*return*/];
            case 3: return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(req.params.id);
                user = res.locals.user;
                if (isNaN(id)) {
                    res.status(400);
                    res.send("Failed to get user, " + new Error('Invalid user id.'));
                }
                if (id != user.id) {
                    res.status(403);
                    res.send("Failed to get user, " + new Error('Access denied.'));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.show(id)];
            case 2:
                result = _a.sent();
                if (result) {
                    delete result.password;
                    res.json(result);
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500);
                res.send("Failed to get user, Internal " + error_2);
                return [2 /*return*/];
            case 4:
                res.status(404);
                res.send("Failed to get user, " + new Error("User " + id + " not found."));
                return [2 /*return*/];
        }
    });
}); };
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, result, token, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.body;
                try {
                    if (!user.firstname)
                        throw new Error('Missing parameter: firstname.');
                    if (!user.lastname)
                        throw new Error('Missing parameter: lastname.');
                    if (!user.password)
                        throw new Error('Missing parameter: password.');
                }
                catch (error) {
                    res.status(400);
                    res.send("Failed to create user, " + error);
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(user)];
            case 2:
                result = _a.sent();
                delete result.password;
                token = jsonwebtoken_1["default"].sign(result, TOKEN_SECRET);
                res.status(201).send(token);
                return [2 /*return*/];
            case 3:
                error_3 = _a.sent();
                res.status(500);
                res.send("Failed to create user, Internal " + error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var auth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, password, user, _a, token, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = Number(req.body.id);
                password = req.body.password;
                try {
                    if (!req.body.id)
                        throw new Error('Missing parameter: id.');
                    if (!password)
                        throw new Error('Missing parameter: password.');
                    if (isNaN(id))
                        throw new Error('Invalid parameter: id.');
                }
                catch (error) {
                    res.status(400);
                    res.json("Failed to authenticate, " + error);
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                return [4 /*yield*/, store.show(req.body.id)];
            case 2:
                user = _b.sent();
                _a = user;
                if (!_a) return [3 /*break*/, 4];
                return [4 /*yield*/, store.check_pass(user, password)];
            case 3:
                _a = (_b.sent());
                _b.label = 4;
            case 4:
                if (_a) {
                    delete user.password;
                    token = jsonwebtoken_1["default"].sign(user, TOKEN_SECRET);
                    res.send(token);
                    return [2 /*return*/];
                }
                return [3 /*break*/, 6];
            case 5:
                error_4 = _b.sent();
                res.status(500);
                res.send("Failed to authenticate user, Internal " + error_4);
                return [3 /*break*/, 6];
            case 6:
                res.status(403);
                res.json("Authentication Failed, " + new Error('Wrong id or password.'));
                return [2 /*return*/];
        }
    });
}); };
var orders = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, user, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = Number(req.params.id);
                user = res.locals.user;
                if (user_id != user.id) {
                    res.status(403);
                    res.send("Failed to get user, " + new Error('Access denied on user.'));
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, order_model_1.OrderStore.index(user_id)];
            case 2:
                result = _a.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500);
                res.send("Failed to get user orders, Internal " + error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var routes = express_1["default"].Router();
routes.get('/', jwt_midware_1.verifyToken, index); // INDEX
routes.get('/:id', jwt_midware_1.verifyToken, show); // SHOW
routes.post('/', create); // CREATE
routes.post('/authenticate', auth); // CREATE
routes.get('/:id/orders', jwt_midware_1.verifyToken, orders);
exports["default"] = routes;
