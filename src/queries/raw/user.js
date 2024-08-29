/**
 * @var {string} usersLoggedIn
 * @description Query to get the top trending users when logged in
 * @returns {string} - The query string
*/
const usersLoggedIn = /*sql*/`
  WITH user_followers AS (SELECT "to", TRUE AS is_following FROM account.connects WHERE "from" = :user)
  SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.needs,  u.verified, u.contact, COALESCE(uv.views_count, 0) AS user_views, COALESCE(uf.is_following, FALSE) AS is_following
  FROM account.users 
  LEFT JOIN  user_followers uf ON u.hash = uf."to"
  WHERE  u.hash != :user
  ORDER u.followers DESC
  LIMIT :limit OFFSET :offset;
`

/**
 * @var {string} usersLoggedOut
 * @description Query to get the top trending users when logged out
 * @returns {string} - The query string
*/
const usersLoggedOut = /*sql*/`
  SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.needs, u.verified, u.contact, COALESCE(uv.views_count, 0) AS user_views, FALSE AS is_following
  FROM account.users u
  ORDER BY u.followers DESC
  LIMIT :limit OFFSET :offset;
`

module.exports = {
  usersLoggedIn, usersLoggedOut
}