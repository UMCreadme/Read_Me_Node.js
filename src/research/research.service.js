import { deleteRecentSearch, getRecentResearch } from "./research.dao.js";

// 최근 검색어 삭제
export const deleteSearchService = async (research_id, user_id) => {
    return await deleteRecentSearch(research_id, user_id);
}

// 최근 검색어 조회
export const RecentResearchService = async (user_id) => {
    // 회원인지 비회원인지 확인
    const queries = user_id ? await getRecentResearch(user_id) : null;

    return queries;
};
