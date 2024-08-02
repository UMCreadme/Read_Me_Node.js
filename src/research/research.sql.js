

export const deleteSearch = `
DELETE FROM RECENT_SEARCHES
WHERE recent_searches_id = ?;
`