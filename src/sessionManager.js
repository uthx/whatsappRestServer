// import {Client, LocalAuth} from 'whatsapp-web.js';
import WhatsappClient from "whatsapp-web.js";
import qrCode from "qrcode-terminal";
export const sessionManager = (sessionId) => {
  console.log("started");
  console.log("sesisonId", sessionId);
  const client = new WhatsappClient.Client({
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new WhatsappClient.LocalAuth({
      clientId: sessionId,
    }),
  });
  // client.on("authenticated", () => {
  //   console.log(`Client: ${sessionId} is Authenticated`);
  // });

  // client.on("qr", (code) => {
  //   console.log(` Generating QE for ${sessionId}`);
  //   qrCode.generate(code, { small: true });
  // });

  // client.on("ready", () => {
  //   console.log(`Client : ${sessionId} is ready.`);
  // });
  // client.on("message", (message) => {
  //   console.log(`Client: ${sessionId} received a mesage`, message.body);
  // });
  client.initialize();

  return client;
};
