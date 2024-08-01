import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const daoErrorTest = async (condition) => {
    if (condition === "dao") {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    return "PASS";
}