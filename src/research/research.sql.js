

export const deleteSearch = `
DELETE FROM RECENT_SEARCHES
WHERE recent_searches_id = ?;
`

export const SearchUser = `SELECT user_id FROM RECENT_SEARCHES WHERE recent_searches_id = ?;`;