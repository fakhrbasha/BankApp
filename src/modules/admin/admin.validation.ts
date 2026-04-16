import z from "zod";
import { RoleEnum } from "../../common/enum/user.enum";


export const makeAccountInactiveSchema = {
    params: z.object({
        id: z.string({ error: "id is required" })
    }),
    body: z.object({
        role: z.enum([RoleEnum.admin])
    })
}

