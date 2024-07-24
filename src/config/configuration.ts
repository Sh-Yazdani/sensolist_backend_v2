export default () => ({
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://root:1234@localhost:27017/',
  MONGODB_NAME: process.env.MONGODB_NAME || 'sensolist_DB',
  MONGODB_USER: process.env.MONGODB_USER || 'root',
  MONGODB_PASS: process.env.MONGODB_PASS || '1234',
});

