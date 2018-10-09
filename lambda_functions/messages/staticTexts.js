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
/**
 * @constant {String} texts The different strings that are reused in different languages.
 */
const texts = {
    en: {
        default: "I am sorry I do not I have answer for that.",
        not_supported: "I am sorry that feature is not supported right now.",
        addressCannotBeGeocoded: "This address cannot be geocoded",
        coordinatesCannotBeReverseGeocoded: "Are you on the moon?",
        error: "Sorry, we ran into a problem at our end.",
        welcomeIntent: "Welcome!!",
        cancelIntent: "Ok, I cancelled that",
        helpIntent: "I am the help message",
        demoA: "Where would you like the pizza to be delivered?",
        demoB: "What is the closest major city to you?",
        demoC: "This form needs your location as an input?"
    }
}

module.exports = texts;