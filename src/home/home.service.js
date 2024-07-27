import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { categoryShortsResponseDTO } from "./home.dto.js";
import { findShortsByCategory, findUserById, findShortsisLike, findLikeCount, findCommentCount } from "./home.dao.js";

// 카테고리별 쇼츠 리스트 조회 로직
export const findCategoryShorts = async (keyword, offset, limit) => {
    const categoryShorts = await findShortsByCategory(keyword, offset, limit);
    const categoryShortsResponseDTOList = [];

    for (const shorts of categoryShorts) {
        let userData = await findUserById(shorts.user_id);
        let isLike = await findShortsisLike(shorts.user_id, shorts.shorts_id);
        let likeCount = await findLikeCount(shorts.shorts_id);
        let commentCount = await findCommentCount(shorts.shorts_id);

        let result = categoryShortsResponseDTO(shorts, userData, isLike, likeCount, commentCount);
        categoryShortsResponseDTOList.push(result);
        }

        return categoryShortsResponseDTOList;
    }


    