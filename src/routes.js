import express from 'express';
import { sendMessage, sendImage, bulkMessage, sendButton } from '../src/controllers/chat.js';
const route = express.Router();

// test router
route.get('/userName',(req, res) => {
    console.log("/userName running");
    res.send({user: "1"})
})
route.post('/userName',(req, res) => {
    console.log("/userName running post");
    res.send({user: "1"})
})

route.post('/sendMessage', sendMessage)

route.post('/sendImage', sendImage);

route.post('/bulkMessage', bulkMessage);

route.post('/sendButton', sendButton);

export {
    route
};