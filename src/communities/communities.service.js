import { createCommunityDto } from './communities.dto.js';
import { BaseError } from '../../config/error.js';
import { status } from '../../config/response.status.js';
import { createCommunityWithCheck } from './communities.dao.js';

// 커뮤니티 생성 서비스
export const createCommunityService = async (userId, bookId, address, tag, capacity) => {
    // Capacity 값이 10을 초과하는지 체크
    if (capacity > 10) {
        throw new BaseError(
            status.INVALID_CAPACITY,
            '커뮤니티의 수용 인원(capacity)은 최대 10명까지 허용됩니다.'
        );
    }

    try {
        // 커뮤니티 생성과 관련된 전체 과정 처리
        const communityId = await createCommunityWithCheck(userId, bookId, address, tag, capacity);

        return createCommunityDto({
            communityId,
            userId,
            bookId,
            address,
            tag,
            capacity
        });
    } catch (err) {
        console.error(err);
        if (err instanceof BaseError) {
            throw err;
        } else {
            throw new BaseError(status.INTERNAL_SERVER_ERROR);
        }
    }
};
