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
var product_model_1 = require("../models/product_model");
var store = product_model_1.ProductStore;
var index = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                result = void 0;
                if (!(typeof req.query.category == 'string')) return [3 /*break*/, 2];
                return [4 /*yield*/, store.index(req.query.category)];
            case 1:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, store.index()];
            case 3:
                result = _a.sent();
                _a.label = 4;
            case 4:
                res.json(result);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                res.status(500);
                res.json("Failed to index products, Internal " + error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = Number(req.params.id);
                try {
                    if (isNaN(id))
                        throw new Error('Invalid ID');
                }
                catch (error) {
                    res.status(400);
                    res.send("Failed to get product, " + error);
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.show(id)];
            case 2:
                result = _a.sent();
                if (result) {
                    res.json(result);
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(500);
                res.send("Failed to get product, Internal " + error_2);
                return [2 /*return*/];
            case 4:
                res.status(404);
                res.send("Failed to get product, " + new Error('Not found.'));
                return [2 /*return*/];
        }
    });
}); };
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                product = req.body;
                try {
                    if (!product.price)
                        throw new Error('Missing product price.');
                    if (!product.name)
                        throw new Error('Missing product name.');
                    if (isNaN(product.price))
                        throw new Error('Invalid price');
                }
                catch (error) {
                    res.status(400);
                    res.send("Failed to add product, " + error);
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(product)];
            case 2:
                result = _a.sent();
                res.status(201).json(result);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500);
                res.send("Failed to add product, Internal " + error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var popular = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            res.send('POPULAR PRODUCTS!'); // TODO: ADD POPULAR PRODUCTS METHOD
        }
        catch (error) {
            res.status(500);
            res.send("Failed to get popular products, Internal " + error);
        }
        return [2 /*return*/];
    });
}); };
var routes = express_1["default"].Router();
routes.get('/', index); // INDEX
routes.get('/popular', popular); // POPULAR
routes.get('/:id', show); // SHOW
routes.post('/', jwt_midware_1.verifyToken, create); // CREATE
exports["default"] = routes;
