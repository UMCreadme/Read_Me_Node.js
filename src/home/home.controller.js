import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { pageInfo } from "../../config/pageInfo.js";
import { ShortsByCategory, getMainInfo } from "./home.service.js";

// 카테고리 탭별 숏츠 리스트 조회
export const getCategoryShorts = async (req, res, next) => {
    const category_name = req.query.category;
    const user_id = req.user_id;

    const result = await ShortsByCategory(category_name, user_id);

    res.send(response(status.SUCCESS, result));
};

// 메인 화면 정보 조회
export const getHomeInfo = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const user_id = req.user_id;

    const result = await getMainInfo(user_id, offset, size+1);

    const hasNext = result.feeds.length > size;
    if (hasNext) result.feeds.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.feeds.length, hasNext)));
};
