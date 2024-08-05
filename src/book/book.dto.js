import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookListInfoDto = (data) => {
    const result = data.map(book => {
        const author = book.author.split(' (지은이)')[0].trim();

        return {
            "ISBN": book.isbn13 ? book.isbn13 : book.isbn,
            "title": book.title,
            "category_id": book.categoryId,
            "image_url": book.cover,
            "author": author,
            "link": book.link
        }
    })

    return result;
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
        "translator": data.translator,
        "link": data.link
    };
};

export const bookDetailDto = (isRead, data) => {
    return {
        "isRead": Boolean(isRead),
        "shorts": data.map(short => ({
            shortsId: short.shorts_id,
            shortsImg: short.shorts_img,
            phrase: short.phrase
        }))
    };
};
