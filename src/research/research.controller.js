import { status } from "../../config/response.status.js";
import { response } from "../../config/response.js";
import { BaseError } from "../../config/error.js";
import { RecentResearchService } from "./research.service.js";


export const getRecentSearches = async (req, res) => {
    const { user_id } = req.body;

    const result = await RecentResearchService(user_id);
    res.send(response(status.SUCCESS, result));
}
