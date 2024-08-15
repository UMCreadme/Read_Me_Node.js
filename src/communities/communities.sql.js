// 커뮤니티의 최대 인원수를 조회하는 쿼리
export const GET_COMMUNITY_CAPACITY = `
    SELECT capacity FROM COMMUNITY WHERE community_id = ?
`;

// 커뮤니티에 재가입하는 쿼리
export const REJOIN_COMMUNITY = `
    UPDATE COMMUNITY_USERS 
    SET is_deleted = 0, updated_at = NOW(), deleted_at = NULL 
    WHERE community_id = ? AND user_id = ?
`;

// 커뮤니티에 참여하는 쿼리
export const JOIN_COMMUNITY = `
    INSERT INTO COMMUNITY_USERS (community_id, user_id)
    VALUES (?, ?)
`;

// 커뮤니티 현재 참여자 수 조회 쿼리 (탈퇴하지 않은 유저만 카운트)
export const GET_COMMUNITY_CURRENT_COUNT = `
    SELECT COUNT(*) AS count FROM COMMUNITY_USERS WHERE community_id = ? AND is_deleted = 0
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

// 커뮤니티 탈퇴(소프트 딜리트) 쿼리
export const LEAVE_COMMUNITY = `
    UPDATE COMMUNITY_USERS 
    SET is_deleted = 1, deleted_at = NOW(), updated_at = NOW() 
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
        c.updated_at,
        c.content,
        b.title,
        b.author,
        b.image_url AS book_image,
        u.image_url AS leader_image,
        u.account AS leader_account,
        u.user_id AS leader_id,
        u.nickname AS leader_nickname,
        (SELECT COUNT(*) FROM COMMUNITY_USERS cm WHERE cm.community_id = c.community_id) AS member_count
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
        AND cu.role = 'admin' 
        AND c.is_deleted = 0;
`;
export const GET_COMMUNITY_UPDATED_AT = `
SELECT updated_at FROM COMMUNITY WHERE community_id = ?;
`;

export const CHECK_USER_PARTICIPATION_QUERY = `
SELECT COUNT(*) AS count
FROM COMMUNITY_USERS
WHERE community_id = ? AND user_id = ? AND is_deleted = 0;
`;

// 제목으로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TITLE_KEYWORD = `
SELECT 
    c.community_id,
    c.user_id,
    c.book_id,
    c.address,
    c.tag,
    c.capacity,
    c.created_at,
    c.updated_at
FROM COMMUNITY c
JOIN BOOK b ON c.book_id = b.book_id
WHERE REPLACE(b.title, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%')
ORDER BY c.created_at DESC;
`;


// 태그로 커뮤니티 검색 (부분 검색 가능)
export const GET_COMMUNITIES_BY_TAG_KEYWORD = `
SELECT 
    c.community_id,
    c.user_id,
    c.book_id,
    c.address,
    c.tag,
    c.capacity,
    c.created_at,
    c.updated_at  
FROM COMMUNITY c
WHERE REPLACE(c.tag, ' ', '') LIKE CONCAT('%', REPLACE(?, ' ', ''), '%')
ORDER BY c.created_at DESC;
`;

export const CHECK_IF_LEADER = `
    SELECT role 
    FROM COMMUNITY_USERS 
    WHERE community_id = ? AND user_id = ? AND is_deleted = 0
`;

export const CHECK_COMMUNITY_EXISTENCE = `
    SELECT COUNT(*) as count 
    FROM COMMUNITY 
    WHERE community_id = ? AND is_deleted = 0
`;