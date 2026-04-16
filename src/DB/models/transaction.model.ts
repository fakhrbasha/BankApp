

import mongoose, { Types } from "mongoose";
import { RoleEnum, statusAccountEnum, statusTransactionEnum, typeTransactionEnum } from "../../common/enum/user.enum";
import { string } from "zod";



export interface ITransaction {
    _id: Types.ObjectId,
    accountId: Types.ObjectId
    amount: number,
    type: typeTransactionEnum,
    balanceAfter: number,
    balanceBefore: number,
    status: statusTransactionEnum
    receviedAccountId: Types.ObjectId
}


const transactionSchema = new mongoose.Schema<ITransaction>({
    accountId: {
        type: mongoose.Types.ObjectId,
        ref: "account",
        required: true,
    },
    receviedAccountId: {
        type: mongoose.Types.ObjectId,
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
        enum: typeTransactionEnum,
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
        enum: statusTransactionEnum,
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
})




const transactionModel = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);

export default transactionModel;