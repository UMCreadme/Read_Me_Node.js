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

// 방장 추가 쿼리
export const ADD_ADMIN_TO_COMMUNITY = "INSERT INTO COMMUNITY_USERS (community_id, user_id, role) VALUES (?, ?, 'admin');";

// 특정 사용자가 특정 책으로 생성한 모임 수 조회 쿼리
export const COUNT_COMMUNITIES_BY_USER_AND_BOOK = `
    SELECT COUNT(*) AS count 
    FROM COMMUNITY 
    WHERE user_id = ? AND book_id = ? AND is_deleted = FALSE;
`;

// 그룹 생성 쿼리
export const CREATE_COMMUNITY = "INSERT INTO COMMUNITY (user_id, book_id, address, tag, capacity) VALUES (?, ?, ?, ?, ?);";


// 모임 리스트 조회 쿼리
export const GET_COMMUNITIES = "SELECT * FROM COMMUNITY LIMIT ? OFFSET ?;";

// 모임 총 개수 조회 쿼리
export const COUNT_COMMUNITIES = "SELECT COUNT(*) as count FROM COMMUNITY;";