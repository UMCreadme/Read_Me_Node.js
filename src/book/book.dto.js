import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookListInfoDto = (data) => {
    const mallType = ['BOOK', 'EBOOK', 'FOREIGN'];
    const result = data.map(book => {
        if (!mallType.includes(book.mallType)) {
            return null;
        }

        if(book.mallType === 'EBOOK') {
            book.title = `[EBOOK] ${book.title}`;
        }

        const author = book.author.split(' (지은이)')[0].trim();

        return {
            "ISBN": book.isbn13 ? book.isbn13 : book.isbn,
            "bookCover": book.cover,
            "bookTitle": book.title,
            "author": author,
            "cid": book.categoryId,
            "link": book.link
        }
    })

    return result.filter(book => book !== null);
};

// 데이터 베이스에 저장할 책 정보
export const bookInfoDto = (data) => {
    if (!data || !data.ISBN || !data.bookTitle || !data.cid || !data.bookCover || !data.author || !data.link) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    return {
        "ISBN": data.ISBN,
        "title": data.bookTitle,
        "image_url": data.bookCover,
        "author": data.author,
        "link": data.link
    };
};

export const bookDetailDto = (book, isRead, shorts) => {
    return {
        "book": {
            "bookId": book.book_id ? book.book_id : null,
            "ISBN": book.ISBN,
            "bookCover": book.image_url,
            "bookTitle": book.title,
            "author": book.author,
            "link": book.link,
            "isRead": Boolean(isRead)
        },
        "shorts": shorts? shorts.map(short => ({
            shortsId: short.shorts_id,
            shortsImg: short.shorts_img,
            phrase: short.phrase
        })) : []
    };
};
