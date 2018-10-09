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

//This is the verification token used during Facebook bot setup to set the webhook.
const VERIFY_TOKEN = process.env.FB_VERIFICATION_BOT_TOKEN;

//Sort throught the different types of POST messages
const dispatch = require('./core/messageDispatch');

/**
 * Main function for the lambda event.
 * @param {Object} event The event that triggered the lambda function.
 * @param {Object} context The lambda context object.
 */
exports.handler = async (event, context) => {

  //Process GET request
  if (event.params && event.params.querystring) {
    let getStr = await fbGetRequest(event);
    return getStr;
  }
  //Process POST request
  else {
    await fbPostRequest(event, context);
    return "You had " + context.getRemainingTimeInMillis() + " ms remaining.";
  }
};

/**
 * Process GET request.
 * 
 * This is used by Facebook when they are trying to set a webhook during bot setup.
 * 
 * @param {Object} event The event that triggered the lambda function.
 */
async function fbGetRequest(event) {

  let queryParams = event.params.querystring;
  let rVerifyToken = queryParams['hub.verify_token']

  if (rVerifyToken === VERIFY_TOKEN) {
    let challenge = queryParams['hub.challenge'];
    return parseInt(challenge);
  } else {
    return 'Error, wrong validation token';
  }
}

/**
 * Process POST request.
 * 
 * Facebook is sending us messages.
 * 
 * @param {Object} event The event that triggered the lambda function.
 */
async function fbPostRequest(event) {
  //option to do localization
  const language = "en";

  let messagingEvents = event.entry[0].messaging;

  for (var i = 0; i < messagingEvents.length; i++) {
    let messagingEvent = messagingEvents[i];

    let sender = messagingEvent.sender.id;
    //check to make sure there is an actual message
    if ((messagingEvent.postback) || (messagingEvent.message)) {
      //sort throught the different types of messages
      return dispatch.messageDispatch(messagingEvent, sender, language);
    } else {
      //this is the message delivery confirmation/error from FB
      // console.log("No message event: " + JSON.stringify(event));
      return;
    }
  }
}