import { status } from '../../config/response.status.js';
import { response } from '../../config/response.js';
import { searchCommunityService, getCommunitiesService } from './communities.service.js';
import { pageInfo } from '../../config/pageInfo.js'; // 경로는 실제 위치에 맞게 조정하세요

export const searchCommunityController = async (req, res, next) => {
    const { keyword, page = 1, size = 10 } = req.query;

    // 쿼리 파라미터로 받는 페이지와 사이즈 검증
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(size, 10);

    if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(status.BAD_REQUEST.status).send(response(
            status.BAD_REQUEST,
            "",
            "유효한 페이지 번호를 입력해 주세요."
        ));
    }

    if (isNaN(pageSize) || pageSize < 1) {
        return res.status(status.BAD_REQUEST.status).send(response(
            status.BAD_REQUEST,
            "",
            "유효한 페이지 크기를 입력해 주세요."
        ));
    }

    if (!keyword) {
        return res.status(status.BAD_REQUEST.status).send(response(
            status.BAD_REQUEST,
            "",
            "검색어가 필요합니다."
        ));
    }

    try {
        const communities = await searchCommunityService(keyword);
        const totalElements = communities.length;
        const totalPages = totalElements > 0 ? Math.ceil(totalElements / pageSize) : 0;
        const offset = (pageNumber - 1) * pageSize;
        const paginatedCommunities = communities.slice(offset, offset + pageSize);
        const hasNext = pageNumber < totalPages;
        const adjustedSize = paginatedCommunities.length; // 실제로 출력된 결과 수

        const result = {
            pageInfo: pageInfo(pageNumber, adjustedSize, hasNext),
            categoryList: paginatedCommunities
        };

        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            result,
            totalElements > 0 ? "검색한 모임 리스트 불러오기 성공" : "검색 결과가 없습니다."
        ));
    } catch (error) {
        next(error);
    }
};

export const getCommunitiesController = async (req, res, next) => {
    const { page = 1, size = 10 } = req.query;  // req.body 대신 req.query 사용

    try {
        const communitiesData = await getCommunitiesService(parseInt(page), parseInt(size));

        res.status(status.SUCCESS.status).send(response(
            status.SUCCESS,
            communitiesData,
            "전체 모임 리스트 불러오기 성공"
        ));
    } catch (error) {
        next(error);
    }
};