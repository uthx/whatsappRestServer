import WhatsappClient from "whatsapp-web.js";
import { isImageValid, getClientInstance } from "../utils/helpers.js";
import { BULK_MESSAGE_LIMIT } from "../utils/constants.js";
import WwebjsSender  from'@deathabyss/wwebjs-sender'; 

export const sendMessage = async (req, res) => {
  console.log("hello sendMessage");
  try {
      const client = getClientInstance(req.params.clientSessionId);
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
    const client = getClientInstance(req.params.clientSessionId);
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
    const client = getClientInstance(req.params.clientSessionId);
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
    const client = getClientInstance(req.params.clientSessionId);
    const response = await buttonFlow(`${req.body.phoneNumber}@c.us`, client);
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

const buttonFlow = async (number, client) => {
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