import { BaseError } from "../../config/error.js";
import { pageInfo } from "../../config/pageInfo.js";
import { status } from "../../config/response.status.js";
import { addSearchDao, getResearchId, updateSearchDao } from "../research/research.dao.js";
import { getShortsDetailToBook } from "../shorts/shorts.detail.dao.js";
import { checkIsReadById, getBookIdByISBN, findUserRecentBookList,  saveBook, deleteBookIsReadToUser, updateBookIsReadToUser, getCategoryIdByAladinCid, findBookById } from "./book.dao.js"
import { bookDetailResponseDto, createBookRequestDto, aladinBookSearchResultDto, bookSearchResponseDto } from "./book.dto.js";
import axios from "axios";

export const getBookDetailInfoById = async (bookId, page, size, userId) => {
    // 책 정보 조회
    const book = await findBookById(bookId);

    if(!book) {
        throw new BaseError(status.BOOK_NOT_FOUND);
    }

    // 책 읽음 여부 (회원인 경우 DB 조회 / 비회원인 경우 false)
    const isRead = userId ? await checkIsReadById(userId, bookId) : false;
    // 책에 해당하는 쇼츠 조회
    const shorts = await getShortsDetailToBook(-1, bookId, size+1, (page-1)*size);

    const hasNext = shorts.length > size;
    if(hasNext) shorts.pop();

    return {"data": bookDetailResponseDto(book, isRead, shorts), "pageInfo": pageInfo(page, shorts.length, hasNext)};
}

export const getBookDetailInfoByISBN = async (ISBN, page, size, userId) => {
    // 책 ID 조회
    const bookId = await getBookIdByISBN(ISBN);
    
    // 책이 저장되지 않았을 경우 ISBN으로 책 정보 조회 (알라딘 api)
    if(!bookId) {
        const book = await searchBookByISBN(ISBN);
        return {"data": bookDetailResponseDto(book, false, []), "pageInfo": pageInfo(page, 0, false)};
    } else {
        return getBookDetailInfoById(bookId, page, size, userId);
    }
}

export const findUserRecentBook = async (userId, offset, limit) => {
    return await findUserRecentBookList(userId, offset, limit)
}

export const createBook = async (ISBN) => {
    // 책 ID 조회
    let bookId = await getBookIdByISBN(ISBN);

    if(!bookId) {
        // ISBN으로 책 정보 조회 (알라딘 api)
        let book = await searchBookByISBN(ISBN);
        const categoryId = await getCategoryIdByAladinCid(book.cid);
        if(!categoryId) {
            throw new BaseError(status.CATEGORY_NOT_FOUND);
        }
    
        book.category_id = categoryId;
        book = createBookRequestDto(book);
        bookId = await saveBook(book);
    }

    return bookId;
}

export const updateBookIsRead = async (bookId, userId) => {
    // 책 ID로 정보 있는지 확인
    const book = await findBookById(bookId);
    if(!book) {
        throw new BaseError(status.BOOK_NOT_FOUND);
    }

    const isRead = await checkIsReadById(userId, bookId);
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

export const searchBookByISBN = async (ISBN) => {
    const BASE_URL = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${process.env.TTB_KEY}&output=js&Version=20131101`;

    // ISBN이 10자리인 경우 itemIdType = ISBN / 13자리인 경우 itemIdType = ISBN13
    let url; let result;
    if (ISBN.length === 10) {
        url = `${BASE_URL}&itemIdType=ISBN&ItemId=${ISBN}`;
    } else if (ISBN.length === 13) {
        url = `${BASE_URL}&itemIdType=ISBN13&ItemId=${ISBN}`;
    } else {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await axios.get(url)
        .then(response => {
            // JSON 데이터 파싱 후 DTO로 변환
            const bookData = response.data.item;
            if(bookData.length === 0) {
                throw new BaseError(status.BOOK_NOT_FOUND);
            }

            result = aladinBookSearchResultDto(bookData)[0];
        }).catch(error => {
        console.error('Error fetching data from API:', error);
    });

    return result;
}

export const searchBookService = async (userId, keyword, preview, page, size) => {
    const BASE_URL = `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${process.env.TTB_KEY}&output=js&Version=20131101`;

    // 전체 몰 검색
    const url = `${BASE_URL}&Query=${keyword}&MaxResults=${size+1}&start=${page}&SearchTarget=all`;
    let bookList = [];
    await axios.get(url)
        .then(response => {
            // JSON 데이터 파싱 후 DTO로 변환
            const bookDataList = response.data.item;
            bookList = bookSearchResponseDto(bookDataList);
        }).catch(error => {
        console.error('Error fetching data from API:', error);
    });

    const hasNext = bookList.length > size;
    if(hasNext) bookList.pop();

    // 검색어 저장 : 회원이거나 미리보기가 아닌 경우에만 저장
    if(!userId || preview) {
        return {"data": bookList, "pageInfo": pageInfo(page, bookList.length, hasNext)};
    }

    const recentSearchId = await getResearchId(userId, keyword);
    if(!recentSearchId) {
        await addSearchDao(userId, keyword);
    } else {
        await updateSearchDao(recentSearchId);
    }

    return {"data": bookList, "pageInfo": pageInfo(page, bookList.length, hasNext)};
};

export const createBookSearchService = async (ISBN, keyword, userId) => {
    let bookId = await getBookIdByISBN(ISBN);
    if(!bookId) {
        const aladinBookInfo = await searchBookByISBN(ISBN);
        const categoryId = await getCategoryIdByAladinCid(aladinBookInfo.cid);
        if(!categoryId) {
            throw new BaseError(status.CATEGORY_NOT_FOUND);
        }

        const book = createBookRequestDto(aladinBookInfo);
    
        book.category_id = categoryId;
        bookId = await saveBook(book);
    }

    await addSearchDao(userId, keyword, bookId);
};
