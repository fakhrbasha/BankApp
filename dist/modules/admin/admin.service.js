"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const account_repository_1 = __importDefault(require("../../DB/repository/account.repository"));
const user_enum_1 = require("../../common/enum/user.enum");
const user_repository_1 = __importDefault(require("../../DB/repository/user.repository"));
class adminService {
    _bankAccountModel = new account_repository_1.default();
    _userModel = new user_repository_1.default();
    constructor() { }
    adminMakeAccountInactive = async (req, res, next) => {
        const accountNumber = req.params.id;
        const user = await this._userModel.findOne({ filter: { _id: req.user._id } });
        if (user?.role !== user_enum_1.RoleEnum.admin) {
            return next(new global_error_handling_1.AppError("You are not authorized to perform this action", 403));
        }
        const account = await this._bankAccountModel.findOne({
            filter: { accountNumber }
        });
        if (!account) {
            return next(new global_error_handling_1.AppError("Account not found", 404));
        }
        const updatedAccount = await this._bankAccountModel.update({ accountNumber }, { status: user_enum_1.statusAccountEnum.inactive });
        res.status(200).json({
            message: "Account made inactive successfully",
            data: updatedAccount
        });
    };
    adminMakeAccountActive = async (req, res, next) => {
        const accountNumber = req.params.id;
        const user = await this._userModel.findOne({ filter: { _id: req.user._id } });
        if (user?.role !== user_enum_1.RoleEnum.admin) {
            return next(new global_error_handling_1.AppError("You are not authorized to perform this action", 403));
        }
        const account = await this._bankAccountModel.findOne({
            filter: { accountNumber }
        });
        if (!account) {
            return next(new global_error_handling_1.AppError("Account not found", 404));
        }
        const updatedAccount = await this._bankAccountModel.update({ accountNumber }, { status: user_enum_1.statusAccountEnum.active });
        res.status(200).json({
            message: "Account made active successfully",
            data: updatedAccount
        });
    };
}
;
exports.default = new adminService();
