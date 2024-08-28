/**
 * @var {string} userPosts
 * @description A query that fetches posts by a logged in user
 * @returns {string} A SQL query
*/
const userPosts = /*sql*/`
  SELECT p.kind, p.author, p.content, p.hash, p.views, p.price, p.location, p.end, p."createdAt", p."updatedAt",
  JSON_BUILD_OBJECT('id', pa.id, 'hash', pa.hash, 'bio', pa.bio, 'name', pa.name, 'picture', pa.picture, 'followers', pa.followers, 'following', pa.following, 'verified', pa.verified,'contact', pa.contact, 'email', pa.email, 'is_following', COALESCE(uc.is_following, FALSE)) AS post_author
  FROM posts.posts p
  LEFT JOIN account.users pa ON p.author = pa.hash
  LEFT JOIN user_connections uc ON pa.hash = uc."to"
  WHERE P.author = :user AND p.published = true
  ORDER p."createdAt" DESC
  LIMIT :limit 
  OFFSET :offset;
`

module.exports = {
  userPosts
}