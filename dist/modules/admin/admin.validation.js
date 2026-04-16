"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAccountInactiveSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_enum_1 = require("../../common/enum/user.enum");
exports.makeAccountInactiveSchema = {
    params: zod_1.default.object({
        id: zod_1.default.string({ error: "id is required" })
    }),
    body: zod_1.default.object({
        role: zod_1.default.enum([user_enum_1.RoleEnum.admin])
    })
};
