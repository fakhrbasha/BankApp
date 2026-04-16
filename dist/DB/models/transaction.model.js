"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_1 = require("../../common/enum/user.enum");
const transactionSchema = new mongoose_1.default.Schema({
    accountId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "account",
        required: true,
    },
    receviedAccountId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "account",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    type: {
        type: String,
        enum: user_enum_1.typeTransactionEnum,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    balanceAfter: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 8000
    },
    balanceBefore: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 8000
    },
    status: {
        type: String,
        enum: user_enum_1.statusTransactionEnum,
        required: true,
        trim: true,
        min: 2,
        max: 50
    }
}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
const transactionModel = mongoose_1.default.models.Transaction || mongoose_1.default.model("Transaction", transactionSchema);
exports.default = transactionModel;
