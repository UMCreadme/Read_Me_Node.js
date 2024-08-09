import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { getCommunities, deleteCommunityDao, 
    checkCommunityExistenceDao, checkCommunityOwnerDao } from './communities.dao.js';
import { createCommunityWithCheck } from './communities.dao.js';


// 커뮤니티 생성 서비스
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    // Capacity 값이 10을 초과하는지 체크
    if (capacity > 10) {
        throw new BaseError(status.INVALID_CAPACITY);
    }

    // 태그 유효성 검사
    if (tag) {

        // 태그 문자열을 '|'로 분리하여 배열로 변환
        const tagsArray = tag.split('|');

        // 태그 개수가 10개를 초과하면 오류 발생
        if (tagsArray.length > 10) {
            throw new BaseError(status.SHORTS_TAG_COUNT_TOO_LONG);
        }

        // 각 태그의 길이가 10자를 초과하면 오류 발생
        for (const singleTag of tagsArray) {
            if (singleTag.length > 10) {
                throw new BaseError(status.SHORTS_TAG_TOO_LONG);
            }
        }
    }

    // 커뮤니티 생성과 관련된 전체 과정 처리
    await createCommunityWithCheck(userId, bookId, address, tag, capacity);
};


export const deleteCommunityService = async (user_id, community_id) => {
    const exists = await checkCommunityExistenceDao(community_id);
    if (!exists) {
        throw new BaseError(status.COMMUNITY_NOT_FOUND);
    }

    const owner = await checkCommunityOwnerDao(community_id);
    if ( owner !== user_id) {
        throw new BaseError(status.UNAUTHORIZED);
    }

    await deleteCommunityDao(community_id);
}

