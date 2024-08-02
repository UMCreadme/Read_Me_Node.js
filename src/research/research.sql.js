export const getQueriesbyId = `
SELECT query, search_type
FROM RECENT_SEARCHES 
WHERE user_id = ?
ORDER BY timestamp DESC
LIMIT 15;
`
