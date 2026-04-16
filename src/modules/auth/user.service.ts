import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/global-error-handling";
import { IUser } from "../../DB/models/user.model";
import { HydratedDocument } from "mongoose";
import { ISignInType, ISignUpType } from "./user.validation";
import UserRepository from "../../DB/repository/user.repository";
import { Compare, Hash } from "../../common/utils/security/hash";
import { sendEmail, sendOtp } from "../../common/utils/mail/mail";
import { templateEmail } from "../../common/utils/mail/email.template";
import { RoleEnum, statusAccountEnum, statusTransactionEnum, typeTransactionEnum } from "../../common/enum/user.enum";
import { generateAccountNumber } from "../../common/utils/functions";
import BankAccountRepository from "../../DB/repository/account.repository";
import { IBankAccount } from "../../DB/models/bankAccount.model";
import { ACCESS_SECRET_KEY } from "../../config/config.service";
import { generateToken } from "../../common/utils/token/jwt";
import TransactionRepository from "../../DB/repository/trancaction.repository";


class UserService {


    private readonly _userModel = new UserRepository()
    private readonly _bankAccountModel = new BankAccountRepository()
    private readonly _transactionModel = new TransactionRepository()





    constructor() { }

    signup = async (req: Request, res: Response, next: NextFunction) => {
        const { username, email, password, confirmPassword }: ISignUpType = req.body;

        const emailExist = await this._userModel.findOne({ filter: { email } })

        if (emailExist) {
            return next(new AppError("Email already exists", 409))
        }

        const user: HydratedDocument<IUser> = await this._userModel.create({
            username
            , email
            , password: Hash({ plan_text: password })

            , role: RoleEnum.user

        })

        const bankAccount: HydratedDocument<IBankAccount> = await this._bankAccountModel.create({
            userId: user._id,
            accountNumber: generateAccountNumber(),
            balance: 0,
            status: statusAccountEnum.active
        })

        const opt = await sendOtp()
        await sendEmail({
            to: email,
            subject: "Email confirmation",
            html: templateEmail(opt)
        })
        res.status(200).json({
            message: "User signed up successfully", data: {
                user,
                bankAccount
            }
        })
    }


    signin = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password }: ISignInType = req.body;

        const user = await this._userModel.findOne({ filter: { email } })

        if (!user) {
            return next(new AppError("User not found", 404))
        }

        const isPasswordValid = Compare({ plan_text: password, cipher_text: user.password })

        if (!isPasswordValid) {
            return next(new AppError("Invalid password", 401))
        }

        const access_token = generateToken({ payload: { id: user._id }, secretKey: ACCESS_SECRET_KEY })

        res.status(200).json({
            message: "User signed in successfully", data: {
                user,
                access_token
            }
        })
    }




}

export default new UserService();