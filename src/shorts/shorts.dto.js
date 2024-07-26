import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const getShortsDetailListDto = (data) => {
    const shortsList = [];

    for(const short of data) {
        shortsList.push({
            "userId": short.user_id,
            "userAccount": short.account,
            "profileImg": short.profile_img,
            "isFollow": short.isFollow === undefined ? false : Boolean(short.isFollow),
            "shortsImg": short.shorts_img,
            "phrase": short.phrase,
            "title": short.title,
            "content": short.content,
            "tags": short.tag ? short.tag.split("|") : [],
            "isLike": short.isLike === undefined ? false : Boolean(short.isLike),
            "likeCnt": short.like_count,
            "commentCnt": short.comment_count,
            "bookId": short.book_id
        });
    }

    return shortsList;
};

export const getSearchShortsListDto = (data) => {
    const shortsList = [];

    for(const short of data) {
        shortsList.push({
            "shortsId": short.shorts_id,
            "shortsImg": short.shorts_img,
            "phrase": short.phrase,
            "category": short.category,
            "bookTitle": short.book_title,
            "author": short.author,
            "translator": short.translator,
            "tags": short.tag ? short.tag.split("|") : []
        });
    }

    return shortsList;
};

export const shortsInfoDto = (data, imgUrl) => {
    if (data === undefined || imgUrl === undefined || data.phrase === undefined || data.shortsTitle === undefined || data.shortsTitle === undefined || data.content === undefined) {
        throw new BaseError(status.PARAMETER_IS_WRONG)
    }

    return {
        "image_url": imgUrl,
        "phrase": data.phrase,
        "title": data.shortsTitle,
        "content": data.content,
        "tag": data.tags,
        "user_id": 1 // TODO: 미들웨어 추가되면 수정
    };
}
