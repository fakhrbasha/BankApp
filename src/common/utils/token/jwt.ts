// import pkg from 'jsonwebtoken';
// const { sign, verify } = pkg;
import jwt from 'jsonwebtoken'
const expireDate = '1h'

export const generateToken = ({ payload, secretKey, options = {} }: { payload: object, secretKey: string, options?: object }) => {
    return jwt.sign(payload, secretKey, { expiresIn: expireDate, ...options })
}

export const verifyToken = ({ token, secretKey, options = {} }: { token: string, secretKey: string, options?: object }) => {
    try {
        return jwt.verify(token, secretKey, options)
    } catch (error) {
        return null
    }
}