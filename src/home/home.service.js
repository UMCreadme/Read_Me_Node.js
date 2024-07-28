import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { categoryShortsResponseDTO } from "./home.dto.js";
import { findShortsByCategory, findUserById, findShortsisLike, findLikeCount, findCommentCount, getAllCategory,
getRecommendedShorts,getShorts, getFollowersFeeds } from "./home.dao.js";

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


// 메인 화면 정보 조회 로직 - 사용자 맞춤 카테고리 리스트 + 유저 추천 숏츠 4개 리스트 반환, 팔로잉하는 유저들의 숏츠 리스트 반환
export const getMainInfo = async(user_id, offset, limit) => {
    
    // 카테고리 리스트 가져오기
    const categories = user_id
    ? await getUserCategoriesById(user_id)
    : await getAllCategory();

    // 추천 숏츠 리스트 가져오기
    const shorts = user_id
    ? await getRecommendedShorts(categories, offset, limit)
    : await getShorts();

    // 팔로잉 유저들의 숏츠 리스트 가져오기
    const feeds = user_id
    ? await getFollowersFeeds(user_id, offset, limit)
    : await getShorts();


    return HomeInfoResponseDTO(user_id, categories, shorts, feeds);
}