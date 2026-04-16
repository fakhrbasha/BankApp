"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_service_1 = __importDefault(require("./admin.service"));
const authontication_1 = require("../../common/middleware/authontication");
const adminRouter = (0, express_1.Router)();
adminRouter.post('/make-account-inactive/:id', authontication_1.authentication, admin_service_1.default.adminMakeAccountInactive);
adminRouter.post('/make-account-active/:id', authontication_1.authentication, admin_service_1.default.adminMakeAccountActive);
exports.default = adminRouter;
