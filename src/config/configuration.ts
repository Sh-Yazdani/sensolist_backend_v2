export default () => ({
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://root:sb2D8ByEtDRvGyiJ@cluster0.ispo7zw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  MONGODB_NAME: process.env.MONGODB_NAME || 'sensolist_DB',
  MONGODB_USER: process.env.MONGODB_USER || 'root',
  MONGODB_PASS: process.env.MONGODB_PASS || 'sb2D8ByEtDRvGyiJ',
  Access_Token_Secret: process.env.Access_Token_Secret || "Access_Token_Secret",
  Refresh_Token_Secret: process.env.Refresh_Token_Secret || "Refresh_Token_Secret",
  API_Token_Secret: process.env.Refresh_Token_Secret || "API_Token_Secret",
});

