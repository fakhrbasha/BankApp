import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/global-error-handling";
import BankAccountRepository from "../../DB/repository/account.repository";
import { RoleEnum, statusAccountEnum } from "../../common/enum/user.enum";
import UserRepository from "../../DB/repository/user.repository";


class adminService {


    private readonly _bankAccountModel = new BankAccountRepository()
    private readonly _userModel = new UserRepository()





    constructor() { }

    adminMakeAccountInactive = async (req: Request, res: Response, next: NextFunction) => {
        const accountNumber = req.params.id as string;
        const user = await this._userModel.findOne({ filter: { _id: req.user!._id } })
        if (user?.role !== RoleEnum.admin) {
            return next(new AppError("You are not authorized to perform this action", 403));
        }
        const account = await this._bankAccountModel.findOne({
            filter: { accountNumber }
        });
        if (!account) {
            return next(new AppError("Account not found", 404));
        }
        const updatedAccount = await this._bankAccountModel.update(
            { accountNumber },
            { status: statusAccountEnum.inactive }
        );
        res.status(200).json({
            message: "Account made inactive successfully",
            data: updatedAccount
        });
    };
    adminMakeAccountActive = async (req: Request, res: Response, next: NextFunction) => {
        const accountNumber = req.params.id as string;
        const user = await this._userModel.findOne({ filter: { _id: req.user!._id } })
        if (user?.role !== RoleEnum.admin) {
            return next(new AppError("You are not authorized to perform this action", 403));
        }
        const account = await this._bankAccountModel.findOne({
            filter: { accountNumber }
        });

        if (!account) {
            return next(new AppError("Account not found", 404));
        }

        const updatedAccount = await this._bankAccountModel.update(
            { accountNumber },
            { status: statusAccountEnum.active }
        );

        res.status(200).json({
            message: "Account made active successfully",
            data: updatedAccount
        });
    };

};



export default new adminService();