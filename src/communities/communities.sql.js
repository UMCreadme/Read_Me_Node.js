// 커뮤니티의 현재 참여자 수를 조회하는 쿼리 (탈퇴자 제외)
export const GET_COMMUNITY_CURRENT_COUNT = `
    SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ? AND is_deleted = 0
`;

// 커뮤니티의 최대 인원수를 조회하는 쿼리
export const GET_COMMUNITY_CAPACITY = `
    SELECT capacity FROM COMMUNITY WHERE community_id = ?
`;

// 커뮤니티에 재가입하는 쿼리
export const REJOIN_COMMUNITY = `
    UPDATE COMMUNITY_USERS 
    SET is_deleted = 0, deleted_at = NULL 
    WHERE community_id = ? AND user_id = ?
`;

// 커뮤니티에 참여하는 쿼리
export const JOIN_COMMUNITY = `
    INSERT INTO COMMUNITY_USERS (community_id, user_id)
    VALUES (?, ?)
`;

// 사용자가 이미 커뮤니티에 참여하고 있는지 확인하는 쿼리
export const IS_USER_ALREADY_IN_COMMUNITY = `
    SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ? AND user_id = ? AND is_deleted = 0
`;

// 방장인지 확인
export const CHECK_IF_LEADER = `
    SELECT role 
    FROM COMMUNITY_USERS 
    WHERE community_id = ? AND user_id = ? AND is_deleted = 0
`;

// 커뮤니티 존재 여부 확인
export const CHECK_COMMUNITY_EXISTENCE = `
    SELECT COUNT(*) as count 
    FROM COMMUNITY 
    WHERE community_id = ? AND is_deleted = 0
`;
// 방장 추가 쿼리
export const ADD_ADMIN_TO_COMMUNITY = "INSERT INTO COMMUNITY_USERS (community_id, user_id, role) VALUES (?, ?, 'admin');";

// 특정 사용자가 특정 책으로 생성한 모임 수 조회 쿼리
export const COUNT_COMMUNITIES_BY_USER_AND_BOOK = `
    SELECT COUNT(*) AS count 
    FROM COMMUNITY 
    WHERE user_id = ? AND book_id = ? AND is_deleted = FALSE;
`;

// 모임 리스트 조회
export const getCommunities = `
    SELECT 
        c.*,
        COALESCE(p.currentCount, 0) AS currentCount,
        b.title, b.image_url as bookImg
    FROM 
        COMMUNITY c
    LEFT JOIN 
        (SELECT community_id, COUNT(*) AS currentCount FROM COMMUNITY_USERS cs WHERE is_deleted = false GROUP BY community_id) p ON c.community_id = p.community_id
    LEFT JOIN 
        BOOK b ON c.book_id = b.book_id  -- 커뮤니티의 book_id를 사용하여 책 정보 조회
    WHERE 
        c.is_deleted = false -- 삭제되지 않은 모임만 조회
    ORDER BY
        c.created_at DESC
    LIMIT ? OFFSET ?;`;

// 나의 참여 모임 리스트 조회 쿼리 (최신 메시지 온 순으로 정렬) + 안읽음 개수 카운트
export const getMyCommunities = `
SELECT
    c.community_id, c.capacity, c.tag, c.location,
    COALESCE(currentCount.cnt, 0) AS currentCount,
    COALESCE(unread.cnt, 0) AS unreadCnt,
    b.title, b.image_url as bookImg,
    recent_msg.latest_message_time
FROM COMMUNITY c
LEFT JOIN (
    SELECT community_id, COUNT(*) AS cnt
    FROM COMMUNITY_USERS
    WHERE COMMUNITY_USERS.is_deleted = false -- 탈퇴자는 빼고 현 참여인원 조사
    GROUP BY community_id
) currentCount ON c.community_id = currentCount.community_id
LEFT JOIN COMMUNITY_USERS cu ON c.community_id = cu.community_id AND cu.is_deleted = false -- 커뮤니티유저 테이블의 is_deleted 조건 추가
LEFT JOIN BOOK b ON c.book_id = b.book_id
LEFT JOIN (
    SELECT m.community_id, COUNT(*) as cnt
    FROM MESSAGE m
    WHERE m.message_id > (
        SELECT COALESCE(MAX(mrs.latest_message_id), 0)
        FROM MESSAGE_READ_STATUS mrs 
        WHERE mrs.user_id = ?
    )
    GROUP BY m.community_id
) unread ON c.community_id = unread.community_id
LEFT JOIN (
    SELECT m.community_id, MAX(m.created_at) AS latest_message_time
    FROM MESSAGE m
    GROUP BY m.community_id
) recent_msg ON c.community_id = recent_msg.community_id
WHERE c.is_deleted = false   -- 커뮤니티 테이블의 is_deleted 조건 추가
AND cu.user_id = ?
ORDER BY recent_msg.latest_message_time DESC
LIMIT ? OFFSET ?;`
;

