import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { addSearchDao } from "./research.dao.js";


export const addSearchService = async (user_id, query, book_id) => {
    addSearchDao(user_id, query, book_id);
}