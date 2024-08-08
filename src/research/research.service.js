import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { deleteRecentSearch, getRecentResearch, getResearchUserId } from "./research.dao.js";

// 최근 검색어 삭제
export const deleteSearchService = async (research_id, user_id) => {
    const researchUserId = await getResearchUserId(research_id);

    if (user_id !== researchUserId) {
        throw new BaseError(status.UNAUTHORIZED);
    }
    return await deleteRecentSearch(research_id, user_id);
}

// 최근 검색어 조회
export const RecentResearchService = async (user_id) => {
    // 회원인지 비회원인지 확인
    const queries = user_id ? await getRecentResearch(user_id) : null;

    return queries;
};
