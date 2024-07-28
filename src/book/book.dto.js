import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookInfoDto = (data) => {
    if (data === undefined || data.ISBN === undefined || data.bookTitle === undefined || data.category === undefined || data.bookCover === undefined || data.author === undefined || data.link === undefined) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    if(data.ISBN === null || data.ISBN === "" || data.bookTitle === null || data.bookTitle === "" || 
    data.category === null || data.category === "" || data.bookCover === null || data.bookCover === "" || 
    data.author === null || data.author === "" || data.link === null || data.link === "") {
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
