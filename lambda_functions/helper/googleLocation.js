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

//https://github.com/googlemaps/google-maps-services-js is helpful

'use strict';
//Setup for the Google Maps Node Client Library.
const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAPS_KEY,
    Promise: Promise
});
//Content that is reused in different instances.
const texts = require('./../messages/staticTexts');
module.exports = {
    /**
     * This takes the text message and does a geocoding from there.
     * 
     * This takes the text message and does a geocoding from there;
     * there is no NLP looking for relevant data within the text first
     * which could be a good thing to add.
     * 
     * @param {String} text The text the user sent.
     * @param {String} language The language used by the user.
     * 
     * @return {Array} Data to send back to user on Facebook.
     */
    textSearch: function (text, language) {
        let googleMapsObj = {};
        googleMapsObj.location = {};

        //Will this do a free text search, get lat/long and then use the output to do the others
        return googleMapsClient.geocode({ address: text })
            .asPromise()
            .then((response) => {
                if (response.json.results[0]) {
                    googleMapsObj.location.lat = response.json.results[0].geometry.location.lat;
                    googleMapsObj.location.lng = response.json.results[0].geometry.location.lng;
                    //This is just building a basic static map but there are other things the API can do
                    googleMapsObj.staticMapUrl = staticMapUrl(googleMapsObj);

                    googleMapsObj.geocodeResponse = response.json.results;
                    return processGeocodeData(googleMapsObj, language);
                } else {
                    return [texts[language].addressCannotBeGeocoded]
                }
            })
            .catch((err) => {
                console.log(err);
                return [texts[language].error];
            });
    },
    /**
     * This takes in the coordinates from Facebook Location Search buttons.
     * 
     * @param {Object} coordinatesObj The object of the location sent by Facebook.
     * @param {String} language The language used by the user.
     * 
     * @return {Array} Data to send back to user on Facebook.
     */
    coordinatesSearch: function (coordinatesObj, language) {

        let googleMapsObj = {};
        googleMapsObj.location = { lat: coordinatesObj.lat, lng: coordinatesObj.long };

        //do a reverse geocode first and then the rest
        return googleMapsClient.reverseGeocode({
            latlng: [googleMapsObj.location.lat, googleMapsObj.location.lng]
        })
            .asPromise()
            .then((response) => {
                if (response.json.results[0]) {
                    googleMapsObj.geocodeResponse = response.json.results;
                    return processGeocodeData(googleMapsObj, language);
                } else {
                    //can't really think of when this could get triggered
                    //since bad latlng is sent to the catch block
                    //but it is here just in case
                    return [texts[language].coordinatesCannotBeReverseGeocoded];
                }
            })
            .catch((err) => {
                console.log(err);
                if (err.json.error_message == "Invalid request. Invalid 'latlng' parameter.") {
                    return [texts[language].coordinatesCannotBeReverseGeocoded];
                } else {
                    return [texts[language].error];
                }
            });

    }
}

/**
 * This function has multiple things in it like timezone, elevation, places search, etc.
 * 
 * There are more things in the documentation such as directions that are still available
 * even under the free tier and speed limit for the premium plan;
 * https://github.com/googlemaps/google-maps-services-js has more info.
 * 
 * @param {Object} googleMapsObj The object with location info we are building based on lat/lng coordinates.
 * @param {String} language The language used by the user.
 * 
 * @return {Array} The array with the text to send back to the user and the url for the map image.
 */
function processGeocodeData(googleMapsObj, language) {
    let timestamp = Math.floor(new Date().getTime() / 1000);
    return googleMapsClient.timezone({
        location: [googleMapsObj.location.lat, googleMapsObj.location.lng],
        timestamp: timestamp,
        language: language
    })
        .asPromise()
        .then((response) => {
            googleMapsObj.timezoneResponse = response.json;
            return googleMapsClient.elevation({
                locations: googleMapsObj.location
            })
                .asPromise();
        })
        .then((response) => {
            googleMapsObj.elevationResponse = response.json.results;
            return googleMapsClient.places({
                location: [googleMapsObj.location.lat, googleMapsObj.location.lng],
                language: language,
                query: 'fast food',
                radius: 5000,
                minprice: 1,
                maxprice: 4,
                opennow: true,
                type: 'restaurant'
            })
                .asPromise();
        })
        .then((response) => {
            googleMapsObj.placesResponse = response.json.results;
            return googleMapsClient.nearestRoads({
                points: [[googleMapsObj.location.lat, googleMapsObj.location.lng]]
            })
                .asPromise();
        })
        .then((response) => {
            googleMapsObj.nearestRoadsResponse = response.json;
            /**
             * TODO: Uncomment the line below if you want to see all the info you
             * collected from the Google Maps API in Amazon CloudWatch
             */
            // console.log(JSON.stringify(googleMapsObj));

            return [interestingText(googleMapsObj), googleMapsObj.staticMapUrl];
        })
        .catch((err) => {
            console.log(err);
        });
}
/**
 * Return some of the interesting stuff in this demo.
 * There is a 2000 character limit for each text message in FB.
 * 
 * @param {Object} googleMapsObj This is the location object we built above.
 * 
 * @return {String} The text sent to the user for this demo.
 */
function interestingText(googleMapsObj) {
    //These are the names/addresses for the places
    let placesArray = googleMapsObj.placesResponse;
    let placesNameAddress = '';
    if (placesArray) {
        placesArray.forEach(e => {
            let place = e.name + " is at " + e.formatted_address + "\n";
            placesNameAddress += place;
        });
    } else {
        placesNameAddress += 'No places!';
    }

    //These are the place Ids for the nearest Roads
    let snappedPointsArray = googleMapsObj.nearestRoadsResponse.snappedPoints;
    let nearestRoads = '';

    if (snappedPointsArray) {
        snappedPointsArray.forEach(e => {
            nearestRoads += e.placeId + "\n";
        });
    } else {
        nearestRoads += "We don't need roads where we are going!";
    }

    let text = "location: " + JSON.stringify(googleMapsObj.location)
        + '\n\n' + 'formatted_address: ' + googleMapsObj.geocodeResponse[0].formatted_address
        + '\n\n' + 'timeZoneId: ' + googleMapsObj.timezoneResponse.timeZoneId
        + '\n\n' + 'timeZoneName: ' + googleMapsObj.timezoneResponse.timeZoneName
        + '\n\n' + 'elevation: ' + googleMapsObj.elevationResponse[0].elevation
        + '\n\n' + 'places names and addresses:\n' + placesNameAddress
        + '\n' + 'nearestRoads Ids:\n' + nearestRoads;
    return text;
}
/**
 * This is just building a basic static map but there are other things the API can do.
 * https://developers.google.com/maps/documentation/maps-static/dev-guide
 * 
 * @param {Object} googleMapsObj This is the location object we built above.
 */
function staticMapUrl(googleMapsObj) {
    let latLongStr = googleMapsObj.location.lat + "," + googleMapsObj.location.lng;
    return "https://maps.googleapis.com/maps/api/staticmap?center="
        + latLongStr
        + "&size=600x600"
        + "&zoom=10"
        + "&markers=color:blue%7C" + latLongStr
        + "&key=" + process.env.GOOGLE_MAPS_KEY;
}