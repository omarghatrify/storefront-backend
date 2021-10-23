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
exports.ProductStore = void 0;
var database_1 = __importDefault(require("../database"));
var TABLE = 'products';
var ProductStore = /** @class */ (function () {
    function ProductStore() {
    }
    ProductStore.index = function (category) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, result, sql, sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        if (!category) return [3 /*break*/, 3];
                        sql = "SELECT * FROM " + TABLE + " WHERE category=($1);";
                        return [4 /*yield*/, conn.query(sql, [category])];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        sql = "SELECT * FROM " + TABLE + ";";
                        return [4 /*yield*/, conn.query(sql)];
                    case 4:
                        result = _a.sent();
                        _a.label = 5;
                    case 5:
                        conn.release();
                        return [2 /*return*/, result.rows.map(function (r) {
                                r.price = Number(r.price);
                                return r;
                            })];
                }
            });
        });
    };
    ProductStore.show = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!product_id)
                            throw new Error('Missing product_id.');
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "SELECT * FROM " + TABLE + " WHERE id=($1)";
                        return [4 /*yield*/, conn.query(sql, [product_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows[0])
                            result.rows[0].price = Number(result.rows[0].price);
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    ProductStore.create = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!product.name)
                            throw new Error('Missing product name');
                        if (!product.price)
                            throw new Error('Missing product price');
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO " + TABLE + " (name, price, category) VALUES ($1, $2, $3) RETURNING *;";
                        return [4 /*yield*/, conn.query(sql, [
                                product.name,
                                product.price,
                                product.category || null
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        result.rows[0].price = Number(result.rows[0].price);
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    ProductStore.remove = function (product_id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!product_id)
                            throw new Error('Missing product_id.');
                        sql = "DELETE FROM " + TABLE + " WHERE WHERE id=($1) RETURNING *;";
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [product_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows[0])
                            result.rows[0].price = Number(result.rows[0].price);
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    ProductStore.update = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!product.id)
                            throw new Error('Missing product id.');
                        sql = "UPDATE " + TABLE + " SET name=($1), price=($2), category=($3) WHERE id=($4) RETURNING *";
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [
                                product.name,
                                product.price,
                                product.category || null,
                                product.id
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows[0])
                            result.rows[0].price = Number(result.rows[0].price);
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    return ProductStore;
}());
exports.ProductStore = ProductStore;
