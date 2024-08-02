// 커뮤니티의 현재 참여자 수를 조회하는 쿼리
export const GET_COMMUNITY_CURRENT_COUNT = `
    SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ?
`;

// 커뮤니티의 최대 인원수를 조회하는 쿼리
export const GET_COMMUNITY_CAPACITY = `
    SELECT capacity FROM COMMUNITY WHERE community_id = ?
`;

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 쿼리
export const IS_USER_ALREADY_IN_COMMUNITY = `
    SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ? AND user_id = ?
`;

// 커뮤니티에 참여하는 쿼리
export const JOIN_COMMUNITY = `
    INSERT INTO COMMUNITY_USERS (community_id, user_id)
    VALUES (?, ?)
`;
