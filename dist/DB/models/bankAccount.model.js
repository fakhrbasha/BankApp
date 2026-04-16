"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_enum_1 = require("../../common/enum/user.enum");
const bankAccountSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        min: 2,
        max: 50
    },
    balance: {
        type: Number,
        required: true,
        trim: true,
        min: 0,
        max: 8000
    },
    status: {
        type: String,
        enum: user_enum_1.statusAccountEnum,
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
const bankAccountModel = mongoose_1.default.models.BankAccount || mongoose_1.default.model("account", bankAccountSchema);
exports.default = bankAccountModel;
