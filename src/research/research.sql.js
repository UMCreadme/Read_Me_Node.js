

export const deleteSearch = `
DELETE FROM RECENT_SEARCHES
WHERE user_id = ? AND query = ?;
`