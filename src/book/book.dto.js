import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const bookInfoDto = (data) => {
    if (!data || !data.ISBN || !data.bookTitle || !data.category || !data.bookCover || !data.author || !data.link) {
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
}
