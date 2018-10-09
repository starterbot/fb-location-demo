# Facebook Messenger Location Demo Bot

This is a AWS Serverless Application Repository to build a Facebook bot and handle location information.  It returns some relevants things like timezone, place search, nearby roads, etc.  This is not really a standalone bot but rather something to build on top of in other bots that might need this information for user settings, personalization, etc.

You can see the listing for this Serverless Application [here](https://serverlessrepo.aws.amazon.com/#/applications/arn:aws:serverlessrepo:us-east-1:050606003020:applications~fb-location-demo). 

## How to setup this bot on AWS, FB, and Google.

For the full instructions, go to [FBSetupInstructions.md](https://github.com/starterbot/fb-location-demo/blob/master/FBSetupInstructions.md) to see how to setup this bot.

1. Select the Facebook page you would like to associate to this Facebook app, go through the confirmation process until you get the FB_PAGE_ACCESS_TOKEN.  ![Get the output which is your FB_PAGE_ACCESS_TOKEN](https://github.com/starterbot/fb-location-demo/blob/master/images/get_fb_page_access_token.png)

2. Then go to https://console.cloud.google.com/google/maps-apis/new?project=<GCP_ProjectID> and enable the appropriate Maps APIs.  For this project we will be using:

        a. Places API
        b. Maps Elevation API
        c. Roads API
        d. Maps Static API
        e. Time Zone API
        f. Geocoding API
    There are other APIs that are not implemented in this project but you could find useful.  Some APIs are only available with a Premium plan.  For more information please check out: https://github.com/googlemaps/google-maps-services-js.
3. Get your GCP Maps "API key". ![select API key from credentials](https://github.com/starterbot/fb-location-demo/blob/master/images/create_gcp_credentials_api_key.png)
4. Add the FB_PAGE_ACCESS_TOKEN and GOOGLE_MAPS_KEY tokens to the parameters.  You will need to make up the FB_VERIFICATION_BOT_TOKEN such as "IAmGro0t" (just don't make it this easy) and add this as the final parameter.  Hit deploy.

![Add the tokens you got from previous steps along with the one you need to make up as parameters to this project](https://github.com/starterbot/fb-location-demo/blob/master/images/add_parameters_to_lambda.png)

5. Paste the output API url, the FB_VERIFICATION_BOT_TOKEN you made up, check these boxes: 

        a. messages
        b. messaging_postbacks
        c. messaging_optins
        d. message_deliveries

and hit "Verify and Save".
![setup the Facebook Webhook](https://github.com/starterbot/fb-location-demo/blob/master/images/setup_fb_webhook.png)

Made with ❤️ by Starterbot. Available on the [AWS Serverless Application Repository](https://aws.amazon.com/serverless)

## License

Apache License 2.0 (Apache-2.0)

## TODOs

1. Not sure why the cloudformation creates two stages.  This is a bug on the platform not me (https://github.com/awslabs/serverless-application-model/issues/191)