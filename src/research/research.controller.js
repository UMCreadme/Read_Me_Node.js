import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { deleteSearchService } from "./research.service.js";

export const deleteRecentSearchController = async (req, res) => {
    const { user_id } = req.body;  //수정
    const { query } = req.body;

    if (!user_id || !query ) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteSearchService(user_id, query);
    res.send(response(status.SUCCESS));
}