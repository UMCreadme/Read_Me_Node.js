// communities.sql.js

// 그룹 생성 쿼리
export const CREATE_COMMUNITY = "INSERT INTO COMMUNITY (user_id, book_id, address, tag, capacity) VALUES (?, ?, ?, ?, ?);";

// 방장 추가 쿼리
export const ADD_ADMIN_TO_COMMUNITY = "INSERT INTO COMMUNITY_USERS (community_id, user_id, role) VALUES (?, ?, 'admin');";

// 모임 리스트 조회 쿼리
export const GET_COMMUNITIES = "SELECT * FROM COMMUNITY LIMIT ? OFFSET ?;";

// 모임 총 개수 조회 쿼리
export const COUNT_COMMUNITIES = "SELECT COUNT(*) as count FROM COMMUNITY;";

// 특정 사용자가 특정 책으로 생성한 모임 수 조회 쿼리
export const COUNT_COMMUNITIES_BY_USER_AND_BOOK = `
    SELECT COUNT(*) AS count 
    FROM COMMUNITY 
    WHERE user_id = ? AND book_id = ?;
`;