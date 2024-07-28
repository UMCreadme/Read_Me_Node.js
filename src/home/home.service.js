import { status } from "../../config/response.status.js";
import { BaseError } from "../../config/error.js";
import { categoryShortsResponseDTO } from "./home.dto.js";
import { getShortsbyCategory } from "./home.dao.js";

// 카테고리별 쇼츠 리스트 조회 로직
export const ShortsByCategory = async (category_id, offset, limit) => {
    const categoryShorts = await getShortsbyCategory(category_id, offset, limit);
    const categoryShortsDTOList = [];

    for (const shorts of categoryShorts) {
        let result = categoryShortsResponseDTO(shorts);
        categoryShortsDTOList.push(result);
    }

    return categoryShortsDTOList;
}
