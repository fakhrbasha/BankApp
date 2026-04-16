"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccountNumber = void 0;
const generateAccountNumber = () => {
    let accountNumber = "";
    for (let i = 0; i < 12; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
};
exports.generateAccountNumber = generateAccountNumber;
