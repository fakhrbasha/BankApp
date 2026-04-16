

import mongoose, { Types } from "mongoose";
import { RoleEnum } from "../../common/enum/user.enum";



export interface IUser {
    _id: Types.ObjectId,
    firstName: string,
    lastName: string,
    username: string, // virtual key
    email: string,
    password: string,
    role?: RoleEnum,

    createdAt?: Date,
    updatedAt?: Date
}


const userSchema = new mongoose.Schema<IUser>({
    firstName:
    {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        min: 2,
        max: 50
    },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true, min: 6, max: 100 },

    role: { type: String, enum: RoleEnum, default: RoleEnum.user },

}, {
    timestamps: true,
    strict: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



userSchema.virtual("username").get(function (this: IUser) {
    return `${this.firstName} ${this.lastName}`;
}).set(function (this: IUser, value: string) {
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName;
    this.lastName = lastName;
})

const userModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default userModel;