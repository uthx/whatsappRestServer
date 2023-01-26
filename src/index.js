import express from "express";
import qrCode from 'qrcode-terminal';
import WhatsappClient from "whatsapp-web.js";
import bodyParser from 'body-parser';
import { route } from "../src/routes.js";
const app = express();
const port = 3000;


export const client = new WhatsappClient.Client({
    authStrategy: new WhatsappClient.LocalAuth()
})

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

client.on('qr', code => {
    qrCode.generate(code, {small: true})
})

// Client ready

client.on('ready', () => {
    console.log('Client is ready');
})

client.on('message', message => {
    console.log("messsage", message)
    console.log("Message received", message.body);
})
client.initialize()


app.use('/', route)

app.listen(port, () => {
    console.log(`Express Server listing at port ${port}`)
})