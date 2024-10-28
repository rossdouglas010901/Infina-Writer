import { startWsServer } from './drivers/ws.js';
import { shutdown } from './utils/shutdown.js';

//Setting Up the console, for clean de-bugging
//console.clear();
console.group("🚀 Starting Up 🚀");

//Start the WebSocket server
await startWsServer();

//Gracefully shutdown the server on crtl + c, or with nodemon
process.on('SIGINT', async function() {
    shutdown();
});