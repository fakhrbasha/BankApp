import { NextFunction, Request, Response } from "express"
import { ZodType } from "zod"
import { AppError } from "../utils/global-error-handling"



type reqTypes = keyof Request
type schemaType = Partial<Record<reqTypes, ZodType>>

export const validation = (schema: schemaType) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const validationError = []
        for (const key of Object.keys(schema) as reqTypes[]) {
            if (!schema[key]) continue;
            const result = schema[key]?.safeParse(req[key])
            if (!result?.success) {
                validationError.push(result.error.message)
            }

        }
        if (validationError.length > 0) {
            throw new AppError(JSON.parse(validationError as unknown as string), 400)
        }
        next();
    }
}