// 커뮤니티 탈퇴(소프트 딜리트) 쿼리
export const LEAVE_COMMUNITY = `
    UPDATE COMMUNITY_USERS 
    SET is_deleted = 1, deleted_at = NOW() 
    WHERE community_id = ? AND user_id = ?
`;

// 유저가 커뮤니티에 존재하는지 확인하고, is_deleted 상태를 반환
export const CHECK_USER_IN_COMMUNITY = `
    SELECT is_deleted 
    FROM COMMUNITY_USERS 
    WHERE community_id = ? AND user_id = ?
`;

// 커뮤니티 상세정보를 조회하는 쿼리
export const GET_COMMUNITY_DETAILS = `
    SELECT 
        c.location,
        c.tag,
        c.capacity,
        c.created_at,
        c.content,
        b.title,
        b.author,
        b.image_url AS book_image,
        u.image_url AS leader_image,
        u.account AS leader_account,
        u.user_id AS leader_id,
        u.nickname AS leader_nickname,
        (SELECT COUNT(*) FROM COMMUNITY_USERS cm WHERE cm.community_id = c.community_id AND cm.is_deleted = 0 ) AS member_count
    FROM 
        COMMUNITY c
    JOIN 
        BOOK b ON c.book_id = b.book_id
    JOIN 
        USERS u ON c.user_id = u.user_id
    WHERE 
        c.community_id = ? AND c.is_deleted = 0
`;

export const GET_CHATROOM_DETAILS = `
    SELECT 
        b.title,
        c.tag,
        c.position,
        c.address,
        c.meeting_date
    FROM 
        COMMUNITY c
    JOIN 
        BOOK b ON c.book_id = b.book_id
    WHERE 
        c.community_id = ? AND c.is_deleted = 0
`;

export const GET_CHATROOM_MEMBERS = `
    SELECT 
        m.user_id,
        u.image_url,
        u.nickname
    FROM 
        COMMUNITY_USERS m
    JOIN 
        USERS u ON m.user_id = u.user_id
    WHERE 
        m.community_id = ? AND m.is_deleted = 0
`;

export const SET_MEETING_DETAILS = `
    UPDATE COMMUNITY c
    JOIN COMMUNITY_USERS cu ON c.community_id = cu.community_id
    SET 
        c.meeting_date = ?, 
        c.position = ST_GeomFromText(?),
        c.address = ?
    WHERE 
        c.community_id = ? 
        AND cu.user_id = ? 
        AND c.is_deleted = 0;
`;

export const GET_COMMUNITY_UPDATED_AT = `
SELECT updated_at FROM COMMUNITY WHERE community_id = ?;
`;

// 제목으로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TITLE_KEYWORD = `
SELECT c.*, 
    b.title, b.image_url as bookImg, 
    COALESCE(p.currentCount, 0) AS currentCount
FROM COMMUNITY c
LEFT JOIN 
        (SELECT community_id, COUNT(*) AS currentCount FROM COMMUNITY_USERS cs GROUP BY community_id) p ON c.community_id = p.community_id
    LEFT JOIN 
        BOOK b ON c.book_id = b.book_id  -- 커뮤니티의 book_id를 사용하여 책 정보 조회
    
WHERE REPLACE(b.title, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%') AND is_deleted = 0
ORDER BY c.created_at DESC
LIMIT ? OFFSET ?;
`;


// 태그로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TAG_KEYWORD = `
SELECT c.*, 
    b.title, b.image_url as bookImg, 
    COALESCE(p.currentCount, 0) AS currentCount
FROM COMMUNITY c
LEFT JOIN 
        (SELECT community_id, COUNT(*) AS currentCount FROM COMMUNITY_USERS cs GROUP BY community_id) p ON c.community_id = p.community_id
    LEFT JOIN 
        BOOK b ON c.book_id = b.book_id  -- 커뮤니티의 book_id를 사용하여 책 정보 조회
    
WHERE REPLACE(c.tag, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%') AND is_deleted = 0
ORDER BY c.created_at DESC
LIMIT ? OFFSET ?;
`;
