
// 커뮤니티 검색 쿼리
export const SEARCH_COMMUNITIES = `
    SELECT 
        c.community_id AS communityId,
        c.user_id AS userId,
        c.book_id AS bookId,
        c.address,
        c.tag AS tags,
        c.capacity,
        c.created_at AS createdAt,
        c.updated_at AS updatedAt
    FROM COMMUNITY c
    JOIN BOOK b ON c.book_id = b.book_id
    WHERE REPLACE(c.address, ' ', '') LIKE ?
       OR REPLACE(c.tag, ' ', '') LIKE ?
       OR REPLACE(b.title, ' ', '') LIKE ?
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?;
`;