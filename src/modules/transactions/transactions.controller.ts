

import { Router } from "express";
import TransactionService from "./transactions.service";
import * as transactionValidation from "./transactions.validation";
import { validation } from "../../common/middleware/validation";
import { authentication } from "../../common/middleware/authontication";
const transactionRouter = Router();


transactionRouter.get('/my-account', authentication, TransactionService.getMyAccount);
transactionRouter.post('/create-transaction-deposit', validation(transactionValidation.createTransactionDepositSchema), authentication, TransactionService.createTrasactionDeposit);
transactionRouter.post('/create-transaction-withdrawal', validation(transactionValidation.createTransactionDepositSchema), authentication, TransactionService.createTransactionWithdrawal);
transactionRouter.post('/create-transaction-transfer', validation(transactionValidation.createTransactionTransferSchema), authentication, TransactionService.createTransactionTransfer);
transactionRouter.get('/get-transactions', authentication, TransactionService.getTransactions);
transactionRouter.get('/get-my-summary', authentication, TransactionService.getMySummary);
transactionRouter.get('/get-transaction/:id', validation(transactionValidation.getTransactionByIdSchema), authentication, TransactionService.getTransactionById);


export default transactionRouter;