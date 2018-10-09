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
 * @constant {Array} quickReplies The different quick_replies that are re-used in different languages.
 */
const quickReplies = {
    en: {
        generic: [
            {
                "content_type":"location"
            },
            {
                "content_type": "text",
                "title": "Help",
                "payload": "helpIntent"
            }
        ]
    }
};

module.exports = quickReplies;