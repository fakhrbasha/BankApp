

import { Router } from "express";
import adminService from "./admin.service";
import * as adminValidation from "./admin.validation";
import { validation } from "../../common/middleware/validation";
import { authentication } from "../../common/middleware/authontication";
const adminRouter = Router();


adminRouter.post('/make-account-inactive/:id', authentication, adminService.adminMakeAccountInactive);
adminRouter.post('/make-account-active/:id', authentication, adminService.adminMakeAccountActive);



export default adminRouter; 