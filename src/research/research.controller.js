import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { addSearchService } from "./research.service.js";
import { RecentResearchService } from "./research.service.js";
import { deleteSearchService } from "./research.service.js";

export const addSearchController = async (req, res) => {
    const { query, book_id } = req.body;
    const { user_id } = req.body;

    if (!user_id || !query) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    const result = await addSearchService(user_id, query, book_id);
    res.send(response(status.SUCCESS, result));
}


export const deleteRecentSearchController = async (req, res) => {
    const { recent_research_id } = req.params;
    const { user_id } = req.body;

    if ( !recent_research_id ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteSearchService(recent_research_id, user_id);
    res.send(response(status.SUCCESS));
}


export const getRecentSearches = async (req, res) => {
    const { user_id } = req.body;

    const result = await RecentResearchService(user_id);
    res.send(response(status.SUCCESS, result));
}

