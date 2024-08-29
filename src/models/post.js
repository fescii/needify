module.exports = (User, sequelize, Sequelize) => {
  /**
   * @type {Model}
   * @name Story
   * @description - This model contains all the story info
   * @property {Number} id - Unique identifier for the story
   * @property {String} kind - The kind of story (story, post, poll, article, blog, news, journal)
   * @property {Boolean} published - The status of the story: published or not
   * @property {Number} author - The author of the story: hash of the author
   * @property {String} hash - The hash of the story/ usually a unique identifier generated from hash algorithms(sha256)
   * @property {String} title - The title of the story
   * @property {String} slug - The slug of the story, a unique identifier for the story
   * @property {Array} poll - The poll options of the story. an array of strings
   * @property {Array} votes - The votes of the poll per option. an array of integers
   * @property {String} content - The content of the story
   * @property {String} body - The body of the story
   * @property {Array} topics - The topics of the story. an array of strings
   * @property {Number} views - The number of views the story has
   * @property {Number} likes - The total number of likes the story has
   * @property {Number} replies - The total number of replies the story has
  */
  const Post = sequelize.define("posts", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kind: {
      type: Sequelize.ENUM('product', 'service'),
      allowNull: false,
    },
    published: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    hash: {
      type: Sequelize.STRING,
      unique: true,
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    views: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    end: {
      type: Sequelize.DATE,
      defaultValue: null,
      allowNull: true,
    }
  },{
    schema: 'post',
    freezeTableName: true,
    timestamps: true,
    timezone: 'UTC',
    indexes: [
      { unique: true, fields: ['id'] },
      { fields: ['kind'] },
      { fields: ['published'] },
      { fields: ['author'] },
      { unique: true, fields: ['hash'] },
      { fields: ['views'] },
      { fields: ['end'] },
      { fields: ['createdAt'] }
    ]
  });

  // add afterSync hook to create the search column and create the GIN index
  Post.afterSync(() => {
    // Run the raw SQL query to add the `ts` column
    sequelize.query(`
      ALTER TABLE post.posts ADD COLUMN IF NOT EXISTS search TSVECTOR
      GENERATED ALWAYS AS(setweight(to_tsvector('english', coalesce(name, '')), 'A') || setweight(to_tsvector('english', coalesce(content, '')), 'B') STORED;
    `);

    // create the GIN index for the full_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS search_post_idx ON post.posts USING GIN(search)`);
  });

  // add afterDestroy hook 
  Post.afterDestroy(async post => {
    // construct the job payload:
   
  });


  // add search property to the post
  Post.search = async queryOptions => {
    const { user, query, offset, limit } = queryOptions;
    // check if user is not null
    if (user !== null) {
      return await sequelize.query(/*sql*/`
        SELECT p.kind, p.author, p.content, p.hash, p.views, p.price, p.location, p.end, p."createdAt", p."updatedAt", ts_rank_cd(p.search, to_tsquery('english', '${query}')) AS rank,
        JSON_BUILD_OBJECT('id', pa.id, 'hash', pa.hash, 'bio', pa.bio, 'name', pa.name, 'picture', pa.picture, 'followers', pa.followers, 'following', pa.following, 'verified', pa.verified,'contact', pa.contact, 'email', pa.email, 'is_following', COALESCE(uc.is_following, FALSE)) AS post_author
        FROM posts.posts p
        LEFT JOIN account.users pa ON p.author = pa.hash
        LEFT JOIN user_connections uc ON pa.hash = uc."to"
        WHERE to_tsvector('english', CONCAT(p.name, ' ', p.content)) @@ to_tsquery('english', :query)
        ORDER BY rank DESC, p."createdAt" DESC
        LIMIT :limit 
        OFFSET :offset;
      `,{ replacements: { user, query, offset, limit}, type: sequelize.QueryTypes.SELECT });
    } else {
      return await sequelize.query(/*sql*/`
        SELECT p.kind, p.author, p.content, p.hash, p.views, p.price, p.location, p.end, p."createdAt", p."updatedAt", ts_rank_cd(p.search, to_tsquery('english', '${query}')) AS rank,
        JSON_BUILD_OBJECT('id', pa.id, 'hash', pa.hash, 'bio', pa.bio, 'name', pa.name, 'picture', pa.picture, 'followers', pa.followers, 'following', pa.following, 'verified', pa.verified,'contact', pa.contact, 'email', pa.email, 'is_following', false) AS post_author
        FROM post.posts p
        LEFT JOIN account.users pa ON p.author = pa.hash
        WHERE to_tsvector('english', CONCAT(p.name, ' ', p.content)) @@ to_tsquery('english', :query)
        ORDER BY rank DESC, p."createdAt" DESC
        LIMIT :limit 
        OFFSET :offset;
      `,{ replacements: { query, offset, limit}, type: sequelize.QueryTypes.SELECT });
    }
  }

  //--- Defining the associations ---//
  // User <--> Post
  User.hasMany(Post, { foreignKey: 'author', sourceKey: 'hash', as : 'authored_posts', onDelete: 'CASCADE' });
  Post.belongsTo(User, { foreignKey: 'author', targetKey: 'hash', as: 'post_author', onDelete: 'CASCADE' });

  return { Post }
}