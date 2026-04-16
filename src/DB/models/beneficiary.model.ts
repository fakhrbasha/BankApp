

import mongoose, { Types } from "mongoose";
import { RoleEnum, statusAccountEnum, statusTransactionEnum, typeTransactionEnum } from "../../common/enum/user.enum";
import { string } from "zod";



export interface IBeneficiary {
    _id: Types.ObjectId,
    ownerUserId: Types.ObjectId,
    accountNumber: string,
    nickName: string,
    bankName: string,
}


const beneficiarySchema = new mongoose.Schema<IBeneficiary>({
    ownerUserId: {
        type: mongoose.Types.ObjectId,
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
})




const beneficiaryModel = mongoose.models.Beneficiary || mongoose.model<IBeneficiary>("Beneficiary", beneficiarySchema);

export default beneficiaryModel;