import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { RecentResearchService } from "./research.service.js";
import { deleteSearchService } from "./research.service.js";

// 최근 검색어 삭제
export const deleteRecentSearchController = async (req, res) => {
    const { recent_research_id } = req.params;
    const user_id = req.user_id;

    if ( !recent_research_id ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteSearchService(recent_research_id, user_id);
    res.send(response(status.SUCCESS));
};

// 최근 검색어 조회
export const getRecentSearches = async (req, res) => {
    const user_id = req.user_id;

    const result = await RecentResearchService(user_id);
    res.send(response(status.SUCCESS, result));
};
