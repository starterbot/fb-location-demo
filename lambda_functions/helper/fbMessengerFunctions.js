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

//https://developers.facebook.com/docs/messenger-platform/reference &
//https://developers.facebook.com/docs/messenger-platform/reference/send-api/ were helpful

'use strict';
//This the token that Facebook gives to you to make sure you can send messages to a particular
//Facebook Page.  You get it during the bot setup.
const PAGE_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

//This is node module.  That is all.
const https = require('https');

/**
 * We are just explicitly stating the default of RESPONSE.
 * https://developers.facebook.com/docs/messenger-platform/send-messages/#messaging_types
 * 
 * @constant {String} 
 */
const messaging_type = "RESPONSE";


module.exports = {
    /**
      * https://developers.facebook.com/docs/messenger-platform/reference/send-api/#message
      * 
      * @param {String} senderFbId The user id from Facebook.
      * @param {String} text The message sent to users; 2000 character limit.
      * 
      * @return {Object} The object to send to Facebook Messenger.
      */
    sendTextMessage: function (senderFbId, text) {

        var json = {
            messaging_type: messaging_type, recipient: { id: senderFbId },
            message: { text: text },
        };

        return sendAll(json);

    },

    /**
     * https://developers.facebook.com/docs/messenger-platform/send-messages/quick-replies
     * 
     * @param {String} senderFbId The user id from Facebook.
     * @param {String} text The message sent to users; 2000 character limit.
     * @param {Array} quickRepliesArray These are the buttons the user will see; 20 character limit for text..
     * 
     * @return {Object} The object to send to Facebook Messenger.
     */
    sendQuickReplyMessage: function (senderFbId, text, quickRepliesArray) {

        var json = {
            messaging_type: messaging_type, recipient: { id: senderFbId },
            message: {
                text: text,
                quick_replies: quickRepliesArray
            }
        };
        return sendAll(json);
    },
    /**
     * https://developers.facebook.com/docs/messenger-platform/send-messages#sending_attachments
     * 
     * @param {String} senderFbId The user id from Facebook.
     * @param {String} type Type of attachment, may be image, audio, video, file or template; max 25MB.
     * @param {String} url Public url for the attachment.
     * 
     * @return {Object} The object to send to Facebook Messenger.
     */
    sendAttachmentMessage: function (senderFbId, type, url) {

        var json = {
            messaging_type: messaging_type, recipient: { id: senderFbId },
            message: { attachment: { type: type, payload: { url: url } } }
        };
        return sendAll(json);

    }
}

/**
 * This is the main function. 
 * 
 * @param {Object} json The data sent to facebook.
 * 
 */
function sendAll(json) {

    return new Promise(function (resolve, reject) {
        let body = JSON.stringify(json);
        let path = '/v2.6/me/messages?access_token=' + PAGE_TOKEN;
        let options = {
            host: "graph.facebook.com",
            path: path,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        let req = https.request(options, (res) => {
            res.on('data', (d) => {
                let str = '';
                str += d;
                let dataFromMessenger = JSON.parse(str);
                try {
                    let currentTime = new Date().getTime().toString();
                    let outgoingMessageObj = {
                        outgoing_time: currentTime,
                        outgoingMessage: json,
                        dataFromMessenger: dataFromMessenger
                    };
                    resolve(outgoingMessageObj);
                } catch (ex) {
                    console.log('problem with sendAll ex: ' + ex);
                    reject(ex);
                }

            });
        });

        req.on('error', (e) => {
            console.log('problem with request e: ' + e);
            reject(e);
        });
        req.write(body);
        req.end();
    });
}