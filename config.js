module.exports = {
    // App Settings
    MONGO_URI: process.env.MONGO_URI || 'localhost',
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'YOUR_UNIQUE_JWT_TOKEN_SECRET',

    // OAuth 2.0
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET'
};
