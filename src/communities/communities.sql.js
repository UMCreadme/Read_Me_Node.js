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
export const CREATE_COMMUNITY = "INSERT INTO COMMUNITY (user_id, book_id, content, location, tag, capacity) VALUES (?, ?, ?, ?, ?, ?);";

// 모임 총 개수 조회 쿼리
export const COUNT_COMMUNITIES = "SELECT COUNT(*) as count FROM COMMUNITY;";

//모임 리스트 조회 쿼리 (최신순 정렬)
export const GET_COMMUNITIES = `
    SELECT * FROM COMMUNITY 
    WHERE is_deleted = 0
    ORDER BY created_at DESC 
    LIMIT ? OFFSET ?;
`;

// 나의 참여 모임 리스트 조회 쿼리 (최신 메시지 온 순으로 정렬)
export const getMyCommunities =  `
    SELECT cu.*, c.*
    FROM COMMUNITY_USERS cu
    LEFT JOIN MESSAGE m ON cu.community_id = m.community_id
    LEFT JOIN COMMUNITY c ON cu.community_id = c.community_id  -- 커뮤니티 테이블 조인
    WHERE cu.user_id = ? AND cu.is_deleted = 0
    GROUP BY cu.community_id
    ORDER BY 
        MAX(m.created_at) DESC,
        COUNT(m.message_id) ASC  -- 메시지가 없는 경우 아래로 정렬
    LIMIT ? OFFSET ?;
`;


// 안읽음 개수 카운트
export const getUnreadCount = `
WITH Params AS (
    SELECT ? AS user_id, ? AS community_id
),
LastReadTime AS (  -- 마지막으로 메시지 읽은 시간
    SELECT COALESCE(MAX(r.created_at), '1970-01-01') AS last_read_time
    FROM MESSAGE_READ_STATUS r, Params p
    WHERE r.user_id = p.user_id AND r.community_id = p.community_id
), 
JoinTime AS (  -- 모임 가입 시간
    SELECT cu.created_at AS join_time
    FROM COMMUNITY_USERS cu, Params p
    WHERE cu.user_id = p.user_id AND cu.community_id = p.community_id
)
SELECT COUNT(*) AS unread
FROM MESSAGE m, Params p
WHERE m.community_id = p.community_id 
AND m.created_at > (
    SELECT GREATEST(lr.last_read_time, jt.join_time)
    FROM LastReadTime lr, JoinTime jt
);
`;

// 커뮤니티 ID로 책 id 조회
export const getCommunityBookID = "SELECT book_id FROM COMMUNITY WHERE community_id = ?;";

// 책 ID로 제목, 표지url 조회
export const getBookInfo = "SELECT title, image_url FROM BOOK WHERE book_id = ?;";

// 제목으로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TITLE_KEYWORD = `
SELECT c.*
FROM COMMUNITY c
JOIN BOOK b ON c.book_id = b.book_id
WHERE REPLACE(b.title, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%') AND is_deleted = 0
ORDER BY c.created_at DESC;
`;


// 태그로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TAG_KEYWORD = `
SELECT c.*
FROM COMMUNITY c
WHERE REPLACE(c.tag, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%') AND is_deleted = 0
ORDER BY c.created_at DESC;
`;