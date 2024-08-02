// communities.controllers.js
import { status } from '../../config/response.status.js';
import { pageInfo } from '../../config/pageInfo.js';
import { getCommunitiesService } from './communities.service.js';

export const getCommunitiesController = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 10;

    try {
        // 서비스에서 커뮤니티 데이터 및 총 요소 수를 가져옴
        const { communityList, totalElements, hasNext } = await getCommunitiesService(page, size);
        
        // 실제 반환된 데이터 개수
        const actualSize = communityList.length;

        // 총 페이지 수 계산
        const totalPages = Math.ceil(totalElements / size);

        // 페이지 정보 생성
        const pageInfoData = pageInfo(page, actualSize, hasNext, totalElements, totalPages);

        res.status(status.SUCCESS.status).send({
            isSuccess: true,
            code: status.SUCCESS.code,
            message: "전체 모임 리스트 불러오기 성공",
            pageInfo: pageInfoData,
            result: communityList
        });
    } catch (error) {
        next(error);
    }
};
