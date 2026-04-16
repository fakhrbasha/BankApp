"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const beneficiarySchema = new mongoose_1.default.Schema({
    ownerUserId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "user",
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    nickName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    bankName: {
        type: String,
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
const beneficiaryModel = mongoose_1.default.models.Beneficiary || mongoose_1.default.model("Beneficiary", beneficiarySchema);
exports.default = beneficiaryModel;
