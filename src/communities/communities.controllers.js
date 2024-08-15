import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { pageInfo } from "../../config/pageInfo.js";
import { bookInfoDto } from "../book/book.dto.js";
import { creatCommunityDto } from './communities.dto.js';
import { createCommunityService, joinCommunityService, searchCommunityService, getCommunitiesService, getMyCommunitiesService, deleteCommunityService } from './communities.service.js';

// 커뮤니티 생성 - 책정보 + 내용, 태그, 참여인원, 만남장소
export const createCommunityController = async (req, res, next) => {
    const userId = req.user_id;
    const book = bookInfoDto(req.body);

    const community = creatCommunityDto(req.body, userId);

    const communityId = await createCommunityService(book, community, req.body.cid);

    if(!communityId) {
        throw new BaseError(status.INTERNAL_SERVER_ERROR);
    }

    res.send(response(status.CREATED));
};

export const deleteCommunityController = async (req, res, next) => {
    const user_id = req.user_id;
    const community_id = req.params.communityId;

    if (!user_id || !community_id) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await deleteCommunityService(user_id, community_id);
    res.send(response(status.SUCCESS));
}

// 커뮤니티 가입 컨트롤러
export const joinCommunityController = async (req, res, next) => {
    const communityId = req.params.communityId;
    const userId = req.user_id;

    if (!communityId) {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }

    await joinCommunityService(parseInt(communityId), userId);
    return res.send(response(status.JOINED));

};


// 전체 커뮤니티 리스트 조회
export const getCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page -1) * size

    const result = await getCommunitiesService(offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();

    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 나의 모임 리스트 조회
export const getMyCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;
    const offset = (page -1) * size

    const myId = req.user_id;

    const result = await getMyCommunitiesService(myId, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();
    
    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
}

// 커뮤니티 검색
export const searchCommunityController = async (req, res, next) => {
    const { keyword, page = 1, size = 10 } = req.query;

    // 파라미터 검증
    if (!keyword || page <= 0 || size <= 0 || keyword.trim() === "") {
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    const offset = (page -1) * size
    const result = await searchCommunityService(keyword, offset, size+1)

    const hasNext = result.length > size;
    if (hasNext) result.pop();
    
    res.send(response(status.SUCCESS, result, pageInfo(page, result.length, hasNext)))
};
