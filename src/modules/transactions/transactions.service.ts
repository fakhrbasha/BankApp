import { NextFunction, Request, Response } from "express";
import { AppError } from "../../common/utils/global-error-handling";
import UserRepository from "../../DB/repository/user.repository";
import { statusAccountEnum, statusTransactionEnum, typeTransactionEnum } from "../../common/enum/user.enum";
import BankAccountRepository from "../../DB/repository/account.repository";
import TransactionRepository from "../../DB/repository/trancaction.repository";


class trancactionsServices {


    private readonly _userModel = new UserRepository()
    private readonly _bankAccountModel = new BankAccountRepository()
    private readonly _transactionModel = new TransactionRepository()





    constructor() { }

    getMyAccount = async (req: Request, res: Response, next: NextFunction) => {
        const user = await this._userModel.findOne({ filter: { _id: req.user!._id } })
        if (!user) {
            return next(new AppError("User not found", 404))
        }
        const bankAccount = await this._bankAccountModel.findOne({ filter: { userId: user._id } })
        if (!bankAccount) {
            return next(new AppError("Bank account not found", 404))
        }
        res.status(200).json({
            message: "User account found successfully", data: {
                user,
                bankAccount
            }
        })

    }

    createTrasactionDeposit = async (req: Request, res: Response, next: NextFunction) => {
        const { amount } = req.body
        const type = typeTransactionEnum.deposit;
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user!._id }
        });
        if (!bankAccount) {
            return next(new AppError("Bank account not found", 404));
        }
        if (amount <= 0) {
            throw new AppError("Invalid amount", 400)
        }
        if (bankAccount.status !== statusAccountEnum.active) {
            throw new AppError("Bank account is not active", 400)
        }
        const newBalance = bankAccount.balance + amount;
        const transaction = await this._transactionModel.create({
            accountId: bankAccount._id,
            receviedAccountId: bankAccount._id,
            amount,
            type,
            balanceBefore: bankAccount.balance,
            balanceAfter: newBalance,
            status: statusTransactionEnum.pending
        });
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccount._id, update: { balance: newBalance } })
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        });
    }

    createTransactionWithdrawal = async (req: Request, res: Response, next: NextFunction) => {
        const { amount } = req.body
        const type = typeTransactionEnum.withdrawal

        const bankAccounr = await this._bankAccountModel.findOne({
            filter: { userId: req.user!?._id }
        })

        if (!bankAccounr) {
            throw new AppError("Bank Account not fount", 409)
        }

        if (amount > bankAccounr.balance || amount <= 0) {
            throw new AppError("Insufficient balance", 400)
        }
        if (bankAccounr.status !== statusAccountEnum.active) {
            throw new AppError("Bank account is not active", 400)
        }
        const newBalance = bankAccounr.balance - amount;

        const transaction = await this._transactionModel.create({
            accountId: bankAccounr._id,
            receviedAccountId: bankAccounr._id,
            amount,
            type,
            balanceBefore: bankAccounr.balance,
            balanceAfter: newBalance,
            status: statusTransactionEnum.pending
        })
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccounr._id, update: { balance: newBalance } })
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        })
    }

    createTransactionTransfer = async (req: Request, res: Response, next: NextFunction) => {
        const { amount, receviedAccountNumber } = req.body
        const type = typeTransactionEnum.transfer

        const bankAccounr = await this._bankAccountModel.findOne({
            filter: { userId: req.user!?._id }
        })

        const receviedBankAccount = await this._bankAccountModel.findOne({
            filter: { accountNumber: receviedAccountNumber }
        })

        if (!bankAccounr) {
            throw new AppError("Bank Account not fount", 409)
        }

        if (!receviedBankAccount) {
            throw new AppError("Bank Account not fount", 409)
        }

        if (amount > bankAccounr.balance || amount <= 0) {
            throw new AppError("Insufficient balance", 400)
        }
        if (bankAccounr.status !== statusAccountEnum.active) {
            throw new AppError("Bank account is not active", 400)
        }
        if (receviedBankAccount.status !== statusAccountEnum.active) {
            throw new AppError("Bank account is not active", 400)
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
            status: statusTransactionEnum.pending
        })
        await this._bankAccountModel.findOneAndUpdate({ id: bankAccounr._id, update: { balance: newBalance } })
        await this._bankAccountModel.findOneAndUpdate({
            id: receviedBankAccount._id,
            update: { balance: newReceiverBalance }
        });
        await this._transactionModel.findOneAndUpdate({
            id: transaction._id,
            update: { status: statusTransactionEnum.success }
        });
        res.status(200).json({
            message: "Transaction completed successfully",
            data: transaction
        })
    }

    getTransactions = async (req: Request, res: Response, next: NextFunction) => {
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user!._id }
        });

        if (!bankAccount) {
            return next(new AppError("Bank account not found", 404));
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
    }

    getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
        const transaction = await this._transactionModel.findOne({
            filter: { _id: req.params.id }
        });
        if (!transaction) {
            return next(new AppError("Transaction not found", 404));
        }
        res.status(200).json({
            message: "Transaction fetched successfully",
            data: transaction
        });
    }

    getMySummary = async (req: Request, res: Response, next: NextFunction) => {
        const bankAccount = await this._bankAccountModel.findOne({
            filter: { userId: req.user!._id }
        });
        if (!bankAccount) {
            return next(new AppError("Bank account not found", 404));
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
    }
}

export default new trancactionsServices();