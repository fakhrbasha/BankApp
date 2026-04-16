import { Model } from "mongoose";
import { AppError } from "../../common/utils/global-error-handling";
import userModel, { IUser } from "../models/user.model";
import BaseRepository from "./base.repository";
import bankAccountModel, { IBankAccount } from "../models/bankAccount.model";


class BankAccountRepository extends BaseRepository<IBankAccount> {

    constructor(protected readonly model: Model<IBankAccount> = bankAccountModel) {
        super(model)
    }



}

export default BankAccountRepository;
