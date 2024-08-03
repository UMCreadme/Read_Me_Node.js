import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { addSearchDao, deleteRecentSearch, getRecentResearch } from "./research.dao.js";


export const addSearchService = async (user_id, query, book_id) => {
    addSearchDao(user_id, query, book_id);
}


export const deleteSearchService = async (research_id, user_id) => {
    return await deleteRecentSearch(research_id, user_id);
}


export const RecentResearchService = async (user_id) => {

    // 회원인지 비회원인지 확인
    const queries = user_id
    ? await getRecentResearch(user_id)
    : null;

    return queries;
}

