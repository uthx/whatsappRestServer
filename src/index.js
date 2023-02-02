import express from "express";
import bodyParser from 'body-parser';
import { route } from "../src/routes.js";
import { sessionManager } from "./sessionManager.js";
import { clientSessionHelper } from "./utils/helpers.js";
const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

export const clientSessionStore = {};
app.post('/initSession/:phone', async (req, res) => {
    console.log("initSession started");
    try {
        const phoneNumber = req.params.phone;
        const existingClient = clientSessionStore[phoneNumber];
        const clientState = await existingClient?.getState();
        console.log({
            clientState
        })
        if(clientState === "CONNECTED") {
            return res.send({
                 "message": "User is already authenticated",
             })
         }
        const clientInstance = sessionManager(phoneNumber);
        clientSessionStore[phoneNumber] = clientInstance;
        const resp = await clientSessionHelper(clientInstance)
        console.log({resp})
        
        if(resp.type === 'qr') {
            return res.send({
                "message": "QR Code Attached",
                "generatedQrCode": resp.code
            })
        } else if(resp.type === 'authenticated' || clientState === "CONNECTED") {
           return res.send({
                "message": "User is already authenticated",
            })
        } else {
            throw new Error(`Unexpected resp.type received : ${resp.type}`)
        }
    } catch (error) {
        console.log("initSession error", error);
        return res.send("negative");
    }
})
app.use('/', route)

app.listen(port, () => {
    console.log(`Express Server listing at port ${port}`)
})
