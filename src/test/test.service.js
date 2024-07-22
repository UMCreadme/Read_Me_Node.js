import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const getErrorTest = async (body) => {
    if (true) throw new BaseError(status.BAD_REQUEST);

    return "ERROR TEST";
}