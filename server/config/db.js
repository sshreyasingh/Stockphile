const mongoose = require('mongoose');

const connectToDB = async () => {
    const uri = process.env.MONGO_URI;
    if (!uri || typeof uri !== 'string' || !uri.trim()) {
        console.error('MONGO_URI is missing or empty. Set it in .env (local) or Vercel Environment Variables.');
        return;
    }
    const afterHost = uri.split('.net/')[1] || '';
    if (!afterHost || afterHost.startsWith('?')) {
        console.warn(
            'MONGO_URI should include the database name, e.g. ...mongodb.net/stockphile?retryWrites=true&w=majority'
        );
    }
    try {
        await mongoose.connect(uri.trim(), {
            serverSelectionTimeoutMS: 15000,
        });
        const dbName = mongoose.connection?.db?.databaseName;
        console.log('MongoDB connected', dbName ? `database="${dbName}"` : '');
        if (dbName === 'test') {
            console.warn(
                'Connected to default database "test". Add /stockphile (or your DB name) before ? in MONGO_URI if that was not intended.'
            );
        }
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
    }
};

mongoose.connection.on('connected', () => {
    console.log('MongoDB Atlas connected, db:', mongoose.connection.db?.databaseName);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
});

module.exports = connectToDB;

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log("Connecting to MongoDB...");