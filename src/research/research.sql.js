export const getQueriesbyId = `
SELECT query 
FROM RECENT_SEARCHES 
WHERE user_id = ? AND is_deleted = 0
ORDER BY timestamp DESC
LIMIT 15;
`
