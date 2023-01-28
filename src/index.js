// import express from "express";
// import qrCode from 'qrcode-terminal';
// import WhatsappClient from "whatsapp-web.js";
// import bodyParser from 'body-parser';
// import { route } from "../src/routes.js";
// const app = express();
// const port = 3000;


// export const client = new WhatsappClient.Client({
//     authStrategy: new WhatsappClient.LocalAuth({
//         clientId: "client1",
//     })
// })
// console.log({client: client.options.puppeteer})
// client.on('authenticated',(sessionData) => {
//     console.log("sessionData",sessionData)
// })
// app.use(express.json());
// app.use(bodyParser.urlencoded({
//   extended: true
// }));

// client.on('qr', code => {
//     qrCode.generate(code, {small: true})
// })

// // Client ready

// client.on('ready', () => {
//     console.log('Client is ready');
// })

// client.on('message', message => {
//     console.log("messsage", message)
//     console.log("Message received", message.body);
// })
// client.initialize()
// process.on("SIGINT", async () => {
//     console.log("(SIGINT) Shutting down...");
//     await client.destroy();
//     process.exit(0);
// })

// app.use('/', route)

// app.listen(port, () => {
//     console.log(`Express Server listing at port ${port}`)
// })


import express from "express";
import qrCode from 'qrcode-terminal';
import bodyParser from 'body-parser';
import { route } from "../src/routes.js";
import { sessionManager } from "./sessionManager.js";
// import qrCode from 'qrcode-terminal';
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

export const clientSessionStore = {};
console.log(clientSessionStore);
app.post('/initSession/:phone', (req, res) => {
    try {
        const phoneNumber = req.params.phone;
        let sent;
        let generatedQrCode;
        let message;
        console.log(`initSession input`, phoneNumber);
        const clientInstance = sessionManager(phoneNumber);
        clientInstance.on('qr', code => {
            console.log("Flow in qr code")
            if(!sent) {
                sent = true;
                generatedQrCode = code
                message = "QR Code Attached"
                console.log("QR Code Attached")
                qrCode.generate(code , {small: true})
                res.send({
                    message,
                    generatedQrCode
                })
            } else {
                console.log("User is already authenticated")
            }
        })
        clientInstance.on('authenticated', () => {
            // user is already authenticated
            console.log("Flow in auth check")
            if(!sent) {
                sent = true
                message = "Authentication complete"
                console.log("Authentication complete")
                res.send({
                    message,
                    generatedQrCode
                })
            } else {
                console.log("User is already Authenticated")
            }
        })
        clientSessionStore[phoneNumber] = clientInstance
        console.log({clientSessionStore});
    } catch (error) {
        console.log("initSession error", error);
        res.send("negative");
    }
})
app.use('/', route)

app.listen(port, () => {
    console.log(`Express Server listing at port ${port}`)
})
