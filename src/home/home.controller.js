import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { pageInfo } from "../../config/pageInfo.js";
import { findCategoryShorts, getMainInfo } from "./home.service.js";

// 카테고리 탭 별 쇼츠 리스트 조회
export const getCategoryShorts = async(req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;

    const category = req.query.keyword;
    const result = await findCategoryShorts(category, offset, size+1);

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, size, hasNext)));
}

// 메인 화면 정보 조회
export const getHomeInfo = async(req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 20;
    const offset = (page - 1) * size;
    const user_id = req.query.id ? req.query.id : null; // 사용자 정보가 있으면 user_id를 가져옴

    const result = await getMainInfo(user_id, offset, size+1);

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, size, hasNext)));
}
