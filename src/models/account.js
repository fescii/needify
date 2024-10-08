module.exports = (sequelize, Sequelize) => {
	/**
	 * @type {Model}
	 * @name User
	 * @description - This model contains all the user info
	 * @property {Number} id - Unique identifier for the user
	 * @property {String} name - Name of the user
	 * @property {String} hash - Username of the user
	 * @property {String} email - Email of the user
	 * @property {String} password - Password of the user
	 * @property {Object} contact - Contact info of the user
	 * @property {String} bio - Bio of the user
	 * @property {String} picture - Profile picture of the user
	 * @property {String} verified - Boolean showing a user is verified or not.
	 * @property {Number} followers - Number of followers the user has
	 * @property {Number} following - Number of users the user is following
	 * @property {Number} needs - Number of content views the user has.
	*/
	const User = sequelize.define("users", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		hash: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: Sequelize.STRING,
			allowNull: false
		},
		contact: {
			type: Sequelize.JSON,
			allowNull: true
		},
		bio: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		picture: {
			type: Sequelize.STRING,
			allowNull: true
		},
		verified: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: true,
		},
		followers: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: true,
		},
		following: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: true,
		},
		needs: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: true,
		},
	},
	{
		schema: 'account',
		freezeTableName: true,
		timestamps: true,
    timezone: 'UTC',
		indexes: [
			{ unique: true, fields: ['id'] },
			{ unique: true, fields: ['hash'] },
			{ unique: true, fields: ['email'] },
			{	fields: ['name'] },
			{	fields: ['bio'] },
			{	fields: ['followers'] },
			{	fields: ['following'] },
			{	fields: ['verified'] },
			{	fields: ['createdAt'] }
		]
	});

	// add afterSync hook to create the search column and create the GIN index
  User.afterSync(() => {
    // Run the raw SQL query to add the `ts` column
    sequelize.query(`
      ALTER TABLE account.users ADD COLUMN IF NOT EXISTS search tsvector
      GENERATED ALWAYS AS(setweight(to_tsvector('english', coalesce(name, '')), 'A')) STORED;
    `);

    // create the GIN index for the full_search column
    sequelize.query(`CREATE INDEX IF NOT EXISTS search_user_idx ON account.users USING GIN(search)`);
  });

	/**
	 * @type {Model}
	 * @name Code
	 * @description - This model contains all reset password codes
	 * @property {Number} id - Unique identifier for the code
	 * @property {String} code - The reset password code
	 * @property {String} email - Email of the user
	 * @property {Date} expires - Expiry date of the code
	*/
	const Code = sequelize.define("codes", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		expires: {
			type: Sequelize.DATE,
			allowNull: false,
		}
	},
	{
		schema: 'account',
		freezeTableName: true,
		timestamps: true,
    timezone: 'UTC',
		indexes: [
			{ unique: true, fields: ['id'] },
			{ fields: ['code'] },
			{ fields: ['email'] },
			{ fields: ['expires'] },
      { fields: ['createdAt'] }
    ]
	});


	/**
	 * @type {Model}
	 * @name Connect
	 * @description - This model contains all the user connections
	 * @property {Number} id - Unique identifier for the connection
	 * @property {String} from - The hash of the user who initiated the connection
	 * @property {String} to - The hash of the user who received the connection
	 * @property {Boolean} active - The status of the connection
	 * @property {Date} deletedAt - The date the connection was deleted
	*/
	const Connect = sequelize.define("connects", {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		from: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		to: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		active: {
			type: Sequelize.BOOLEAN,
			defaultValue: true,
			allowNull: false,
		},
		deletedAt: {
			type: Sequelize.DATE,
			allowNull: true,
		}
	},
	{
		schema: 'account',
		freezeTableName: true,
		timestamps: true,
    timezone: 'UTC',
		indexes: [
			{ unique: true, fields: ['id'] },
			{ fields: ['from'] },
			{ fields: ['to'] },
      { fields: ['createdAt'] }
    ]
	});

	// add hook to connect model: afterCreate
	Connect.afterCreate(async connect => {
		// Increment followers
		await User.increment('followers', { by: 1, where: { hash: connect.to } });
		
		// increment following
		await User.increment('following', { by: 1, where: { hash: connect.from } });
	});

	// add hook to connect model: afterDestroy
	Connect.afterDestroy(async connect => {
		// decrement followers
		await User.decrement('followers', { by: 1, where: { hash: connect.to } });
    
    // decrement following
    await User.decrement('following', { by: 1, where: { hash: connect.from } });
	});


	// add prototype to search: name_slug_search
  User.search = async queryOptions => {
    const { query, user, offset, limit } = queryOptions;
    if(user !== null) {
			return await sequelize.query(/*sql*/`
				WITH user_followers AS (SELECT "to", TRUE AS is_following FROM account.connects WHERE "from" = :user)
				SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.needs, u.verified, u.contact, COALESCE(uf.is_following, FALSE) AS is_following, ts_rank_cd(to_tsvector('english', u.name), to_tsquery('english', :query)) AS rank
				FROM account.users u
				LEFT JOIN  user_followers uf ON u.hash = uf."to"
				WHERE to_tsvector('english', u.name) @@ to_tsquery('english', :query)
				ORDER BY rank DESC
				LIMIT :limit OFFSET :offset;
				`, { replacements: { user, limit, offset, query }, type: sequelize.QueryTypes.SELECT}
			);
    }
    else {
			return await sequelize.query(/*sql*/`
				SELECT u.hash, u.name, u.email, u.bio, u.picture, u.followers, u.following, u.needs, u.verified, u.contact, false AS is_following, ts_rank_cd(to_tsvector('english', u.name), to_tsquery('english', :query)) AS rank
				FROM account.users u
				WHERE to_tsvector('english', u.name) @@ to_tsquery('english', :query)
				ORDER BY rank DESC
				LIMIT :limit OFFSET :offset;
				`, { replacements: { limit, offset, query }, type: sequelize.QueryTypes.SELECT}
			);
		}
  }

	// Define associations for the Code and User model
	User.hasMany(Code, { foreignKey: 'email', sourceKey: 'email', onDelete: 'CASCADE' });
	Code.belongsTo(User, { foreignKey: 'email', targetKey: 'email', as: 'user_code', onDelete: 'CASCADE' });

	// Define associations for the Connect and User model
	User.hasMany(Connect, { foreignKey: 'from', sourceKey: 'hash', as: 'user_following', onDelete: 'CASCADE' });
	User.hasMany(Connect, { foreignKey: 'to', sourceKey: 'hash', as: 'user_followers', onDelete: 'CASCADE' });
	Connect.belongsTo(User, { foreignKey: 'from', targetKey: 'hash', as: 'from_user', onDelete: 'CASCADE' });
	Connect.belongsTo(User, { foreignKey: 'to', targetKey: 'hash', as: 'to_user', onDelete: 'CASCADE' });

	return {User, Code, Connect};
}