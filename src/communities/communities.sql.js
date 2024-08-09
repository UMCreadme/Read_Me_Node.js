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

// 모임 총 개수 조회 쿼리
export const COUNT_COMMUNITIES = "SELECT COUNT(*) as count FROM COMMUNITY;";

//모임 리스트 조회 쿼리 (최신순 정렬)
export const GET_COMMUNITIES = `
    SELECT * FROM COMMUNITY 
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?;
`;

// 나의 참여 모임 리스트 조회 쿼리 (최신 메시지 온 순으로 정렬)
export const getMyCommunities = `
    SELECT c.*
    FROM COMMUNITY c
    LEFT JOIN MESSAGE m ON c.community_id = m.community_id
    WHERE c.user_id = ?
    GROUP BY c.community_id
    ORDER BY MAX(m.created_at) DESC
    LIMIT ? OFFSET ?;
`
// 안읽은 개수 조회
export const getUnreadCount = `
    SELECT COUNT(*) AS unread
    FROM MESSAGE m
    WHERE m.created_at > (
        SELECT MAX(r.created_at)
        FROM MESSAGE_READ_STATUS r
        JOIN MESSAGE m ON r.message_id = m.message_id
        WHERE r.user_id = ? ) ;`;

// 커뮤니티 ID로 책 id 조회
export const getCommunityBookID = "SELECT book_id FROM COMMUNITY WHERE community_id = ?;";

// 책 ID로 제목, 표지url 조회
export const getBookInfo = "SELECT title, image_url FROM BOOK WHERE book_id = ?;";