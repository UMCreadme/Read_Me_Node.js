import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { categoryShortsResponseDTO, HomeInfoResponseDTO } from "./home.dto.js";
import { getShortsbyCategory, getAllCategory, getUserCategoriesById,getFollowersFeeds, getRecommendedShorts} from "./home.dao.js";
import { getCategoryIdByName } from "../book/book.dao.js";


// 카테고리별 쇼츠 리스트 조회 로직
export const ShortsByCategory = async (category_name, user_id) => {

    const category_id = await getCategoryIdByName(category_name);
    const categoryShorts = await getShortsbyCategory(category_id, user_id);
    const categoryShortsDTOList = [];



    for (const shorts of categoryShorts) {
        let result = categoryShortsResponseDTO(shorts);
        categoryShortsDTOList.push(result);
    }

    return categoryShortsDTOList;
}


// 메인 화면 정보 조회 로직 - 사용자 맞춤 카테고리 리스트 + 유저 추천 쇼츠리스트 반환, 팔로잉하는 유저들의 숏츠 리스트 반환
export const getMainInfo = async(user_id, offset, limit) => {
    
    // 카테고리 리스트 가져오기
    let categories = user_id
    ? await getUserCategoriesById(user_id)
    : await getAllCategory();

    if(user_id) {
        categories = [
            { name: "추천" },
            ...categories
        ]
    }

    // 추천 숏츠 리스트 가져오기
    const shorts = user_id
    ? await getRecommendedShorts(user_id)
    : null;

    // 팔로잉 유저들의 숏츠 리스트 가져오기
    const feeds = user_id
    ? await getFollowersFeeds(user_id, offset, limit)
    : null;


    return HomeInfoResponseDTO(user_id, categories, shorts, feeds);
}

