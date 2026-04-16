"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const user_repository_1 = __importDefault(require("../../DB/repository/user.repository"));
const hash_1 = require("../../common/utils/security/hash");
const mail_1 = require("../../common/utils/mail/mail");
const email_template_1 = require("../../common/utils/mail/email.template");
const user_enum_1 = require("../../common/enum/user.enum");
const functions_1 = require("../../common/utils/functions");
const account_repository_1 = __importDefault(require("../../DB/repository/account.repository"));
const config_service_1 = require("../../config/config.service");
const jwt_1 = require("../../common/utils/token/jwt");
const trancaction_repository_1 = __importDefault(require("../../DB/repository/trancaction.repository"));
class UserService {
    _userModel = new user_repository_1.default();
    _bankAccountModel = new account_repository_1.default();
    _transactionModel = new trancaction_repository_1.default();
    constructor() { }
    signup = async (req, res, next) => {
        const { username, email, password, confirmPassword } = req.body;
        const emailExist = await this._userModel.findOne({ filter: { email } });
        if (emailExist) {
            return next(new global_error_handling_1.AppError("Email already exists", 409));
        }
        const user = await this._userModel.create({
            username,
            email,
            password: (0, hash_1.Hash)({ plan_text: password }),
            role: user_enum_1.RoleEnum.user
        });
        const bankAccount = await this._bankAccountModel.create({
            userId: user._id,
            accountNumber: (0, functions_1.generateAccountNumber)(),
            balance: 0,
            status: user_enum_1.statusAccountEnum.active
        });
        const opt = await (0, mail_1.sendOtp)();
        await (0, mail_1.sendEmail)({
            to: email,
            subject: "Email confirmation",
            html: (0, email_template_1.templateEmail)(opt)
        });
        res.status(200).json({
            message: "User signed up successfully", data: {
                user,
                bankAccount
            }
        });
    };
    signin = async (req, res, next) => {
        const { email, password } = req.body;
        const user = await this._userModel.findOne({ filter: { email } });
        if (!user) {
            return next(new global_error_handling_1.AppError("User not found", 404));
        }
        const isPasswordValid = (0, hash_1.Compare)({ plan_text: password, cipher_text: user.password });
        if (!isPasswordValid) {
            return next(new global_error_handling_1.AppError("Invalid password", 401));
        }
        const access_token = (0, jwt_1.generateToken)({ payload: { id: user._id }, secretKey: config_service_1.ACCESS_SECRET_KEY });
        res.status(200).json({
            message: "User signed in successfully", data: {
                user,
                access_token
            }
        });
    };
}
exports.default = new UserService();
