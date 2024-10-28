import { WebSocketServer } from 'ws';
import { connectUser, disconnectUser } from '../controllers/connect.js';

let server;
let webSocket;

export async function startWsServer() {

    console.time('✅ (1/2) Websocket Server Succesfully Started In');

    server = new WebSocketServer({ port: 8080 });  

    // TODO: This does not work
    server.options.maxPayload = 1024 * 1024; // Set max payload size to 1MB
    server.options.maxConnections = 1; // Set max number of connections to 100
    
    server.on('connection', async (ws) => {

        webSocket = ws;

        console.info('🟢 Client Connected');
        let token = await connectUser(ws);
    
        ws.on('message', (message) => {
    
            console.log('🔵 Received Message From Client');
            ws.send(`Echo: ${message}`);
    
        });
    
        ws.on('close', async () => {
    
            await disconnectUser(token);
            console.info('🔴 Client Disconnected');
    
        });
    
        ws.on('error', (error) => {
    
            throw new Error(`WebSocket error: ${error}`);
    
        });
    
    });

    console.timeEnd('✅ (1/2) Websocket Server Succesfully Started In');

}

// Function that can be called from anywhere to send message to client
export async function sendMessage(status, data, command){

    try {
        data || {};
        command || {};
    
        // Default message for internal server error, to prevent information leakage
        if (status === 500){
            console.time('🟡 Sent Error to Client In');
            let message = [{
                status: status,
                error: "An internal server error occurred",
                command: "internal_server_error"
            }];
            webSocket.send(JSON.stringify(message));
            console.timeEnd('🟡 Sent Error to Client In');
            return;
        }
    
        // Default message for bad request error, optionally padd data with the bad request information
        if (status === 400){
            console.time('🟡 Sent Error to Client In');
            let error;
            if (data != {}){
                error = `'${JSON.stringify(data)}' is not a valid request`; 
            }else{
                error = "Bad Request";
            }  
            let message = [{
                status: status,
                error: error,
                command: "bad_request_error",
            }];
            webSocket.send(JSON.stringify(message));
            console.timeEnd('🟡 Sent Error to Client In');
            return;
        }
    
        // Sending a message to cleint if no error has occured.
        console.time('🟣 Sent Message to Client In');
        let message = [{
            status: status,
            data: data,
            command: command
        }];
        webSocket.send(JSON.stringify(message));
        console.timeEnd('🟣 Sent Message to Client In');

    } catch (error) {

        // Sending error to cleint if unable to send message
        try{

            let message = [{
                status: status,
                error: "An internal server error occurred",
                command: "internal_server_error"
            }];
            webSocket.send(JSON.stringify(message));

        } catch (error){

            throw new Error(`Error sending Error to client: ${error}`);

        }

        throw new Error(`Error sending message to client: ${error}`);

    }
    
}

export { server };