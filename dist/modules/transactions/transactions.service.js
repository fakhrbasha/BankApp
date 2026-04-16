"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const global_error_handling_1 = require("../../common/utils/global-error-handling");
const user_repository_1 = __importDefault(require("../../DB/repository/user.repository"));
const user_enum_1 = require("../../common/enum/user.enum");
const account_repository_1 = __importDefault(require("../../DB/repository/account.repository"));
const trancaction_repository_1 = __importDefault(require("../../DB/repository/trancaction.repository"));
class trancactionsServices {
    _userModel = new user_repository_1.default();
    _bankAccountModel = new account_repository_1.default();
    _transactionModel = new trancaction_repository_1.default();
    constructor() { }
    getMyAccount = async (req, res, next) => {
        const user = await this._userModel.findOne({ filter: { _id: req.user._id } });
        if (!user) {
            return next(new global_error_handling_1.AppError("User not found", 404));
        }
        const bankAccount = await this._bankAccountModel.findOne({ filter: { userId: user._id } });
        if (!bankAccount) {
            return next(new global_error_handling_1.AppError("Bank account not found", 404));
        }
        res.status(200).json({
            message: "User account found successfully", data: {
                user,
                bankAccount
            }
        });
    };
    createTrasactionDeposit = async (req, res, next) => {
        const { amount } = req.body;
        const type = user_enum_1.typeTransactionEnum.deposit;
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user._id }
        });
        if (!bankAccount) {
            return next(new global_error_handling_1.AppError("Bank account not found", 404));
        }
        if (amount <= 0) {
            throw new global_error_handling_1.AppError("Invalid amount", 400);
        }
        if (bankAccount.status !== user_enum_1.statusAccountEnum.active) {
            throw new global_error_handling_1.AppError("Bank account is not active", 400);
        }
        const newBalance = bankAccount.balance + amount;
        const transaction = await this._transactionModel.create({
            accountId: bankAccount._id,
            receviedAccountId: bankAccount._id,
            amount,
            type,
            balanceBefore: bankAccount.balance,
            balanceAfter: newBalance,
            status: user_enum_1.statusTransactionEnum.pending
        });
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccount._id, update: { balance: newBalance } });
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: user_enum_1.statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        });
    };
    createTransactionWithdrawal = async (req, res, next) => {
        const { amount } = req.body;
        const type = user_enum_1.typeTransactionEnum.withdrawal;
        const bankAccounr = await this._bankAccountModel.findOne({
            filter: { userId: req.user?._id }
        });
        if (!bankAccounr) {
            throw new global_error_handling_1.AppError("Bank Account not fount", 409);
        }
        if (amount > bankAccounr.balance || amount <= 0) {
            throw new global_error_handling_1.AppError("Insufficient balance", 400);
        }
        if (bankAccounr.status !== user_enum_1.statusAccountEnum.active) {
            throw new global_error_handling_1.AppError("Bank account is not active", 400);
        }
        const newBalance = bankAccounr.balance - amount;
        const transaction = await this._transactionModel.create({
            accountId: bankAccounr._id,
            receviedAccountId: bankAccounr._id,
            amount,
            type,
            balanceBefore: bankAccounr.balance,
            balanceAfter: newBalance,
            status: user_enum_1.statusTransactionEnum.pending
        });
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccounr._id, update: { balance: newBalance } });
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: user_enum_1.statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        });
    };
    createTransactionTransfer = async (req, res, next) => {
        const { amount, receviedAccountNumber } = req.body;
        const type = user_enum_1.typeTransactionEnum.transfer;
        const bankAccounr = await this._bankAccountModel.findOne({
            filter: { userId: req.user?._id }
        });
        const receviedBankAccount = await this._bankAccountModel.findOne({
            filter: { accountNumber: receviedAccountNumber }
        });
        if (!bankAccounr) {
            throw new global_error_handling_1.AppError("Bank Account not fount", 409);
        }
        if (!receviedBankAccount) {
            throw new global_error_handling_1.AppError("Bank Account not fount", 409);
        }
        if (amount > bankAccounr.balance || amount <= 0) {
            throw new global_error_handling_1.AppError("Insufficient balance", 400);
        }
        if (bankAccounr.status !== user_enum_1.statusAccountEnum.active) {
            throw new global_error_handling_1.AppError("Bank account is not active", 400);
        }
        if (receviedBankAccount.status !== user_enum_1.statusAccountEnum.active) {
            throw new global_error_handling_1.AppError("Bank account is not active", 400);
        }
        const newBalance = bankAccounr.balance - amount;
        const newReceiverBalance = receviedBankAccount.balance + amount;
        const transaction = await this._transactionModel.create({
            accountId: bankAccounr._id,
            receviedAccountId: receviedBankAccount._id,
            amount,
            type,
            balanceBefore: bankAccounr.balance,
            balanceAfter: newBalance,
            status: user_enum_1.statusTransactionEnum.pending
        });
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccounr._id, update: { balance: newBalance } });
        await this._bankAccountModel.findOneAndUpdate({
            id: receviedBankAccount._id,
            update: { balance: newReceiverBalance }
        });
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: user_enum_1.statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        });
    };
    getTransactions = async (req, res, next) => {
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user._id }
        });
        if (!bankAccount) {
            return next(new global_error_handling_1.AppError("Bank account not found", 404));
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const transactions = await this._transactionModel.find({
            filter: { accountId: bankAccount._id },
            options: {
                sort: { createdAt: -1 },
                limit,
                skip
            }
        });
        res.status(200).json({
            message: "Transactions fetched successfully",
            data: transactions,
            pagination: {
                limit,
                total: transactions.length,
                pages: Math.ceil(transactions.length / limit)
            }
        });
    };
    getTransactionById = async (req, res, next) => {
        const transaction = await this._transactionModel.findOne({
            filter: { _id: req.params.id }
        });
        if (!transaction) {
            return next(new global_error_handling_1.AppError("Transaction not found", 404));
        }
        res.status(200).json({
            message: "Transaction fetched successfully",
            data: transaction
        });
    };
    getMySummary = async (req, res, next) => {
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user._id }
        });
        if (!bankAccount) {
            return next(new global_error_handling_1.AppError("Bank account not found", 404));
        }
        const transactions = await this._transactionModel.find({
            filter: { accountId: bankAccount._id },
            options: {
                sort: { createdAt: -1 },
                limit: 10,
                skip: 0
            }
        });
        res.status(200).json({
            message: "Transactions fetched successfully",
            data: transactions,
            pagination: {
                limit: 10,
                total: transactions.length,
                pages: Math.ceil(transactions.length / 10)
            }
        });
    };
}
exports.default = new trancactionsServices();
