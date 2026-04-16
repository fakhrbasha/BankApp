import { Model } from "mongoose";
import { AppError } from "../../common/utils/global-error-handling";
import userModel, { IUser } from "../models/user.model";
import BaseRepository from "./base.repository";
import bankAccountModel, { IBankAccount } from "../models/bankAccount.model";
import transactionModel, { ITransaction } from "../models/transaction.model";


class TransactionRepository extends BaseRepository<ITransaction> {

    constructor(protected readonly model: Model<ITransaction> = transactionModel) {
        super(model)
    }



}

export default TransactionRepository;
