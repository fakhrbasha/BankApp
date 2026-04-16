"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactions_service_1 = __importDefault(require("./transactions.service"));
const transactionValidation = __importStar(require("./transactions.validation"));
const validation_1 = require("../../common/middleware/validation");
const authontication_1 = require("../../common/middleware/authontication");
const transactionRouter = (0, express_1.Router)();
transactionRouter.get('/my-account', authontication_1.authentication, transactions_service_1.default.getMyAccount);
transactionRouter.post('/create-transaction-deposit', (0, validation_1.validation)(transactionValidation.createTransactionDepositSchema), authontication_1.authentication, transactions_service_1.default.createTrasactionDeposit);
transactionRouter.post('/create-transaction-withdrawal', (0, validation_1.validation)(transactionValidation.createTransactionDepositSchema), authontication_1.authentication, transactions_service_1.default.createTransactionWithdrawal);
transactionRouter.post('/create-transaction-transfer', (0, validation_1.validation)(transactionValidation.createTransactionTransferSchema), authontication_1.authentication, transactions_service_1.default.createTransactionTransfer);
transactionRouter.get('/get-transactions', authontication_1.authentication, transactions_service_1.default.getTransactions);
transactionRouter.get('/get-my-summary', authontication_1.authentication, transactions_service_1.default.getMySummary);
transactionRouter.get('/get-transaction/:id', (0, validation_1.validation)(transactionValidation.getTransactionByIdSchema), authontication_1.authentication, transactions_service_1.default.getTransactionById);
exports.default = transactionRouter;
