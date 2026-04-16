

import mongoose, { Types } from "mongoose";
import { RoleEnum, statusAccountEnum } from "../../common/enum/user.enum";
import { string } from "zod";



export interface IBankAccount {
    _id: Types.ObjectId,
    userId: Types.ObjectId
    accountNumber: string,
    balance: number,
    status: statusAccountEnum
}


const bankAccountSchema = new mongoose.Schema<IBankAccount>({
    userId: {
        type: mongoose.Types.ObjectId,
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
        enum: statusAccountEnum,
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




const bankAccountModel = mongoose.models.BankAccount || mongoose.model<IBankAccount>("account", bankAccountSchema);

export default bankAccountModel;