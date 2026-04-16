import { NextFunction, Request, Response } from "express"
import { AppError } from "../utils/global-error-handling"
import { verifyToken } from "../utils/token/jwt"
import { ACCESS_SECRET_KEY, PREFIX } from "../../config/config.service"
import UserRepository from "../../DB/repository/user.repository"


export interface ITokenPayload {
    id: string;
    iat?: number;
    exp?: number;
}

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
    const _userModel = new UserRepository()
    const { authorization } = req.headers
    if (!authorization) {
        throw new AppError("token required", 401)
    }
    const [prefix, token] = authorization.split(" ") // Bearer token
    if (prefix !== PREFIX || !token) {
        throw new AppError("invalid token format", 401)
    }
    const decoded = verifyToken({ token, secretKey: ACCESS_SECRET_KEY }) as ITokenPayload
    if (!decoded || !decoded.id) {
        throw new AppError("invalid token", 401)
    }

    const user = await _userModel.findOne({ filter: { _id: decoded.id } })

    if (!user) {
        throw new Error("user not exist", { cause: 409 })
    }


    req.user = user
    req.decoded = decoded
    next()

}