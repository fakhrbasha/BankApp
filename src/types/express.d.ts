import { ITokenPayload } from "../common/middleware/authontication";
import { IUser } from "../DB/models/user.model";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            decoded?: ITokenPayload;
        }
    }
}