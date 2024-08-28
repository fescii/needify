const envConfig = {
  secret: process.env['AUTH_SECRET'],
  jwt_expiry: parseInt(process.env['JWT_EXPIRY']),
  salt_rounds: 10,
  cookie_age: 30 * 24 * 60 * 60 * 1000,
  hash_secret: process.env['HASH_SECRET'],
  node_env: process.env['NODE_ENV'],
  port: process.env['PORT'],
  host: process.env['HOST']
};

const awsConfig = {
  accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
  secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'],
  region: process.env['AWS_REGION'],
  bucket: process.env['AWS_BUCKET']
};

const mapRequestMethod = async method => {
  switch (method) {
    case 'PUT':
      return 'create';
    case 'GET':
      return 'read';
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return 'read';
  }
}

module.exports = {
  envConfig,
  mapRequestMethod, 
  awsConfig
};