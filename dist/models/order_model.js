"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.OrderStore = void 0;
var database_1 = __importDefault(require("../database"));
var OrderStore = /** @class */ (function () {
    function OrderStore() {
    }
    OrderStore.index = function (user_id, status) {
        return __awaiter(this, void 0, void 0, function () {
            var filters, conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filters = [];
                        if (user_id)
                            filters.push("user_id=(" + user_id + ")");
                        if (status)
                            filters.push("status=('" + status + "')");
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "\n    SELECT orders.* , \n      COALESCE(json_agg(json_build_object('product_id', product_id, 'quantity', quantity)) FILTER (WHERE product_id IS NOT NULL AND quantity IS NOT NULL), '[]') as products\n    FROM orders\n    LEFT JOIN order_products ON id = order_id\n    ";
                        if (filters.length > 0)
                            sql = sql.concat(' WHERE ', filters.join(' AND '));
                        sql = sql.concat(' GROUP BY id;');
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    OrderStore.show = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "\n    SELECT orders.*,\n      COALESCE(json_agg(json_build_object('product_id', product_id, 'quantity', quantity)) FILTER (WHERE product_id IS NOT NULL AND quantity IS NOT NULL), '[]') as products\n    FROM orders\n    LEFT JOIN order_products ON id = order_id\n    WHERE id=($1) GROUP BY id;\n    ";
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0] || null];
                }
            });
        });
    };
    OrderStore.create = function (order) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _b.sent();
                        sql = "INSERT INTO " + OrderStore.TABLE + " (user_id, status) VALUES ($1, $2) RETURNING *;";
                        return [4 /*yield*/, conn.query(sql, [order.user_id, order.status])];
                    case 2:
                        result = _b.sent();
                        conn.release();
                        if (!(order.products && order.products.length > 0)) return [3 /*break*/, 4];
                        _a = result.rows[0];
                        return [4 /*yield*/, this.addProducts(result.rows[0].id, order.products)];
                    case 3:
                        _a.products = _b.sent();
                        _b.label = 4;
                    case 4: return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    OrderStore.patch = function (id, order) {
        return __awaiter(this, void 0, void 0, function () {
            var updates, values, sql, conn, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updates = [];
                        values = [];
                        if (order.status) {
                            updates.push("status=($" + (values.length + 1) + ")");
                            values.push(order.status);
                        }
                        if (order.user_id) {
                            updates.push("user_id=($" + (values.length + 1) + ")");
                            values.push(order.user_id);
                        }
                        sql = "\n      UPDATE orders\n      SET " + updates.join(', ') + "\n      WHERE id=(" + id + ")\n      RETURNING *;\n    ";
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, values)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    OrderStore.addProducts = function (order_id, products) {
        return __awaiter(this, void 0, void 0, function () {
            var values, conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        values = products
                            .map(function (p) { return "(" + order_id + ", " + p.product_id + ", " + p.quantity + ")"; })
                            .join(', ');
                        return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "INSERT INTO order_products (order_id, product_id, quantity) VALUES " + values + " RETURNING product_id, quantity;";
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    OrderStore.getProducts = function (order_id) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1["default"].connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "\n      SELECT op.product_id, op.quantity, p.name, p.price, p.category\n      FROM products p\n      JOIN order_products op ON p.id = op.product_id\n      WHERE op.order_id = ($1);\n    ";
                        return [4 /*yield*/, conn.query(sql, [order_id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows.map(function (r) {
                                return __assign(__assign({}, r), { price: Number(r.price) });
                            })];
                }
            });
        });
    };
    OrderStore.TABLE = 'orders';
    return OrderStore;
}());
exports.OrderStore = OrderStore;
