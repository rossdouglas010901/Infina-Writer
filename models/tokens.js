import { db } from '../drivers/db.js';

export async function createToken(client_ip, client_port) {
    const timestamp = new Date();

    try {
        const result = await db.collection('tokens').insertOne({
            active: true,
            client_ip: client_ip,
            client_port: client_port,
            created: timestamp,
            updated: timestamp
        });
        return result.insertedId;
    } catch (error) {
        throw new Error('Token creation failed: ' + error.message);
    }
}

export async function readToken(token_id) {
    try {
        const token = await db.collection('tokens').findOne({ _id: token_id });
        return token;
    } catch (error) {
        throw new Error('Token read failed: ' + error.message);
    }
}

export async function readTokens(query) {
    try {
        const tokens = await db.collection('tokens').find(query).toArray();
        return tokens;
    }  
    catch (error) {
        throw new Error('Token read failed: ' + error.message);
    }
}  

export async function updateToken(token_id, update) {
    try {
        const result = await db.collection('tokens').updateOne  ({ _id: token_id }, { $set: update });
        return result;
    }
    catch (error) {
        throw new Error('Token update failed: ' + error.message);
    }
}

export async function deleteToken(token_id) {
    try {
        await db.collection('tokens').deleteOne({ _id: token_id });
    } catch (error) {
        throw new Error('Token deletion failed: ' + error.message);
    }
}
