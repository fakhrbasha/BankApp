import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { PORT } from "./config/config.service";
import { AppError, globalErrorHandler } from "./common/utils/global-error-handling";
import authRouter from "./modules/auth/user.controller";
import { checkConnection } from "./DB/connectionDB";
import transactionRouter from "./modules/transactions/transactions.controller";
import adminRouter from "./modules/admin/admin.controller";


const app: express.Application = express();

const port: number = Number(PORT);


//

const bootstrap = () => {

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later.",
        handler: (req: Request, res: Response, next: NextFunction) => {
            throw new AppError("Too many requests, please try again later.", 429)
        }
        , legacyHeaders: false,
    })

    app.use(express.json());
    checkConnection()
    app.use(cors(), helmet(), limiter)

    app.use("/auth", authRouter)
    app.use("/admin", adminRouter)
    app.use("/transaction", transactionRouter)

    app.get("/", (req: Request, res: Response, next: NextFunction) => {
        res.status(200).json({ message: "Welcome to the Social App API!" })
    })

    app.use("{/*demo}", (req: Request, res: Response, next: NextFunction) => {
        throw new AppError(`Invalid URL ${req.originalUrl} with method ${req.method} not found`, 404)
    })

    app.use(globalErrorHandler)

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })

}

export default bootstrap;