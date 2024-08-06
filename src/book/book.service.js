import { BaseError } from "../../config/error.js";
import { pageInfo } from "../../config/pageInfo.js";
import { status } from "../../config/response.status.js";
import { getShortsDetailToBook } from "../shorts/shorts.detail.dao.js";
import { findIsReadById, getBookIdByISBN, findUserRecentBookList,  createBook, deleteBookIsReadToUser, updateBookIsReadToUser, getCategoryIdByAladinCid } from "./book.dao.js"
import { bookDetailDto, bookListInfoDto } from "./book.dto.js";
import axios from "axios";

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

export const findUserRecentBook = async (userId, offset, limit) => {
    return await findUserRecentBookList(userId, offset, limit)
}

export const updateBookIsRead = async (book, cid, userId) => {
    // 책 ID 조회
    let bookId = await getBookIdByISBN(book.ISBN);

    // 책이 저장되지 않았을 경우 책 저장
    if(!bookId) {
        const categoryId = await getCategoryIdByAladinCid(cid);
        if(!categoryId) {
            throw new BaseError(status.CATEGORY_NOT_FOUND);
        }

        book.category_id = categoryId;
        bookId = await createBook(book);
    }

    const isRead = await findIsReadById(userId, bookId);
    // 읽은 책일 경우 삭제
    if(isRead) {
        await deleteBookIsReadToUser(userId, bookId);
        return status.NO_CONTENT;
    } else {
        // 읽지 않은 책일 경우 읽음 처리
        await updateBookIsReadToUser(userId, bookId);
        return status.CREATED;
    }
};

export const createDummyBookDataService = async () => {
    // 알라딘 상품 리스트 조회 API 호출
    let type = "Bestseller";
    let start = 1;

    // API 호출
    while(start <= 20){
        let url = `http://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${process.env.TTB_KEY}&QueryType=${type}&MaxResults=50&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
        axios.get(url)
            .then(response => {
            // JSON 데이터 파싱 후 DTO로 변환
            const bookDataList = response.data.item;
            const bookList = bookListInfoDto(bookDataList);

            // 카테고리 ID 수정
            bookList.forEach(async book => {
                let categoryId = await getCategoryIdByAladinCid(parseInt(book.category_id));
                if(categoryId) {
                    // DB에 저장
                    book.category_id = categoryId;
                    await createBook(book);
                }
            });
        }).catch(error => {
            console.error('Error fetching data from API:', error);
        });
        start++;
    }
};
