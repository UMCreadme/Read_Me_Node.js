import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { daoErrorTest } from "./test.dao.js";

export const getErrorTest = async (condition) => {
    if (condition === "service") {
        throw new BaseError(status.CATEGORY_NOT_FOUND);
    }

    return await daoErrorTest(condition);
}