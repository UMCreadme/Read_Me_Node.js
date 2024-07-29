//그룹 생성 쿼리
export const makeGroup = "INSERT INTO community (user_id, book_id, address, tag, capacity) VALUES (?, ?, ?, ?, ?);"

// 그룹 생성 쿼리
export const CREATE_COMMUNITY = "INSERT INTO COMMUNITY (user_id, book_id, address, tag, capacity) VALUES (?, ?, ?, ?, ?);";

// 모임 리스트 조회 쿼리
export const GET_COMMUNITIES = "SELECT * FROM COMMUNITY LIMIT ? OFFSET ?;";

// 모임 총 개수 조회 쿼리
export const COUNT_COMMUNITIES = "SELECT COUNT(*) as count FROM COMMUNITY;";
