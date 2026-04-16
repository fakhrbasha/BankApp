"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransactionTransferSchema = exports.createTransactionDepositSchema = exports.getTransactionByIdSchema = exports.createTransactionSchema = void 0;
const user_enum_1 = require("../../common/enum/user.enum");
const zod_1 = require("zod");
exports.createTransactionSchema = {
    body: zod_1.z.object({
        type: zod_1.z.enum(user_enum_1.typeTransactionEnum),
        amount: zod_1.z.number({ error: "amount is required" }).min(0).max(8000),
        receviedAccountNumber: zod_1.z.string({ error: "recevied account number is required" }).min(12).max(12),
    })
};
exports.getTransactionByIdSchema = {
    params: zod_1.z.object({
        id: zod_1.z.string({ error: "id is required" }).min(24).max(24),
    })
};
exports.createTransactionDepositSchema = {
    body: zod_1.z.object({
        amount: zod_1.z.number({ error: "amount is required" }).min(0).max(8000),
    })
};
exports.createTransactionTransferSchema = {
    body: zod_1.z.object({
        amount: zod_1.z.number({ error: "amount is required" }).min(0).max(8000),
        receviedAccountNumber: zod_1.z.string({ error: "recevied account number is required" }).min(12).max(12),
    })
};
