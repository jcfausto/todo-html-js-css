var config = {
  port: process.env.PORT || 2000,
  db: process.env.MONGODB_URI || 'mongodb://tododbDevuser:agesune1@ds151431.mlab.com:51431/tododb_dev',
  test_port: 2001,
  test_db: 'mongodb://tododbTstuser:agesune1@ds151941.mlab.com:51941/tododb_test'
};
module.exports = config;
