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
import WhatsappClient from "whatsapp-web.js";
import bodyParser from 'body-parser';
import { route } from "../src/routes.js";
import { sessionManager } from "./sessionManager.js";
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
        console.log(`initSession input`, phoneNumber);
        const clientInstance = sessionManager(phoneNumber);
        console.log({clientInstance})
        clientSessionStore[phoneNumber] = clientInstance
        console.log({clientSessionStore});
        res.send("positive")
    } catch (error) {
        console.log("initSession error", error);
        res.send("negative");
    }
})
app.use('/', route)

app.listen(port, () => {
    console.log(`Express Server listing at port ${port}`)
})


