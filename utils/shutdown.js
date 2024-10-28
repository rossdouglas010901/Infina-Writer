import { db } from '../drivers/db.js';
import { WebSocket } from 'ws';
import { server } from '../drivers/ws.js';

export async function shutdown() {
    console.log('');
    console.group("❌ Shutting Down ❌");
    console.time(`🛑 (1/4) Disconnecting ${server.clients.size} Clients In`);
    console.time('🛑 (2/4) WebSocket Server Closed In');
    console.time('🛑 (3/4) Cleared All Tokens In');
    console.time('🛑 (4/4) MongoDB Disconnected In');

    await new Promise(async (resolve) => {
        
        await server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('503 Service Unavailable: Server is shutting down');
            }
            client.terminate();
        });
        console.timeEnd(`🛑 (1/4) Disconnecting ${server.clients.size} Clients In`);

        await new Promise((resolve) => {
            server.close(() => {
                console.timeEnd('🛑 (2/4) WebSocket Server Closed In');
                resolve();
            });
        });

        await db.collection('tokens').drop().then(() => {
            console.timeEnd('🛑 (3/4) Cleared All Tokens In');
        }).catch((error) => {
            console.error('Error dropping tokens collection:', error);
        });
    
        await db.disconnect().then(() => {
            console.timeEnd('🛑 (4/4) MongoDB Disconnected In');
        });

        resolve();
    }).then(() => {

        console.groupEnd("❌ Shutting Down ❌");
        console.log('');
        process.exit();
        
    });
}