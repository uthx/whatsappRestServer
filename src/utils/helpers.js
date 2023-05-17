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

const message = `
Welcome to our salon! To help make your experience as smooth as possible, we have a variety of services available
Reply 1 for more information on haircuts
Reply 2 for information on coloring services
Reply 3 for information on manicures and pedicures
Reply 4 for information on other salon services.
`
const options = {
    1: "resp for option 1",
    2: "resp for option 2",
    3: "resp for option 3",
    4: "resp for option 4"
}
export const clientSessionHelper = async (client) => {
    return new Promise((resolve, reject) => {
        client.on('qr', code => {
            console.log("Event Type: qr");
            return resolve({type: 'qr', code})
        })
        client.on('authenticated', () => {
            console.log("Event Type: authenticated")
            return resolve({type: 'authenticated'})
        })
        client.on('disconnected', () => {
            console.log("Event Type: disconnected")
            // return resolve({type: 'disconnected'})
        })
        client.on('auth_failure', () => {
            console.log("Event Type: auth_failure")
            // return resolve({type: 'auth_failure'})
        })
        client.on('message',(msgData) => {
            console.log("Message received: ", msgData.body);
            if(msgData.body === "Hi"){
                console.log("hi block: ", msgData.body);

                client.sendMessage(msgData.from,message);
            }else if(msgData.body === "1"){
                console.log("1 block: ", msgData.body);

                client.sendMessage(msgData.from,options[1]);
            }else if(msgData.body === "2"){
                console.log("2 block: ", msgData.body);

                client.sendMessage(msgData.from,options[2]);
            }else if(msgData.body === "3"){
                console.log("3 block: ", msgData.body);

                client.sendMessage(msgData.from,options[3]);
            }else if(msgData.body === "4"){
                console.log("4 block: ", msgData.body);

                client.sendMessage(msgData.from,options[4]);
            }

        })
        client.on('ready', () => {
            console.log("Event Type: ready")
            // return resolve({type: 'ready'})
        })
    })
}

