/*
 * Copyright (C) 2018 Starter Bot
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

//Content that is reused in different instances.
const texts = require('./../messages/staticTexts');
const quickReplies = require('./../messages/quickReplies');

//facebook functions
const fb = require('./../helper/fbMessengerFunctions');

//location functions
const googleLocation = require('./../helper/googleLocation');

module.exports = {
    /**
     * Check what kind of message Facebook sent like payloads, attachments, and text.
     * 
     * The sorting hat of Facebook Messenger functions.
     * 
     * @param {Object} messagingEvent The relevant data sent from FB messenger.
     * @param {String} sender The Facebook id that sent the message.
     * @param {String} language The language used by the user.
     */
    messageDispatch: function (messagingEvent, sender, language) {
        return new Promise(function (resolve) {
            let payload;
            //postback from menu; postbacks are just used as demos for this bot
            if (messagingEvent.postback) {
                payload = messagingEvent.postback.payload;
                resolve(postback(sender, language, payload));
            }
            //we do not handle quick reply messages like help for this demo bot
            else if (messagingEvent.message.quick_reply) {
                payload = messagingEvent.message.quick_reply.payload;
                let text1 = "You said: " + payload;
                let text2 = texts[language].default;
                resolve(sendTextAndQuickReply(sender, language, text1, text2));
            }
            //check to see if an image, gif, or video is sent
            //if you are going to support multiple types of attachments,
            //then I suggest creating a separate function just for attachement message dispatch
            else if (messagingEvent.message.attachments) {
                //a location was sent
                if (messagingEvent.message.attachments[0].payload.coordinates) {
                    payload = messagingEvent.message.attachments[0].payload.coordinates;
                    let text1 = "You sent: " + JSON.stringify(payload);
                    googleLocation.coordinatesSearch(payload, language)
                        .then((responseArray) => {
                            //we are ignoring the static map image url in the array because FB shows a map
                            resolve(sendTextAndQuickReply(sender, language, text1,
                                responseArray[0]));
                        })
                        .catch((err) => {
                            console.log(err);
                            let text2 = texts[language].error;
                            resolve(sendTextAndQuickReply(sender, language, text1, text2));
                        });
                } else {
                    let text1 = "You sent: an attachment";
                    let text2 = texts[language].default;
                    resolve(sendTextAndQuickReply(sender, language, text1, text2));
                }

            }
            //nope just a regular old text message
            else if (messagingEvent.message.text) {
                payload = messagingEvent.message.text;
                let text1 = "You said: " + payload;
                //get info from Google Maps; there is no pre-processing from a NLP
                googleLocation.textSearch(payload, language)
                    .then((responseArray) => {
                        //if Google could geocode the text input, then we send back a static image
                        //the static image is important because if you wanted to get some sort of confirmation
                        //from the user the location is correct, then the map image is helpful
                        if (responseArray[1]) {
                            resolve(sendTextAndImageAndQuickReply(sender, language, text1,
                                responseArray[1], responseArray[0]));
                        } else {
                            //Google could not geocode the text input
                            //a good example of this is inputting "Amazon Headquarters"
                            resolve(sendTextAndQuickReply(sender, language, text1,
                                responseArray[0]));
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        let text2 = texts[language].error;
                        resolve(sendTextAndQuickReply(sender, language, text1, text2));
                    });
            }
            else {
                console.log("Something weird was sent from FB");
                resolve(sendQuickReply(sender, language, "You sent something weird from FB"));
            }
        });
    }
}
/**
 * These are just demos to show how processing location data could be useful
 * for a variety of usecases within a messenger bot format.
 * 
 * @param {String} sender The Facebook id that sent the message.
 * @param {String} language The language used by the user.
 * @param {String} payload The postback data sent back from the user from the persistent menu.
 */
function postback(sender, language, payload) {
    let text;
    if (payload == "welcomeIntent") {
        text = texts[language][payload];
        return sendQuickReply(sender, language, text);
    } else {
        text = texts[language][payload];
        if (text == undefined) {
            text = texts[language].error;
            return sendText(sender, text);
        }
        return sendText(sender, text);
    }
}
/**
 * This sends a text message to the user.
 * 
 * There is a 2000 character limit for text messages.
 * 
 * @param {String} sender The Facebook id that sent the message.
 * @param {String} text The text to send to the user in Facebook Messenger; notice there are no quick_replies.
 */
function sendText(sender, text) {

    return fb.sendTextMessage(sender, text)
        .then(firstObj => {
            console.log(firstObj);
        })
        .catch(e => console.log("error: " + e));
}
/**
 * This sends three messages to the user; DO NOT SEND 3 MESSAGES IN PRODUCTION; this is just a demo.
 * 
 * There is a 2000 character limit for each text message and 25MB limit for the image.
 * 
 * @param {String} sender The Facebook id that sent the message. 
 * @param {String} language The language used by the user.
 * @param {String} text1 The text to send to the user in Facebook Messenger in message one.
 * @param {String} imgUrl The url to for the image to send to the user.
 * @param {String} text2 The text to send to the user in Facebook Messenger in message two.
 */
function sendTextAndImageAndQuickReply(sender, language, text1, imgUrl, text2) {
    return fb.sendTextMessage(sender, text1)
        .then(firstObj => {
            console.log(firstObj);
            return fb.sendAttachmentMessage(sender, 'image', imgUrl);
        })
        .then((secondObj) => {
            console.log(secondObj);
            return fb.sendQuickReplyMessage(sender, text2, quickReplies[language].generic);
        }).then((thirdObj) => {
            console.log(thirdObj);
        })
        .catch(e => console.log("error: " + e));
}
/**
 * This sends a text message followed by a quick reply.
 * 
 * There is a 2000 character limit for each text message.
 * 
 * @param {String} sender The Facebook id that sent the message. 
 * @param {String} language The language used by the user.
 * @param {String} text1 The text to send to the user in Facebook Messenger in message one.
 * @param {String} text2 The text to send to the user in Facebook Messenger in message two.
 */
function sendTextAndQuickReply(sender, language, text1, text2) {
    return fb.sendTextMessage(sender, text1)
        .then(firstObj => {
            console.log(firstObj);
            return fb.sendQuickReplyMessage(sender, text2, quickReplies[language].generic);
        })
        .then((secondObj) => {
            console.log(secondObj);
        })
        .catch(e => console.log("error: " + e));
}
/**
 * This just sends a quick reply; it always uses the generic quick reply.
 * 
 * There is a 2000 character limit for text messages.
 * 
 * @param {String} sender The Facebook id that sent the message. 
 * @param {String} language The language used by the user.
 * @param {String} text The text to send to the user in Facebook Messenger.
 */
function sendQuickReply(sender, language, text) {
    return fb.sendQuickReplyMessage(sender, text, quickReplies[language].generic)
        .then(firstObj => {
            console.log(firstObj);
        })
        .catch(e => console.log("error: " + e));

}