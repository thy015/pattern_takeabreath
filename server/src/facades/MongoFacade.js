const mongoose = require('mongoose');

class MongoFacade {
    constructor() {
        this.connection = null;
    }

    async connect(uri) {
        try {
            this.connection = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log('MongoDB connected successfully');
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        if (this.connection) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected successfully');
        }
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = new MongoFacade();