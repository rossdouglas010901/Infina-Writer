import { createToken, deleteToken } from '../models/tokens.js';
import dotenv from 'dotenv';

dotenv.config();

export async function connectUser(ws) {

    const client_ip = ws._socket.remoteAddress;
    const client_port = ws._socket.remotePort;

    const token = await createToken(client_ip, client_port);
    ws.send(JSON.stringify(token));
    
    return token;

}

export async function disconnectUser(token) {

    await deleteToken(token._id);

}