import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { searchCommunityService } from './communities.service.js';
import { pageInfo } from '../../config/pageInfo.js';

export const searchCommunityController = async (req, res, next) => {
    const { keyword, page = 1, size = 10 } = req.query;

    // 쿼리 파라미터로 받는 페이지와 사이즈 검증
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    if (isNaN(pageSize) || pageSize < 1) {
        return res.status(status.BAD_REQUEST.status).send({
            isSuccess: false,
            code: status.BAD_REQUEST.code,
            message: "유효한 페이지 크기를 입력해 주세요.",
            pageInfo: null,
            result: null
        });
    }

    if (!keyword || keyword.trim() === "") {
        return res.status(status.BAD_REQUEST.status).send({
            isSuccess: false,
            code: status.BAD_REQUEST.code,
            message: "검색어가 필요합니다.",

        });
    }

    try {
        // 검색 서비스를 호출하여 전체 결과 및 페이지네이션 처리를 담당
        const { totalElements, communities } = await searchCommunityService(keyword, pageNumber, pageSize);

        // 페이지 정보 계산
        const totalPages = Math.ceil(totalElements / pageSize);
        const hasNext = pageNumber < totalPages;
        const adjustedSize = communities.length;

        // 페이지 정보와 결과를 포함하는 응답 객체 생성
        const pageInfoData = pageInfo(pageNumber, adjustedSize, hasNext);
        const result = {
            communityList: communities
        };

        const message = totalElements > 0 ? "검색한 모임 리스트 불러오기 성공" : "검색 결과가 없습니다.";

        // 응답 전송
        res.status(status.SUCCESS.status).send({
            isSuccess: true,
            code: status.SUCCESS.code,
            message: message,
            pageInfo: pageInfoData,
            result: result
        });
    } catch (error) {
        next(error);
    }
};
