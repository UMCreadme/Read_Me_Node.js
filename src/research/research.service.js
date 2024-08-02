import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { deleteRecentSearch } from "./research.dao.js";

export const deleteSearchService = async (research_id, user_id) => {
    return await deleteRecentSearch(research_id, user_id);
}