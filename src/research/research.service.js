import {deleteRecentSearch, getRecentResearch} from "./research.dao.js";


export const deleteSearchService = async (research_id, user_id) => {
    return await deleteRecentSearch(research_id, user_id);
}


export const RecentResearchService = async (user_id) => {
    return await getRecentResearch(user_id);
}

