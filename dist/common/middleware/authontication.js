"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const global_error_handling_1 = require("../utils/global-error-handling");
const jwt_1 = require("../utils/token/jwt");
const config_service_1 = require("../../config/config.service");
const user_repository_1 = __importDefault(require("../../DB/repository/user.repository"));
const authentication = async (req, res, next) => {
    const _userModel = new user_repository_1.default();
    const { authorization } = req.headers;
    if (!authorization) {
        throw new global_error_handling_1.AppError("token required", 401);
    }
    const [prefix, token] = authorization.split(" ");
    if (prefix !== config_service_1.PREFIX || !token) {
        throw new global_error_handling_1.AppError("invalid token format", 401);
    }
    const decoded = (0, jwt_1.verifyToken)({ token, secretKey: config_service_1.ACCESS_SECRET_KEY });
    if (!decoded || !decoded.id) {
        throw new global_error_handling_1.AppError("invalid token", 401);
    }
    const user = await _userModel.findOne({ filter: { _id: decoded.id } });
    if (!user) {
        throw new Error("user not exist", { cause: 409 });
    }
    req.user = user;
    req.decoded = decoded;
    next();
};
exports.authentication = authentication;
