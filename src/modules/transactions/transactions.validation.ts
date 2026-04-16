import { typeTransactionEnum } from "../../common/enum/user.enum"
import { z } from "zod"

export const createTransactionSchema = {
    body: z.object({
        type: z.enum(typeTransactionEnum),
        amount: z.number({ error: "amount is required" }).min(0).max(8000),
        receviedAccountNumber: z.string({ error: "recevied account number is required" }).min(12).max(12),
    })
}

export type ICreateTransactionType = z.infer<typeof createTransactionSchema.body>


export const getTransactionByIdSchema = {
    params: z.object({
        id: z.string({ error: "id is required" }).min(24).max(24),
    })
}

export type IGetTransactionByIdType = z.infer<typeof getTransactionByIdSchema.params>


export const createTransactionDepositSchema = {
    body: z.object({
        amount: z.number({ error: "amount is required" }).min(0).max(8000),
    })
}

export type ICreateTransactionDepositType = z.infer<typeof createTransactionDepositSchema.body>


export const createTransactionTransferSchema = {
    body: z.object({
        amount: z.number({ error: "amount is required" }).min(0).max(8000),
        receviedAccountNumber: z.string({ error: "recevied account number is required" }).min(12).max(12),
    })
}

export type ICreateTransactionTransferType = z.infer<typeof createTransactionTransferSchema.body>
