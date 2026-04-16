export const generateAccountNumber = (): string => {
    let accountNumber = "";
    for (let i = 0; i < 12; i++) {
        accountNumber += Math.floor(Math.random() * 10);
    }
    return accountNumber;
};