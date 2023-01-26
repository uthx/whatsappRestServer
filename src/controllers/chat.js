import WhatsappClient from "whatsapp-web.js";
import { client } from "../index.js";
import request from "request";
import { isImageValid } from "../utils/helpers.js";
import { BULK_MESSAGE_LIMIT } from "../utils/constants.js";
import WwebjsSender  from'@deathabyss/wwebjs-sender'; 
// const request = require('request')

const mediadownloader = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

// Post: /sendmessage/:phone
// Post: /sendimage/:phone
// Post: /sendpdf/:phone
// Post: /sendlocation/:phone
// Get: /getchatbyid/:phone
// Get: /getchats

export const sendMessage = async (req, res) => {
  console.log("hello sendMesage");
  try {
    const { phoneNumber, countryCode, message } = req.body;
    console.log({ reqBody: req.body });
    if (!phoneNumber || !countryCode || !message) {
      res.send({
        status: "error",
        message: `Invalid input to sendMessage, INPUT: ${req.body}`,
      });
    }
    const {
      id: { fromMe },
    } = await client.sendMessage(`${countryCode}${phoneNumber}@c.us`, message);
    if (fromMe) {
      res.send({
        status: "success",
        message: `Message successfully sent to ${phoneNumber}`,
      });
    }
  } catch (error) {
    console.log(`Error: sendMessag, ${error}`);
    res.send({ status: "error", message: `Error` });
  }
};

export const sendImage = async (req, res) => {
  try {
    const { phoneNumber, image, caption, countryCode } = req.body;
    if (!phoneNumber || !countryCode || !image || !isImageValid(image)) {
      res.send({
        status: "error",
        message: "please enter valid phone and base64/url of image",
      });
    }
    const media = new WhatsappClient.MessageMedia("image/png", image);
    const {
      id: { fromMe },
    } = await client.sendMessage(`${countryCode}${phoneNumber}@c.us`, media, {
      caption: caption || "",
    });
    if (fromMe) {
      res.send({
        status: "Success",
        message: `Image has been successfully sent to ${phoneNumber}`,
      });
    }
  } catch (error) {
    console.log("Error in sendImage", error);
    res.send({
      status: "Failure",
      message: `sendImage error: ${error}`,
    });
  }
};
/*
 BulkMessage: Sending the same message to multiple users (phoneNumbers) at once
 Max User Limit: 100
 For Later: 
 Include different types of messages: Text Only, Image Only, Image and Text
 */

export const bulkMessage = async (req, res) => {
  /* Expected Input
    "message" : "message",
    "contactInfo" : [{phoneNumber: 'num', countryCode: '91'}] // this field will be stringified
    */
  try {
    const { message, contactInfo } = req.body;
    const parsedContactInfo = JSON.parse(contactInfo);
    // check contactInfo length, it should be >= 100
    // if valid then do a map await and send the messages
    if (
      !parsedContactInfo.length ||
      parsedContactInfo.length > BULK_MESSAGE_LIMIT ||
      !message
    ) {
      console.log("Error bulkMessage, invalid input");
      res.send({
        status: "Failure",
        message: "Error bulkMessage, invalid input",
      });
    }
    await Promise.all(
      parsedContactInfo.map(async (info) => {
        console.log({ info });
        const { phoneNumber, countryCode } = info;
        await client.sendMessage(`${countryCode}${phoneNumber}@c.us`, message);
      })
    );
    res.send({
      status: "Success",
      message: `Bulk message has been sent`,
    });
  } catch (error) {
    console.log("Error: BulkMessage", error);
    res.send({
      status: "Failure",
      message: `bulkMessage error: ${error}`,
    });
  }
};

export const sendButton = async (req, res) => {
  try {
    // const input = {
    //   body: "This is the body of the message, it would be great if you could interact with the below buttons",
    //   buttons: [
    //     {
    //       buttonId: "button_1",
    //       buttonText: {
    //         displayText: "Button 1",
    //       },
    //       type: 1,
    //     },
    //     {
    //       buttonId: "button_2",
    //       buttonText: {
    //         displayText: "Button 2",
    //       },
    //       type: 2,
    //     },
    //   ],
    //   title: "test button title",
    //   footer: "test footer",
    // };
    // const updatedInput = new WhatsappClient.Buttons(
    //   input.body,
    //   input.buttons,
    // );
    // let newinput = [
    //   { buttonId: "customId", buttonText: { displayText: "button1" }, type: 1 },
    //   { buttonId: "n3XKsL", buttonText: { displayText: "button2" }, type: 1 },
    //   { buttonId: "NDJk0a", buttonText: { displayText: "button3" }, type: 1 },
    // ];
    // const { phoneNumber } = req.body;
    // const resp = await client.sendMessage(`${phoneNumber}@c.us`, updatedInput);
    // console.log(resp);
    // res.send({
    //   status: "success",
    //   message: "button sent successfully",
    // });
    const response = await buttonFlow(`${req.body.phoneNumber}@c.us`);
    console.log({response});
     res.send({
      status: "success",
      message: "button sent successfully",
    });
  } catch (error) {
    console.log("button error", error);
    res.send({
      status: "failure",
      message: "error send button",
    });
  }
};

const buttonFlow = async (number) => {
  try {
      console.log("buttonflow log", number)

  let embed = new WwebjsSender.MessageEmbed()
    .sizeEmbed(28)
    .setTitle("✅ | Successful process!")
    .setDescription("The process has been successful!")
    .addField("✔", "To confirm")
    .addField("❌", "To cancel")
    .addFields({
      name: "Now you have 2 buttons to choose!",
      value: "✔ or ❌",
    })
    .setFooter("WwebjsSender")
    .setTimestamp();

  let button1 = new WwebjsSender.MessageButton()
    .setCustomId("confirm")
    .setLabel("✔");

  let button2 = new WwebjsSender.MessageButton()
    .setCustomId("cancel")
    .setLabel("❌");
  console.log({embed})
  return await WwebjsSender.send({
    client,
    number,
    embed: embed,
    button: [button1, button2],
  });
} catch (error) {
  console.log("error",error);
  throw new Error(error)   
}
};