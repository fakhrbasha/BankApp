import * as z from "zod";
import { RoleEnum, typeTransactionEnum } from "../../common/enum/user.enum";


export const signUpSchema = {
    body: z.object({
        username: z.string({ error: "username is required" }).min(3).max(25),
        email: z.string({ error: "email is required" }).email(),
        password: z.string({ error: "password is required" }).min(6),
        confirmPassword: z.string({ error: "confirm password is required" }).min(6),
        role: z.enum(RoleEnum).optional(),

    }).refine((data) => {
        return data.password === data.confirmPassword
    }, {
        message: "password and confirm password must be the same",
        path: ["confirmPassword"]

    })
}





export type ISignUpType = z.infer<typeof signUpSchema.body>


export const signInSchema = {
    body: z.object({
        email: z.string({ error: "email is required" }).email(),
        password: z.string({ error: "password is required" }).min(6),
    })
}

export type ISignInType = z.infer<typeof signInSchema.body>

