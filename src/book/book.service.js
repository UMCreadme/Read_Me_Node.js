import { pageInfo } from "../../config/pageInfo.js";
import { getShortsDetailToBook } from "../shorts/shorts.detail.dao.js";
import { findIsReadById, getBookIdByISBN } from "./book.dao.js"
import { bookDetailDto } from "./book.dto.js";

export const getBookDetailInfo = async (ISBN, page, size, userId) => {
    // 책 ID 조회
    const bookId = await getBookIdByISBN(ISBN);

    // 책이 저장되지 않았을 경우 빈 쇼츠 리스트 반환
    if(!bookId) {
        return {"data": bookDetailDto(false, []), "pageInfo": pageInfo(page, 0, false)};
    }

    // 책 읽음 여부 업데이트 (회원인 경우 DB 조회 / 비회원인 경우 false)
    const isRead = userId ? await findIsReadById(userId, bookId) : false;
    // 책에 해당하는 쇼츠 조회
    const shorts = await getShortsDetailToBook(-1, bookId, size+1, (page-1)*size);

    const hasNext = shorts.length > size;
    if(hasNext) shorts.pop();

    return {"data": bookDetailDto(isRead, shorts), "pageInfo": pageInfo(page, shorts.length, hasNext)};
}