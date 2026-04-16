import { Router } from "express";
import UserService from "./user.service";
import * as userValidation from "./user.validation";
import { validation } from "../../common/middleware/validation";
const authRouter = Router();


authRouter.post('/signup', validation(userValidation.signUpSchema), UserService.signup);
authRouter.post('/signin', validation(userValidation.signInSchema), UserService.signin);



export default authRouter;