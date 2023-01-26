import { base64regex } from "./constants.js";
import { clientSessionStore } from "../index.js";
// checks if string is base64 encoded
export const isImageValid = str => base64regex.test(str);   

export const getClientInstance = (sessionId) => {
    if(!sessionId) throw new Error(`getClientInstance: Invalid sessionId: ${sessionId}`);
    const client = clientSessionStore[sessionId];
    if(!client) throw new Error(`getClientInstance: No existing session found for clientSessionId : ${sessionId}`);
    return client;
}