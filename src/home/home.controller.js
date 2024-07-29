import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { pageInfo } from "../../config/pageInfo.js";
import { ShortsByCategory } from "./home.service.js";

// 카테고리 탭별 숏츠 리스트 조회
export const getCategoryShorts = async (req, res, next) => {
    const category_id = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const result = await ShortsByCategory(category_id, offset, size+1);

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, size, hasNext)));
};