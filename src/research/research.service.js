import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { getRecentResearch } from "./research.dao.js";

export const RecentResearchService = async (user_id) => {

    // 회원인지 비회원인지 확인
    const queries = user_id
    ? await getRecentResearch(user_id)
    : null;

    return queries;
}

