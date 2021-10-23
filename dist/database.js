"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1["default"].config();
var pg_1 = require("pg");
var env = process.env.ENV ? process.env.ENV + '_' : '';
if (!process.env["POSTGRES_" + env + "DB"])
    throw new Error("POSTGRES_" + env + "DB missing!");
if (!process.env["POSTGRES_" + env + "HOST"])
    throw new Error("POSTGRES_" + env + "HOST missing!");
if (!process.env["POSTGRES_" + env + "USER"])
    throw new Error("POSTGRES_" + env + "USER missing!");
if (!process.env["POSTGRES_" + env + "PASSWORD"])
    throw new Error("POSTGRES_" + env + "PASSWORD missing!");
var port = Number(process.env["POSTGRES_" + env + "PORT"]);
var client = new pg_1.Pool({
    host: process.env["POSTGRES_" + env + "HOST"],
    database: process.env["POSTGRES_" + env + "DB"],
    user: process.env["POSTGRES_" + env + "USER"],
    password: process.env["POSTGRES_" + env + "PASSWORD"],
    port: !isNaN(port) ? port : undefined
});
exports["default"] = client;
