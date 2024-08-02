export const addSearchQuery = 
`
INSERT INTO RECENT_SEARCHES (user_id, query, book_id)
VALUES (?, ?, ?);
`