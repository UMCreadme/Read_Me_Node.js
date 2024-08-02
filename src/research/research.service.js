import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { deleteRecentSearch } from "./research.dao.js";

export const deleteSearchService = async (user_id, query) => {
    return await deleteRecentSearch(user_id, query);
}