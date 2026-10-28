
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        await connectToDb();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server listening on 0.0.0.0:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

await startServer();
