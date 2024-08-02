import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { deleteSearchService } from "./research.service.js";

export const deleteRecentSearchController = async (req, res) => {
    const { recent_research_id } = req.params;

    if ( !recent_research_id ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteSearchService(recent_research_id);
    res.send(response(status.SUCCESS));
}