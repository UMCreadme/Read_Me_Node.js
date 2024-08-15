export const save = "INSERT INTO USERS(unique_id, email, account, nickname, provider, refresh_token) VALUES (?, ?, ?, ?, ?, ?)"

export const insertUserFavorite = "INSERT INTO USER_FAVORITE(user_id, category_id) VALUES (?,?)"

export const getRefreshToken = "SELECT refresh_token FROM USERS WHERE user_id = ?"

export const updateRefreshToken = "UPDATE USERS SET refresh_token = ? WHERE user_id = ?"

export const getUserByUniqueIdAndEmail = "SELECT * FROM USERS WHERE unique_id = ? AND email = ?";

export const getUserById = "SELECT * FROM USERS WHERE user_id = ?";

export const getUserFollowings = "SELECT * FROM FOLLOW WHERE follower = ?";

export const getUserFollowers = "SELECT * FROM FOLLOW WHERE user_id = ?";

export const getUserShortsById = "SELECT * FROM SHORTS WHERE user_id = ? AND is_deleted = false ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserLikeShortsIdById = "SELECT shorts_id FROM LIKE_SHORTS WHERE user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserReadBooksIdById = "SELECT book_id FROM USER_BOOK WHERE user_id = ? ORDER BY CREATED_AT DESC LIMIT ? OFFSET ?";

export const getUserReadBooksByUserId = "SELECT book_id FROM USER_BOOK WHERE user_id = ?";

export const addFollowUser = "INSERT INTO FOLLOW(follower, user_id) VALUES(?, ?)";

export const cancelFollowUser = "DELETE FROM FOLLOW WHERE follower = ? AND user_id = ?";

export const findFollowStatus = "SELECT * FROM FOLLOW WHERE follower = ? AND user_id = ?";

export const findIfContainsKeywordWithUserId = `SELECT * FROM USERS WHERE user_id = ? AND ( (CASE WHEN ? = 'account' THEN account ELSE nickname END) LIKE CONCAT('%', ?, '%') )`;

export const findAllIfContainsKeyword =  `SELECT * FROM USERS WHERE ( (CASE WHEN ? = 'account' THEN account ELSE nickname END) LIKE CONCAT('%', ?, '%') )`;

export const getEachFollowIdList = `SELECT follower FROM FOLLOW WHERE user_id = ? AND follower IN ( SELECT user_id FROM FOLLOW WHERE follower = ?);`

export const getMeFollowIdList = `SELECT follower FROM FOLLOW WHERE user_id = ? AND follower NOT IN ( SELECT user_id FROM FOLLOW WHERE follower = ?);`

export const getMyFollowIdList = `SELECT user_id FROM FOLLOW WHERE follower = ? AND user_id NOT IN ( SELECT follower FROM FOLLOW WHERE user_id = ?);`

export const findAllIfContainsKeywordOrdered = `
  SELECT u.*, COUNT(f.follower) AS follower_count
  FROM USERS u
  LEFT JOIN FOLLOW f ON u.user_id = f.user_id
  WHERE (CASE WHEN ? = 'account' THEN u.account ELSE u.nickname END) LIKE CONCAT('%', ?, '%')
  GROUP BY u.user_id
  ORDER BY follower_count DESC;
`;

// 최근 24시간 이내의 게시물 수를 가져오는 쿼리
export const getLatestPostCount = `
  SELECT COUNT(*) AS count
  FROM SHORTS
  WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
`;

export const updateUserImageSql = `
    UPDATE USERS
    SET image_url = COALESCE(?, image_url)
    WHERE user_id = ?
`;

export const deleteUserImageSql = `
    UPDATE USERS
    SET image_url =  "https://readme-image.s3.ap-northeast-2.amazonaws.com/profile/default-profile.png"
    WHERE user_id = ?
`

export const updateUserInfoSql = `
    UPDATE USERS
    SET nickname = COALESCE(?, nickname), 
        account = COALESCE(?, account), 
        comment = COALESCE(?, comment)
    WHERE user_id = ?
`