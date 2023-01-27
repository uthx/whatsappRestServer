import express from 'express';
import { sendMessage, sendImage, bulkMessage, sendButton } from '../src/controllers/chat.js';
const route = express.Router();

route.post('/sendMessage/:clientSessionId', sendMessage)

route.post('/sendImage/:clientSessionId', sendImage);

route.post('/bulkMessage/:clientSessionId', bulkMessage);

route.post('/sendButton/:clientSessionId', sendButton);

export {
    route
};