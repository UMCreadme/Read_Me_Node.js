
export const addSearchQuery = 
`
INSERT INTO RECENT_SEARCHES (user_id, query, book_id)
VALUES (?, ?, ?);
`


export const deleteSearch = `
DELETE FROM RECENT_SEARCHES
WHERE recent_searches_id = ?;
`;

export const SearchUser = `SELECT user_id FROM RECENT_SEARCHES WHERE recent_searches_id = ?;`;

export const getQueriesbyId = `
SELECT rs.query, rs.recent_searches_id, rs.book_id, b.image_url as bookImg, b.title, b.author
FROM RECENT_SEARCHES rs
LEFT JOIN BOOK b ON rs.book_id = b.book_id
WHERE rs.user_id = ?
ORDER BY rs.timestamp DESC
LIMIT 15;
`;

