import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookListInfoDto = (data) => {
    const mallType = ['BOOK', 'EBOOK', 'FOREIGN'];
    const result = data.map(book => {
        if (!mallType.includes(book.mallType)) {
            return null;
        }

        const author = book.author.split(' (지은이)')[0].trim();

        return {
            "ISBN": book.isbn13 ? book.isbn13 : book.isbn,
            "bookCover": book.cover,
            "bookTitle": book.title,
            "author": author,
            "cid": book.categoryId,
            "mallType": book.mallType,
            "link": book.link
        }
    })

    // null 제거
    return result.filter(Boolean);
};

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

export const bookDetailDto = (isRead, bookId, data) => {
    return {
        "isRead": Boolean(isRead),
        "bookId": bookId,
        "shorts": data.map(short => ({
            shortsId: short.shorts_id,
            shortsImg: short.shorts_img,
            phrase: short.phrase
        }))
    };
};
