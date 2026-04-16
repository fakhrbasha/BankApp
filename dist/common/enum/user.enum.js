"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusTransactionEnum = exports.typeTransactionEnum = exports.statusAccountEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum["user"] = "user";
    RoleEnum["admin"] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var statusAccountEnum;
(function (statusAccountEnum) {
    statusAccountEnum["active"] = "active";
    statusAccountEnum["inactive"] = "inactive";
})(statusAccountEnum || (exports.statusAccountEnum = statusAccountEnum = {}));
var typeTransactionEnum;
(function (typeTransactionEnum) {
    typeTransactionEnum["deposit"] = "deposit";
    typeTransactionEnum["withdrawal"] = "withdrawal";
    typeTransactionEnum["transfer"] = "transfer";
})(typeTransactionEnum || (exports.typeTransactionEnum = typeTransactionEnum = {}));
var statusTransactionEnum;
(function (statusTransactionEnum) {
    statusTransactionEnum["pending"] = "pending";
    statusTransactionEnum["success"] = "success";
    statusTransactionEnum["failed"] = "failed";
})(statusTransactionEnum || (exports.statusTransactionEnum = statusTransactionEnum = {}));
