import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";

export const getShortsDetailListDto = (data) => {
    const shortsList = [];

    for(const short of data) {
        shortsList.push({
            "userId": short.user_id,
            "userAccount": short.account,
            "profileImg": short.profile_img,
            "isFollow": short.isFollow ? Boolean(short.isFollow) : false,
            "shortsId": short.shorts_id,
            "shortsImg": short.shorts_img,
            "phrase": short.phrase,
            "phraseX": short.phrase_x,
            "phraseY": short.phrase_y,
            "title": short.title,
            "content": short.content,
            "tags": short.tag ? short.tag.split("|") : [],
            "isLike": short.isLike ? Boolean(short.isLike) : false,
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
            "userId": short.user_id,
            "profileImg": short.profile_img,
            "nickname": short.nickname,
            "shortsId": short.shorts_id,
            "shortsImg": short.shorts_img,
            "phrase": short.phrase,
            "phraseX": short.phrase_x,
            "phraseY": short.phrase_y,
            "title": short.title,
            "content": short.content,
            "tags": short.tag ? short.tag.split("|") : [],
            "category": short.category,
            "isLike": short.isLike? Boolean(short.isLike) : false,
            "likeCnt": short.like_count,
            "commentCnt": short.comment_count,
            "postingDate": short.created_at
        });
    }

    return shortsList;
};

export const shortsInfoDto = (data, imgUrl, userId) => {
    if (!data || !imgUrl || !data.phrase || !data.shortsTitle || !data.shortsTitle || !data.content || !data.phraseX || !data.phraseY) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    return {
        "image_url": imgUrl,
        "phrase": data.phrase,
        "title": data.shortsTitle,
        "content": data.content,
        "tag": data.tags,
        "user_id": userId,
        "phrase_x": parseFloat(data.phraseX),
        "phrase_y": parseFloat(data.phraseY)
    };
}
