import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { categoryShortsResponseDTO } from "./home.dto.js";
import { findShortsByCategory, findUserById, findShortsisLike, findLikeCount, findCommentCount } from "./home.dao.js";

// 카테고리별 쇼츠 리스트 조회 로직
export const findCategoryShorts = async (keyword, offset, limit) => {
    const categoryShorts = await findShortsByCategory(keyword, offset, limit);
    const categoryShortsResponseDTOList = [];

    for (const categoryShort of categoryShorts) {
        let userData = await findUserById(categoryShort.userId);
        let isLike = await findShortsisLike(categoryShort.userId, categoryShort.shortsId);
        let likeCount = await findLikeCount(categoryShort.shortsId);
        let commentCount = await findCommentCount(categoryShort.shortsId);

        let result = categoryShortsResponseDTO(categoryShort, userData, isLike, likeCount, commentCount);
        categoryShortsResponseDTOList.push(result);
        }

        return categoryShortsResponseDTOList;
    }
